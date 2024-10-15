import {Content} from "antd/es/layout/layout";
import {Outlet} from "react-router-dom";

export default function PageContent() {
  return (
    <Content>
      <Outlet />
    </Content>
  );
}
