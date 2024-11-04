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
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
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
  const [showRecap, setShowRecap] = useState(false);

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
      const hasRecapInfo =
        event.recapsTitle ||
        event.recapsAttendance ||
        event.recapsDuration ||
        event.recapsDescription ||
        event.recapsLink ||
        event.recapsCover;

      form.setFieldsValue({
        ...event,
        coverId: event.cover?.id,
        speakerAvatarId: event.speakerAvatar?.id,
        recapsCoverId: event.recapsCover?.id,
        startDate: dayjs(event.startDate),
        has_recap: !!hasRecapInfo,
      });

      setDescription(event.content);
      setShowRecap(!!hasRecapInfo);
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
      <Breadcrumb
        className="my-4"
        items={[{title: "Event"}, {title: "Event List"}]}
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
          name="eventUpdate"
          layout="vertical"
          onFinish={handleUpdate}
          autoComplete="off"
          className="w-full max-w-4xl"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{required: true, message: "Please enter  Title"}]}
          >
            <Input placeholder="Please enter  Title" />
          </Form.Item>

          <Form.Item
            label="Cover Image"
            name="coverId"
            rules={[{required: true, message: "Upload Cover Image"}]}
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
              <Button icon={<UploadOutlined />}>UpdateCover Image</Button>
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
              showTime={{format: "HH:mm"}}
              format="YYYY-MM-DD HH:mm"
              className="w-full"
              placeholder="Please Select Start Time"
            />
          </Form.Item>

          <Form.Item
            name="speaker"
            label="Speaker"
            rules={[{required: true, message: "Please enter Speaker Name"}]}
          >
            <Input placeholder="Please enter Speaker Name" />
          </Form.Item>

          <Form.Item name="speakerDescription" label="Speaker Info">
            <Input.TextArea placeholder="Please enter Speaker Info" rows={4} />
          </Form.Item>

          <Form.Item
            label="Speaver Avatar"
            name="speakerAvatarId"
            rules={[{required: true, message: "Upload Speaker Image"}]}
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
              <Button icon={<UploadOutlined />}>Upload Speaker Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="描述"
            rules={[{required: true, message: "Please enter  描述"}]}
          >
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={quillModules}
              placeholder="Please enter  描述"
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
