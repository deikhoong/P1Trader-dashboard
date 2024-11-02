import {
  Button,
  Form,
  Input,
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
import {useNewsActions} from "./useNewsActions";

import {NewsRequest, NewsType} from "../../api/api.types";
import {UploadFile} from "../../api/common";

export default function NewsCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<NewsRequest>();
  const {loading, createNews} = useNewsActions();
  const [content, setContent] = useState<string>("");
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

  const handleCreate: FormProps<NewsRequest>["onFinish"] =
    useCallback(async () => {
      try {
        const formValues = form.getFieldsValue(true);

        const result = await createNews(formValues);
        if (result) {
          navigate("/news");
        }
      } catch (error) {
        console.error("News creation failed:", error);
      }
    }, [form, createNews, navigate]);

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
          <ArrowLeftOutlined /> Create News
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
          name="newsCreate"
          layout="vertical"
          onFinish={handleCreate}
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
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
