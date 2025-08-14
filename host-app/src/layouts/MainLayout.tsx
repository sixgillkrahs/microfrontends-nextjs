import NavLink from "@/components/nav-link";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "custom-ui-antd";
import { Component, ReactNode, useState } from "react";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/contexts/BreadcrumbContext";

interface MainLayoutProps {
  children: ReactNode;
}

const { Header, Footer, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1"),
  getItem("Option 2", "2"),
  getItem("User", "sub1"),
  getItem("Files", "9"),
];

const menu = [
  {
    key: "1",
    // icon: <PieChartOutlined />,
    label: <NavLink href="/">Dashboard</NavLink>,
  },
  {
    key: "2",
    // icon: <SlidersOutlined />,
    label: <NavLink href="/audit">Audit</NavLink>,
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
