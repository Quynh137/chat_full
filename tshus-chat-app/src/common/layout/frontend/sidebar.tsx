import { publicClientRoutes } from '@/client/routes/routes';
import { Button, Flex, Tooltip, theme } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SettingTheme from '@/client/components/setting-theme';
import UserProfile from '@/client/components/user-profile';

// Use Token
const { useToken } = theme;

const Sidebar: React.FC = () => {
  // Location
  const { pathname } = useLocation();

  // Toeken
  const { token } = useToken();

  // Return
  return (
    <Flex
      vertical
      align="center"
      justify="space-between"
      style={{
        padding: '18px',
        backgroundColor: token.colorPrimary,
      }}
    >
      <Flex vertical gap={12} align="center">
        {publicClientRoutes?.map((item: any, index: number) => (
          <Tooltip key={index} placement="rightTop" title={item.name}>
            <Link to={item.path}>
              <Button
                type="text"
                size="large"
                style={{
                  background:
                    pathname === item.path ? 'rgb(255 255 255 / 20%)' : '',
                }}
              >
                {<item.icon size={22} style={{ color: 'white' }} />}
              </Button>
            </Link>
          </Tooltip>
        ))}
      </Flex>
      <Flex vertical gap={12} align="center">
        <SettingTheme />
        <UserProfile/>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
