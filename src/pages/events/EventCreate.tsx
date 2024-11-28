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
  Checkbox,
  InputNumber,
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

import {EventRequest, EventLocation, EventType} from "../../api/api.types";
import {UploadFile} from "../../api/common";

export default function EventCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<EventRequest>();
  const {loading, createEvent} = useEventActions();
  const [description, setDescription] = useState<string>("");
  const [showRecap, setShowRecap] = useState(false);
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

  const handleCreate: FormProps<EventRequest>["onFinish"] =
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
          [{color: []}, {background: []}],
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

  const getRecapRules = (fieldName: string) => [
    {
      required: showRecap,
      message: `Please enter   ${fieldName}`,
    },
  ];

  const handleRecapCheckbox = (e: any) => {
    setShowRecap(e.target.checked);

    if (!e.target.checked) {
      form.setFields([
        {name: "recapsTitle", errors: []},
        {name: "recapsCoverId", errors: []},
        {name: "recapsAttendance", errors: []},
        {name: "recapsDuration", errors: []},
        {name: "recapsDescription", errors: []},
        {name: "recapsLink", errors: []},
      ]);
    }
  };

  return (
    <div className="my-6 mx-4">
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined /> CreateEvent
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
            label="Title"
            rules={[{required: true, message: "Please enter title"}]}
          >
            <Input placeholder="Please enter  Title" />
          </Form.Item>
          <Form.Item
            label="Upload Cover Image"
            name="coverId"
            rules={[{required: true, message: "Please Upload Cover Image"}]}
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
              <Button icon={<UploadOutlined />}>UploadCover Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{required: true, message: "Please Select Type"}]}
          >
            <Select placeholder="Please Select Type">
              <Select.Option value={EventType.WEBINAR}>Webinar</Select.Option>
              <Select.Option value={EventType.AMA}>AMA Session</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{required: true, message: "Please Select Location"}]}
          >
            <Select placeholder="Please Select Location">
              <Select.Option value={EventLocation.ONLINE}>Online</Select.Option>
              <Select.Option value={EventLocation.TAIPEI}>Taipei</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Time"
            rules={[{required: true, message: "Please Select Start Time"}]}
          >
            <DatePicker
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              style={{width: "100%"}}
              placeholder="Please Select Start Time"
            />
          </Form.Item>

          <Form.Item
            name="speaker"
            label="Speaker Name"
            rules={[{required: true, message: "Please enter speaker name"}]}
          >
            <Input placeholder="Please enter speaker name" />
          </Form.Item>
          <Form.Item name="speakerDescription" label="Speaker Info" rules={[{required: true, message:"Please Enter Speaker Info"}]}>
            <Input.TextArea placeholder="Please enter speaker info" rows={4} />
          </Form.Item>
          <Form.Item
            label="Speaver Avatar (100x124)"
            name="speakerAvatarId"
            rules={[{required: true, message: "Upload Speaker Avatar"}]}
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
              <Button icon={<UploadOutlined />}>Upload Speaker Avatar</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{required: true, message: "Please enter content"}]}
          >
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={quillModules}
              placeholder="Please enter content"
            />
          </Form.Item>
          <Form.Item name="has_recap" valuePropName="checked">
            <Checkbox onChange={handleRecapCheckbox}>Last Event Recap</Checkbox>
          </Form.Item>

          {showRecap && (
            <>
              <Form.Item
                name="recapsTitle"
                label="Recap Title"
                rules={getRecapRules("recap Title")}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Input placeholder="Enter recap title" />
              </Form.Item>

              <Form.Item
                label="Recap Cover Image"
                name="recapsCoverId"
                rules={getRecapRules("recap Cover Image")}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item rules={[{required: showRecap}]}>
                <Upload
                  customRequest={(options) =>
                    handleImageUpload({...options, field: "recapsCoverId"})
                  }
                  listType="picture"
                  accept="image/*"
                  maxCount={1}
                  onChange={(info: any) => {
                    if (info.file.status === "removed") {
                      form.setFieldValue("recapsCoverId", "");
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Recap Cover Image
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="recapsAttendance"
                label="Attendance"
                rules={getRecapRules("參與人數")}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  min={0}
                  placeholder="Enter attendance"
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                name="recapsDuration"
                label="Duration (hour)"
                rules={getRecapRules("時間")}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  min={0}
                  placeholder="Enter duration in hours"
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                name="recapsDescription"
                label="Recap Description"
                rules={getRecapRules("recap 描述")}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter recap description"
                />
              </Form.Item>

              <Form.Item
                name="recapsLink"
                label="Recap Link"
                rules={[
                  ...getRecapRules("recap 網址"),
                  {
                    type: "url",
                    message: "Please enter  正確的網址",
                  },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Input placeholder="Enter recap link" />
              </Form.Item>
            </>
          )}

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
