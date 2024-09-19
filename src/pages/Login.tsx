import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuthStore from "../store/authStore";
import { LoginForm } from "../api/api.types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login, isLogin, isLoading } = useAuthStore();

  useEffect(() => {
    if(isLogin){
      navigate('/');
    }
  },[isLogin,navigate])

  const onFinish = async (values: LoginForm) => {
    const response = await login(values);
    if (response) {
      navigate('/');
    } else {
      message.open({type: 'error', content: '登入失敗，請確認帳號密碼是否正確'});
    }
  };

  
  const onValuesChange = () => {
    form.validateFields(['email', 'password']);
  };

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='py-6 px-12 rounded-md bg-white flex justify-center items-center flex-col'>
        <div className="text-black text-2xl leading-[30px] mb-8 text-center font-bold">登入</div>
        <Form<LoginForm>
          className='w-full max-w-[320px]'
          layout="vertical"
          autoComplete="off"
          form={form} 
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            label="帳號"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input placeholder="email" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: 'Password length must greater than 8', min: 8 }]}
          >
            <Input.Password placeholder="password" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                登入系統
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login
