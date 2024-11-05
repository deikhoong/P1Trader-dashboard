import { useNavigate, useParams } from "react-router-dom";
import { useCourseActions } from "./useCourseActions";
import { Breadcrumb, Button, Form, FormProps, Input, theme, Typography } from "antd";
import { useCallback, useEffect } from "react";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

export default function CourseDetail() {
  const {courseId} = useParams();
  const navigate = useNavigate();
  const {loading, updateCourse, fetchCourse, course} = useCourseActions(courseId);
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
      form.setFieldsValue(course);
    }
  }, [course, form]);

  // const handleUpdate: FormProps<EventRequest>["onFinish"] =
  //   useCallback(async () => {
  //     try {
  //       const formValues = form.getFieldsValue(true);
  //       const eventData = {
  //         ...formValues,
    
  //       };
  //       if (courseId) {
  //         await updateCourse(courseId, eventData);
  //         navigate("/courses");
  //       } else {
  //         throw new Error("Course ID is undefined");
  //       }
  //     } catch (error) {
  //       console.error("Course update failed:", error);
  //     }
  //   }, [form,  updateCourse, navigate]);

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
          name="eventUpdate"
          layout="vertical"
          // onFinish={handleUpdate}
          autoComplete="off"
          className="w-full max-w-4xl"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{required: true, message: "Please enter Title"}]}
          >
            <Input placeholder="Please enter Title" />
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
  );;
}
