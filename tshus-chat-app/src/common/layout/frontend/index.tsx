import { Layout, theme } from 'antd';
import React from 'react';
import Head from '@/common/layout/frontend/head';
import { Outlet } from 'react-router-dom';
import Body from '@/common/layout/frontend/body';
import Sidebar from './sidebar';

// Use Token
const { useToken } = theme;

const { Header, Content } = Layout;

const Main: React.FC = () => {
  // Toeken
  const { token } = useToken();

  // Destructure Token
  const { colorBgContainer, colorBorder } = token;

  const background = colorBgContainer;

  const border: string = `1px solid ${colorBorder}`;

  // Return
  return (
    <Layout className="h-100">
      <Header style={{ background, border, padding: '0 11px' }}>
        <Head />
      </Header>
      <Layout>
        <Content style={{ display: 'flex', background }}>
          <Sidebar />
          <Body>
            <Outlet />
          </Body>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
