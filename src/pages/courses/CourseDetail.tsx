import {useNavigate, useParams} from "react-router-dom";
import {useCourseActions} from "./useCourseActions";
import {
  Breadcrumb,
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Space,
  theme,
  Typography,
  Upload,
} from "antd";
import {useCallback, useEffect} from "react";
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {UploadFile} from "../../api/common";

export default function CourseDetail() {
  const {courseId} = useParams();
  const navigate = useNavigate();
  const {loading, updateCourse, fetchCourse, course} =
    useCourseActions(courseId);
  const [form] = Form.useForm();
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  useEffect(() => {
    if (!courseId) {
      navigate("/courses");
    } else {
      fetchCourse();
    }
  }, [courseId, navigate, fetchCourse]);

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        ...course,
        tutorImageId: course.tutorImage?.id,
      });
    }
  }, [course, form]);

  const handleUpdate: FormProps<any>["onFinish"] = useCallback(async () => {
    try {
      const formValues = form.getFieldsValue(true);
      const eventData = {
        ...formValues,
      };
      if (courseId) {
        await updateCourse(courseId, eventData);
        navigate("/courses");
      } else {
        throw new Error("Course ID is undefined");
      }
    } catch (error) {
      console.error("Course update failed:", error);
    }
  }, [form, updateCourse, navigate]);

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

  return (
    <div className="my-6 mx-4">
      <Breadcrumb
        className="my-4"
        items={[{title: "Course"}, {title: "Course List"}]}
      />
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => window.history.back()}
        >
          <ArrowLeftOutlined /> {course ? course.title : ""}
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
          name="courseUpdate"
          layout="vertical"
          onFinish={handleUpdate}
          autoComplete="off"
          className="w-full max-w-4xl"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{required: true, message: "Please enter the course name"}]}
          >
            <Input />
          </Form.Item>

          <Form.List name="includes">
            {(fields, {add, remove}) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required={false}
                    key={field.key}
                    label={index === 0 ? "Includes" : ""}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input include item or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input style={{width: "calc(100% - 32px)"}} />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="ml-2"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add include item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="price"
            label="Price"
            rules={[{required: true, message: "Please enter the price"}]}
          >
            <InputNumber min={0} step={0.01} style={{width: "100%"}} />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{required: true, message: "Please enter the title"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{required: true, message: "Please enter the description"}]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.List name="willLearns">
            {(fields, {add, remove}) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required={false}
                    key={field.key}
                    label={index === 0 ? "Will Learn" : ""}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input will learn item or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input style={{width: "calc(100% - 32px)"}} />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="ml-2"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add will learn item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="language"
            label="Language"
            rules={[{required: true, message: "Please enter the language"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subtitles"
            label="Subtitles"
            rules={[{required: true, message: "Please enter subtitles"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tutor Image"
            name="tutorImageId"
            rules={[{required: true, message: "Upload Tutor Image"}]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item rules={[{required: true}]}>
            <Upload
              customRequest={(options) =>
                handleImageUpload({...options, field: "tutorImageId"})
              }
              listType="picture"
              accept="image/*"
              maxCount={1}
              onChange={(info: any) => {
                if (info.file.status == "removed") {
                  form.setFieldValue("tutorImageId", "");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Update Tutor Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="tutorName"
            label="Tutor Name"
            rules={[{required: true, message: "Please enter tutor name"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tutorDescription"
            label="Tutor Description"
            rules={[
              {required: true, message: "Please enter tutor description"},
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="tutorRating" label="Tutor Rating">
            <Input />
          </Form.Item>

          <Form.Item name="tutorReviews" label="Tutor Reviews">
            <Input />
          </Form.Item>

          <Form.Item name="tutorStudents" label="Tutor Students">
            <Input />
          </Form.Item>

          <Form.Item name="tutorCourses" label="Tutor Courses">
            <Input />
          </Form.Item>

          <Form.Item
            name="tutorIntro"
            label="Tutor Intro"
            rules={[{required: true, message: "Please enter tutor intro"}]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.List name="curriculum">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => (
                  <Space
                    key={key}
                    style={{display: "flex", marginBottom: 8}}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {required: true, message: "Missing curriculum name"},
                      ]}
                    >
                      <Input placeholder="Curriculum Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "lessons"]}
                      rules={[
                        {required: true, message: "Missing number of lessons"},
                      ]}
                    >
                      <InputNumber placeholder="Lessons" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "durationTime"]}
                      rules={[
                        {required: true, message: "Missing duration time"},
                      ]}
                    >
                      <Input placeholder="Duration Time" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Curriculum Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="teachableCourseId" label="Teachable Course Id">
            <Input />
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
              Update Course
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
