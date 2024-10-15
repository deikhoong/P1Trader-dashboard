import {Layout} from "antd";
import Sider from "./Sider";
import Header from "./Header";
import PageContent from "./PageContent";

export default function MainLayout() {
  return (
    <Layout>
      <Header />
      <Layout className="mt-[64px]">
        <Sider />
        <Layout style={{marginInlineStart: 200, minHeight: "100vh"}}>
          <PageContent />
        </Layout>
      </Layout>
    </Layout>
  );
}
