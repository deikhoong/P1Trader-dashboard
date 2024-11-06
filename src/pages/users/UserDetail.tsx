import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {UserInfo} from "../../api/api.types";
import {useUserActions} from "./useUserActions";

export default function UserDetail() {
  const {userId} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<UserInfo>();
  const {user, loading, fetchUser, updateUser, deleteUser} =
    useUserActions(userId);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
    navigate("/users");
  }, [deleteUser, navigate]);

  const handleUpdate = useCallback(async () => {
    const updatedFields = form.getFieldsValue(true);

    await updateUser(updatedFields);
  }, [form, updateUser]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag: string) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className="my-6 mx-4">
      <div className="flex w-full justify-between items-center mb-3 box-border">
        <Typography.Title
          level={2}
          className="hover:cursor-pointer hover:text-gray-700"
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowLeftOutlined /> {user ? user.email : ""}
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
          name="detail"
          labelCol={{span: 36}}
          wrapperCol={{span: 36}}
          style={{maxWidth: 1200, width: "50%"}}
          layout="vertical"
          initialValues={user || undefined}
          onFinish={handleUpdate}
          autoComplete="off"
        >
          <Form.Item name="email" label="帳號">
            <Input disabled />
          </Form.Item>
          <Form.Item name="nickname" label="暱稱">
            <Input placeholder="Please enter  暱稱" />
          </Form.Item>
          <Form.Item
            name="tradingViewEmail"
            label="Trading View Email"
            rules={[
              {type: "email", message: "Please enter  有效的電子郵件地址"},
            ]}
          >
            <Input placeholder="Please enter  Trading View Email" />
          </Form.Item>
          <Form.Item name="discordId" label="Discord ID">
            <Input placeholder="Please enter  iscord ID" />
          </Form.Item>
          <Form.Item name="phone"></Form.Item>

          <Form.Item name="tags" label="標籤">
            <Space size={[0, 8]} wrap>
              {tags.map((tag: any, index: any) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    closable={true}
                    onClose={() => handleClose(tag)}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible && (
                <Input
                  type="text"
                  size="small"
                  style={{width: 78}}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput} className="site-tag-plus">
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Space>
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
              儲存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
