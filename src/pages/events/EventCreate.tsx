import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Typography,
  theme,
  Upload,
  message,
  FormProps,
} from "antd";
import {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import {useEventActions} from "./useEventActions";

import {
  CreateEventRequest,
  EventLocation,
  EventType,
} from "../../api/api.types";
import {UploadFile} from "../../api/common";

export default function EventCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateEventRequest>();
  const {loading, createEvent} = useEventActions();
  const [description, setDescription] = useState<string>("");
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

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

  const handleCreate: FormProps<CreateEventRequest>["onFinish"] =
    useCallback(async () => {
      try {
        const formValues = form.getFieldsValue(true);
        const eventData = {
          ...formValues,
          content: description,
        };
        const result = await createEvent(eventData);
        if (result) {
          message.success("Event created successfully");
          navigate("/events");
        } else {
          message.error("Failed to create event");
        }
      } catch (error) {
        console.error("Event creation failed:", error);
        message.error("Event creation failed. Please try again.");
      }
    }, [form, description, createEvent, navigate]);

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
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined /> 建立Event
        </Typography.Title>
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
          name="eventCreate"
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
          style={{maxWidth: 1200, width: "100%"}}
        >
          <Form.Item
            name="title"
            label="標題"
            rules={[{required: true, message: "請輸入標題"}]}
          >
            <Input placeholder="請輸入標題" />
          </Form.Item>
          <Form.Item
            label="上傳封面圖"
            name="coverId"
            rules={[{required: true, message: "請上傳封面圖"}]}
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
              <Button icon={<UploadOutlined />}>上傳封面圖</Button>
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
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              style={{width: "100%"}}
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
            label="上傳演講者頭像"
            name="speakerAvatarId"
            rules={[{required: true, message: "請上傳演講者頭像"}]}
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
              <Button icon={<UploadOutlined />}>上傳演講者頭像</Button>
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
              建立
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
