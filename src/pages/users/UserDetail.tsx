import { Button, Form, Input, Popconfirm, theme, Typography } from "antd";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { UserInfo } from "../../api/api.types";
import { useUserActions } from "./useUserActions";


export default function UserDetail(){
  const { userId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<UserInfo>();
  const { user, loading, fetchUser, updateUser, deleteUser } = useUserActions(userId);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!userId) {
      navigate("/users");
    } else {
      fetchUser();
    }
  }, [userId, navigate, fetchUser]);

  useEffect(() => {
    if (user) {
     form.setFieldsValue(user);
    }
  }, [user, form]);


  const handleDelete = useCallback(async () => {
    await deleteUser();
    navigate('/users');
  }, [deleteUser, navigate]);

  const handleUpdate = useCallback(async () => {
    const updatedFields = form.getFieldsValue(true);

    await updateUser(updatedFields);
  }, [form, updateUser]);

  return (
    <div className="my-6 mx-4">
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title level={2} className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => { window.history.back();}}
        >
          <ArrowLeftOutlined /> {user ? user.email: ''}
        </Typography.Title>
        <div className="flex gap-3">
          <Popconfirm
            title="注意！"
            description="請問要刪除此產品嗎？"
            onConfirm={handleDelete}
            okText="刪除"
            cancelText="取消"
          >
            <Button type="dashed" icon={<DeleteOutlined />} danger >
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
            name="detail"
            labelCol={{ span: 36 }}
            wrapperCol={{ span: 36 }}
            style={{ maxWidth: 1200, width: '50%' }}
            layout="vertical"
            initialValues={user || undefined}
            onFinish={handleUpdate}
            autoComplete="off"
          >
          <Form.Item name="email" label="帳號">
            <Input disabled/>
          </Form.Item>
          <Form.Item name="nickname" label="暱稱">
            <Input placeholder="請輸入暱稱"/>
          </Form.Item>
          <Form.Item  name="tradingViewEmail" label="Trading View Email" rules={[{ type: 'email', message: '請輸入有效的電子郵件地址' }]}>
            <Input placeholder="請輸入Trading View Email"/>
          </Form.Item>
          <Form.Item name="discordId" label="Discord ID">
          <Input placeholder="請輸入iscord ID"/>
          </Form.Item>
          <Form.Item name="phone" >
          
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              儲存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
  
  
}




