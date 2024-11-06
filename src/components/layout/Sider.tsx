import React from "react";
import {Layout, Menu} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type {MenuProps} from "antd";
import {useNavigate} from "react-router-dom";

export default function Sider() {
  const navigate = useNavigate();
  const {Sider} = Layout;

  const menuItems: MenuProps["items"] = [
    {
      key: "users",
      icon: React.createElement(UserOutlined),
      label: `Users`,
    },
    {
      key: "events",
      icon: React.createElement(CalendarOutlined),
      label: `Events`,
    },
    {
      key: "news",
      icon: React.createElement(ReadOutlined),
      label: `News`,
    },
    {
      key: "courses",
      icon: React.createElement(BookOutlined),
      label: `Courses`,
    },
    {
      key: "orders",
      icon: React.createElement(OrderedListOutlined),
      label: `Orders`,
    },
  ];

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: "64px",
    paddingTop: 10,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarColor: "unset",
  };

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <>
      <Sider style={siderStyle}>
        <Menu
          onClick={onClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["rewriter"]}
          items={menuItems}
        />
      </Sider>
    </>
  );
}
