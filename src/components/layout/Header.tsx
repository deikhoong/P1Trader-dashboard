import {Layout, Dropdown, Space, message, Avatar, MenuProps} from "antd";
// import type { MenuProps } from 'antd';
import {DownOutlined} from "@ant-design/icons";
import LOGO from "../../assets/logo.png";
import {useAuthStore} from "../../store/authStore";
import {Link} from "react-router-dom";

export default function Header() {
  const {Header} = Layout;
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const items: MenuProps["items"] = [
    {
      label: "登出",
      key: "1",
    },
  ];
  const onClick: MenuProps["onClick"] = async () => {
    message.info("登出");
    logout();
  };

  return (
    <Header
      style={{
        top: 0,
        zIndex: 1,
        width: "100%",
        height: "64px",
        display: "flex",
        alignItems: "center",
        position: "fixed",
      }}
      className="bg-slate-950"
    >
      <div className="flex justify-between w-full items-center">
        <Link reloadDocument to={`/`} className="h-[32px]">
          <img src={LOGO} className="h-full" alt="" />
        </Link>
        <div className="text-white">
          <Dropdown menu={{items, onClick}}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  className="bg-slate-300"
                  src="https://api.dicebear.com/9.x/notionists/svg?randomizeIds=true&flip=true"
                />
                <p className="text-sm">{user?.username}</p>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
