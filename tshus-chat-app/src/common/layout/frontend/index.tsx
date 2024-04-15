import { Layout, theme } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Body from '@/common/layout/frontend/body';
import Sidebar from './sidebar';

// Use Token
const { useToken } = theme;

const { Content } = Layout;

const Main: React.FC = () => {
  // Toeken
  const { token } = useToken();

  // Destructure Token
  const { colorBgContainer } = token;

  const background = colorBgContainer;

  // Return
  return (
    <Layout className="h-100">
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
