import { useAuth } from '@/client/hooks/use-auth';
import { useConfig } from '@/common/hooks/use-config';
import { publicClientRoutes } from '@/client/routes/routes';
import { SignOut } from '@phosphor-icons/react';
import { App, Button, Flex, Modal, Tooltip, Typography, theme } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '@/client/context/auth/reducers';

// Use Token
const { useToken } = theme;

type ModalLogoutProps = {
  token: any;
  config: any;
};

const ModelLogout: React.FC<ModalLogoutProps> = ({
  token,
  config,
}: ModalLogoutProps) => {
  // Open
  const [open, setOpen] = React.useState(false);

  // Auth
  const auth: any = useAuth();

  // navigate
  const navigate = useNavigate();

  // Message
  const { message }: any = App.useApp();

  // Confirm Loading
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  // Show Modal
  const showModal = () => setOpen(true);

  // Handle Cancel
  const handleCancel = () => setOpen(false);

  // Handle Ok
  const handleOk = async () => {
    // Set Moda
    setConfirmLoading(true);

    // Logout
    await auth.set(
      logout(async () => {
        // Close Modal
        setOpen(false);

        // Set Confirm Loading
        setConfirmLoading(false);

        // Push to login
        // navigate('/auth/login', { replace: true });
      }),
    );
  };

  // Return
  return (
    <React.Fragment>
      <Tooltip title="Đăng xuất" placement="right">
        <Button type="text" size="large" onClick={showModal}>
          <SignOut
            size={22}
            style={{
              color:
                config.get?.theme === 'light'
                  ? token.colorTextSecondary
                  : token.colorWhite,
            }}
          />
        </Button>
      </Tooltip>
      <Modal
        title="Đăng xuất"
        okText="Đăng xuất"
        cancelText="Huỷ"
        open={open}
        okType="danger"
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Typography.Text>
          Bạn có chắc chắn muốn đăng xuất khỏi {auth.get?.nickname}?
        </Typography.Text>
      </Modal>
    </React.Fragment>
  );
};

const Sidebar: React.FC = () => {
  // Location
  const { pathname } = useLocation();

  // Toeken
  const { token } = useToken();

  // Config
  const config = useConfig();

  // Return
  return (
    <Flex
      flex={1}
      vertical
      align="center"
      gap={12}
      style={{
        padding: '18px',
        backgroundColor: token.colorPrimary,
      }}
    >
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
      <ModelLogout token={token} config={config} />
    </Flex>
  );
};

export default Sidebar;
