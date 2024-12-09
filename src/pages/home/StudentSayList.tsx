import {
  Breadcrumb,
  theme,
  Typography,
  Table,
  Button,
  message,
  Modal,
  Input,
  Form,
  Popconfirm,
  Upload,
} from "antd";
import {useCallback, useEffect, useState} from "react";
import {DeleteOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import type {TablePaginationConfig} from "antd";
import {Pagination, StudenySayListItem} from "../../api/api.types";
import {
  CreatedStudentSay,
  DeleteStudentSays,
  GetStudentSayVideos,
} from "../../api/home";
import {UploadFile} from "../../api/common";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function StudentSayList() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<StudenySayListItem[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const {token} = theme.useToken();

  const fetchVideos = useCallback(
    async (
      params: Pagination = {
        page: 1,
        take: 10,
      }
    ) => {
      try {
        setLoading(true);
        const {
          page = tableParams.pagination?.current ?? 1,
          take = tableParams.pagination?.pageSize ?? 10,
        } = params;
        const response = await GetStudentSayVideos({page, take});

        setVideos(response.data.data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            current: response.data.meta.page,
            pageSize: response.data.meta.take,
            total: response.data.meta.itemCount,
          },
        }));
      } catch (error) {
        console.error(error);
        messageApi.error("Unable to retrieve Student Says List");
      } finally {
        setLoading(false);
      }
    },
    [messageApi, tableParams.pagination]
  );

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleTableChange = (pagination: TableParams["pagination"]) => {
    fetchVideos({
      page: pagination?.current ?? 1,
      take: pagination?.pageSize ?? 10,
    });
  };

  const handleAddUser = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileBeforeUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      message.error("File size exceeds 10 MB limit");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleFileUpload = async ({onSuccess, onError, file, field}: any) => {
    try {
      const response = await UploadFile(file);
      form.setFieldValue(field, response.data.id);
      onSuccess(response.data.id);
      messageApi.success("File uploaded successfully!");
    } catch (error) {
      messageApi.error("Failed to upload file");
      onError(error);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await CreatedStudentSay(values);
      messageApi.success("Student says created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchVideos();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        messageApi.error(
          error.response.data.message || "Failed to create student says"
        );
      } else {
        messageApi.error("Failed to create student says");
      }
    }
  };

  const handleDelete = async (videoId: number) => {
    try {
      await DeleteStudentSays(videoId);
      messageApi.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.error(error);
      messageApi.error("Unable to delete video");
    }
  };

  const columns = [
    {
      title: "Video (Recommend 1080 × 1920）",
      dataIndex: "video",
      key: "video",
      render: (video: {url: string}) =>
        video ? (
          <a href={video.url} target="_blank">
            {video.url}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: StudenySayListItem) => (
        <Popconfirm
          title="Attention"
          description="Are you sure you want to delete ?"
          onConfirm={() => handleDelete(record.id)}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button type="dashed" icon={<DeleteOutlined />} danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="my-6 mx-4">
        <Breadcrumb
          className="my-4"
          items={[{title: "Testimonial"}, {title: "List"}]}
        />
        <div className="flex w-full justify-between items-center mb-3">
          <Typography.Title level={2}>Testimonial List</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Create Testimonial
          </Button>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
          className="flex gap-5 flex-wrap justify-around"
        >
          <Table
            className="w-full"
            columns={columns}
            loading={loading}
            dataSource={videos}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            rowKey={(record) => record.id ?? "default-key"}
          />
        </div>
      </div>
      <Modal
        title="Add Testimonial Video"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={handleCancel}
        centered
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Testimonial（Recommend 1080 × 1920）"
            name="videoId"
            rules={[{required: true, message: "Upload Testimonial Video"}]}
          >
            <Input
              disabled
              onChange={(e) => {
                console.log(e);
              }}
            />
          </Form.Item>
          <Form.Item
            rules={[{required: true, message: "Video cannot be empty"}]}
          >
            <Upload
              beforeUpload={handleFileBeforeUpload}
              customRequest={(options) =>
                handleFileUpload({...options, field: "videoId"})
              }
              accept="video/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
