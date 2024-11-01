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
  DatePicker,
  Form,
  FormProps,
  Input,
  Popconfirm,
  Select,
  theme,
  Typography,
  Upload,
} from "antd";
import {useEventActions} from "./useEventActions";
import {UploadFile} from "../../api/common";
import {EventLocation, EventRequest, EventType} from "../../api/api.types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import dayjs from "dayjs";

export default function EventDetail() {
  const {eventId} = useParams();
  const navigate = useNavigate();
  const {loading, deleteEvent, updateEvent, fetchEvent, event} =
    useEventActions(eventId);
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  useEffect(() => {
    if (!eventId) {
      navigate("/events");
    } else {
      fetchEvent();
    }
  }, [eventId, navigate, fetchEvent]);

  useEffect(() => {
    if (event) {
      form.setFieldsValue({
        ...event,
        coverId: event.cover?.id,
        speakerAvatarId: event.speakerAvatar?.id,
        startDate: dayjs(event.startDate),
      });
      setDescription(event.content);
    }
  }, [event, form]);

  const handleDelete = async () => {
    const res = await deleteEvent();
    if (res) {
      navigate("/events");
    }
  };

  const handleUpdate: FormProps<EventRequest>["onFinish"] =
    useCallback(async () => {
      try {
        const formValues = form.getFieldsValue(true);
        const eventData = {
          ...formValues,
          content: description,
        };
        if (eventId) {
          await updateEvent(eventId, eventData);
          navigate("/events");
        } else {
          throw new Error("Event ID is undefined");
        }
      } catch (error) {
        console.error("Event update failed:", error);
      }
    }, [form, description, updateEvent, navigate]);

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
        items={[{title: "Event"}, {title: "Event 列表"}]}
      />
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined /> {event ? event.title : ""}
        </Typography.Title>
        <div className="flex gap-3">
          <Popconfirm
            title="注意！"
            description="請問要刪除此產品嗎？"
            onConfirm={handleDelete}
            okText="刪除"
            cancelText="取消"
          >
            <Button type="dashed" icon={<DeleteOutlined />} danger>
              刪除
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
          name="eventUpdate"
          layout="vertical"
          onFinish={handleUpdate}
          autoComplete="off"
          className="w-full max-w-4xl"
        >
          <Form.Item
            name="title"
            label="標題"
            rules={[{required: true, message: "請輸入標題"}]}
          >
            <Input placeholder="請輸入標題" />
          </Form.Item>

          <Form.Item
            label="封面圖"
            name="coverId"
            rules={[{required: true, message: "請上傳封面圖"}]}
          >
            <Input disabled />
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
              <Button icon={<UploadOutlined />}>更新封面圖</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="type"
            label="類型"
            rules={[{required: true, message: "請選擇類型"}]}
          >
            <Select placeholder="請選擇類型">
              <Select.Option value={EventType.WEBINAR}>Webinar</Select.Option>
              <Select.Option value={EventType.AMA}>AMA Session</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="地點"
            rules={[{required: true, message: "請選擇地點"}]}
          >
            <Select placeholder="請選擇地點">
              <Select.Option value={EventLocation.ONLINE}>Online</Select.Option>
              <Select.Option value={EventLocation.TAIPEI}>Taipei</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="開始時間"
            rules={[{required: true, message: "請選擇開始時間"}]}
          >
            <DatePicker
              showTime={{format: "HH:mm"}}
              format="YYYY-MM-DD HH:mm"
              className="w-full"
              placeholder="請選擇開始時間"
            />
          </Form.Item>

          <Form.Item
            name="speaker"
            label="演講者"
            rules={[{required: true, message: "請輸入演講者姓名"}]}
          >
            <Input placeholder="請輸入演講者姓名" />
          </Form.Item>

          <Form.Item name="speakerDescription" label="演講者簡介">
            <Input.TextArea placeholder="請輸入演講者簡介" rows={4} />
          </Form.Item>

          <Form.Item
            label="演講者頭像"
            name="speakerAvatarId"
            rules={[{required: true, message: "請上傳演講者頭像"}]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item rules={[{required: true}]}>
            <Upload
              customRequest={(options) =>
                handleImageUpload({...options, field: "speakerAvatarId"})
              }
              listType="picture"
              accept="image/*"
              maxCount={1}
              onChange={(info: any) => {
                if (info.file.status == "removed") {
                  form.setFieldValue("speakerAvatarId", "");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>更新演講者頭像</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="描述"
            rules={[{required: true, message: "請輸入描述"}]}
          >
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={quillModules}
              placeholder="請輸入描述"
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
              更新
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
