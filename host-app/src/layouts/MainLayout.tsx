import NavLink from "@/components/nav-link";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/contexts/BreadcrumbContext";
import { Breadcrumb, Layout, Menu, theme } from "custom-ui-antd";
import { useState } from "react";

const { Header, Footer, Sider, Content } = Layout;

const menu = [
  {
    key: "1",
    // icon: <PieChartOutlined />,
    label: <NavLink href="/">Dashboard</NavLink>,
  },
  {
    key: "2",
    // icon: <SlidersOutlined />,
    label: "Audit",
    children: [
      {
        key: "debezium-connector",
        // icon: <SlidersOutlined />,
        label: (
          <NavLink href="/audit/debezium-connector">Debezium Connector</NavLink>
        ),
      },
      {
        key: "table-configuration",
        // icon: <SlidersOutlined />,
        label: (
          <NavLink href="/audit/table-configuration">
            Table Configuration
          </NavLink>
        ),
      },
    ],
  },
];

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { items } = useBreadcrumb();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menu}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={items as any} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BreadcrumbProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </BreadcrumbProvider>
  );
}
