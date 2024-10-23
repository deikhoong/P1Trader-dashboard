import {Breadcrumb, theme, Typography, Table, Button, message, Modal, Input, Form, Select,} from "antd";

import {useCallback, useEffect, useState} from "react";

import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import type { TablePaginationConfig} from "antd";
import {useNavigate} from "react-router-dom";
import {CreateUser, GetUsers} from "../../api/users";
import {Pagination, UserListItem, UserRole} from "../../api/api.types";


interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function UserList() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const fetchUsers = useCallback(async (params: Pagination = {
    page: 1,
    take: 10
  }) => {
    try {
      setLoading(true);
      const { page = tableParams.pagination?.current ?? 1, take = tableParams.pagination?.pageSize ?? 10 } = params;
      const response = await GetUsers({ page, take });

      setUsers(response.data.data);
      setTableParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          current: response.data.meta.page,
          pageSize: response.data.meta.take,
          total: response.data.meta.itemCount,
        },
      }));
    } catch (error) {
      console.error(error);
      messageApi.error("無法取得使用者列表");
    } finally {
      setLoading(false);
    }
  }, [messageApi, tableParams.pagination]);

  useEffect(() => {
    fetchUsers();
  }, []); 


  const handleTableChange = (pagination: TableParams['pagination']) => {
    fetchUsers({ page: pagination?.current ?? 1, take: pagination?.pageSize ?? 10 });
  };
  
  const handleAddUser = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };


  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      await CreateUser(values);
      messageApi.success('使用者已成功建立！');
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        messageApi.error(error.response.data.message || '建立使用者失敗');
      } else {
        messageApi.error('建立使用者失敗');
      }
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname', render: (nickname: string | null) => nickname || 'N/A' },
    { title: 'Trading View Email', dataIndex: 'tradingViewEmail', key: 'tradingViewEmail' },
    { title: 'Discord Id', dataIndex: 'discordId', key: 'discordId' },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: UserListItem) => (
        <Button onClick={() => navigate(`/users/${record.id}`)} icon={<EditOutlined />}>
          編輯
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="my-6 mx-4">
        <Breadcrumb
          className="my-4"
          items={[{title: "使用者"}, {title: "列表"}]}
        />
        <div className="flex w-full justify-between items-center mb-3">
          <Typography.Title level={2}>使用者列表</Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
            建立使用者
          </Button>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
          className="flex gap-5 flex-wrap justify-around"
        >
          <Table
            className="w-full"
            columns={columns}
            loading={loading}
            dataSource={users}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </div>
      </div>
      <Modal title="新使用者" open={isModalOpen} onOk={handleCreateUser} onCancel={handleCancel} centered
        okText="建立" cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="帳號 (Email)"
            rules={[
              { required: true, message: '帳號不能為空' },
              { type: 'email', message: '帳號必須是Email格式' },
            ]}
          >
            <Input placeholder="請輸入帳號" prefix={<EditOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            label="密碼"
            rules={[
              { required: true, message: '密碼不能為空' },
              { min: 8, message: '密碼長度不能低於8位數' },
            ]}
          >
            <Input.Password placeholder="請輸入密碼" prefix={<EditOutlined />} />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="名稱 (Nickname)"
            rules={[{ required: true, message: '名稱不能為空' }]}
          >
            <Input placeholder="請輸入名稱" prefix={<EditOutlined />} />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '請選擇角色' }]}
          >
            <Select placeholder="請選擇角色">
              <Select.Option value={UserRole.Admin}>Admin</Select.Option>
              <Select.Option value={UserRole.Member}>Member</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
