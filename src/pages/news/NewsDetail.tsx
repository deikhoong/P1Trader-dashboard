import Breadcrumb from "antd/es/breadcrumb/Breadcrumb";
import message from "antd/es/message";
import {useCallback, useEffect, useMemo, useState} from "react";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {
  Button,
  Form,
  FormProps,
  Input,
  Popconfirm,
  Select,
  theme,
  Typography,
  Upload,
} from "antd";

import {UploadFile} from "../../api/common";
import {NewsRequest, NewsType} from "../../api/api.types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {useNewsActions} from "./useNewsActions";

export default function NewsDetail() {
  const {newsId} = useParams();
  const navigate = useNavigate();
  const {loading, deleteNews, updateNews, fetchNews, news} =
    useNewsActions(newsId);
  const [content, setContent] = useState<string>("");
  const [form] = Form.useForm();

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  useEffect(() => {
    if (!newsId) {
      navigate("/news");
    } else {
      fetchNews();
    }
  }, [newsId, navigate, fetchNews]);

  useEffect(() => {
    if (news) {
      form.setFieldsValue({
        ...news,
        coverId: news.cover?.id,
      });
    }
  }, [news, form]);

  const handleDelete = async () => {
    const res = await deleteNews();
    if (res) {
      navigate("/news");
    }
  };

  const handleUpdate: FormProps<NewsRequest>["onFinish"] =
    useCallback(async () => {
      try {
        const formValues = form.getFieldsValue(true);

        if (newsId) {
          await updateNews(newsId, formValues);
          navigate("/news");
        } else {
          throw new Error("News ID is undefined");
        }
      } catch (error) {
        console.error("News update failed:", error);
      }
    }, [form, updateNews, navigate]);

  const handleImageUpload = async ({onSuccess, onError, file, field}: any) => {
    try {
      const response = await UploadFile(file);
      form.setFieldValue(field, response.data.id);
      onSuccess(response.data.id);
    } catch (error) {
      message.error("Image upload failed. Please try again.");
      onError(error);
    }
  };

  const handleQuillImageUpload = async (file: File): Promise<string | null> => {
    try {
      const response = await UploadFile(file);
      return response.data.url;
    } catch (error) {
      message.error("Image upload failed. Please try again.");
      return null;
    }
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{header: "1"}, {header: "2"}, {font: []}],
          [{list: "ordered"}, {list: "bullet"}],
          ["bold", "italic", "underline"],
          [{align: []}],
          ["link", "image"],
        ],
        handlers: {
          image: function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = async () => {
              const file = input.files ? input.files[0] : null;
              if (file) {
                const imageUrl = await handleQuillImageUpload(file);
                if (imageUrl) {
                  const quill = (this as any).quill;
                  const range = quill.getSelection();
                  quill.insertEmbed(range.index, "image", imageUrl);
                }
              }
            };
            input.click();
          },
        },
      },
    }),
    []
  );

  return (
    <div className="my-6 mx-4">
      <Breadcrumb
        className="my-4"
        items={[{title: "News"}, {title: "News List"}]}
      />
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined /> {news ? news.title : ""}
        </Typography.Title>
        <div className="flex gap-3">
          <Popconfirm
            title="Warning!"
            description="Are you sure you want to delete?"
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button type="dashed" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div
        style={{
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        className="flex justify-between p-10"
      >
        <Form
          form={form}
          name="newsUpdate"
          layout="vertical"
          onFinish={handleUpdate}
          autoComplete="off"
          style={{maxWidth: 1200, width: "100%"}}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{required: true, message: "Please enter Title"}]}
          >
            <Input placeholder="Please enter  Title" />
          </Form.Item>
          <Form.Item
            label="Cover Image"
            name="coverId"
            rules={[{required: true, message: "Upload Cover Image"}]}
          >
            <Input
              disabled
              onChange={(e) => {
                console.log(e);
              }}
            />
          </Form.Item>
          <Form.Item rules={[{required: true}]}>
            <Upload
              customRequest={(options) =>
                handleImageUpload({...options, field: "coverId"})
              }
              listType="picture"
              accept="image/*"
              maxCount={1}
              onChange={(info: any) => {
                if (info.file.status == "removed") {
                  form.setFieldValue("coverId", "");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{required: true, message: "Please select Type"}]}
          >
            <Select placeholder="Please select Type">
              {Object.entries(NewsType).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{required: true, message: "Please enter Content"}]}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="Please enter Content"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
