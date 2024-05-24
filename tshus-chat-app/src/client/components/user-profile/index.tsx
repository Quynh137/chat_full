import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Flex,
  Modal,
  Popover,
  Skeleton,
  Space,
  theme,
  Typography,
} from 'antd';
import {
  Calendar,
  SignOut,
  User as UserIcon,
  WechatLogo,
} from '@phosphor-icons/react';
import { FC, Fragment, useState } from 'react';
import { useAuth } from '@/client/hooks/use-auth';
import { logout } from '@/client/context/auth/reducers';
import { AuthHookType } from '@/common/types/other/hook.type';
import { User } from '@/common/interface/User';
import { BASE_URL } from '@/common/utils/fetcher';
import { formatToDateTime } from '@/common/utils/date';
import { GenderEnum } from '@/common/enum/user/gender.enum';
import { useSocket } from '@/common/hooks/use-socket';
import { TshusSocket } from '@/common/types/other/socket.type';

const { useToken } = theme;

type ModalLogoutProps = {
  auth: AuthHookType<User>;
};

const { Text } = Typography;

const ModelLogout: FC<ModalLogoutProps> = ({ auth }: ModalLogoutProps) => {
  // Open
  const [open, setOpen] = useState(false);

  // Confirm Loading
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Socket
  const socket: TshusSocket = useSocket();

  // Show Modal
  const showModal = () => setOpen(true);

  // Handle Cancel
  const handleCancel = () => setOpen(false);

  // Handle Ok
  const handleOk = async () => {
    // Set Moda
    setConfirmLoading(true);

    setTimeout(async () => {
      setTimeout(async () => {
        // Set Moda
        setConfirmLoading(true);

        // Close Modal
        setOpen(false);

        // Logout
        if (auth?.set) {
          auth.set(logout());

          // Socket
          socket?.disconnect();
        }
      }, 1000);
    }, 1000);
  };

  // Return
  return (
    <Fragment>
      <Button
        onClick={showModal}
        style={{ padding: '5px 8px', height: 'unset', width: '100%' }}
      >
        <Flex align="center" gap={10} justify="start">
          <SignOut size={18} />
          Đăng xuất
        </Flex>
      </Button>
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
    </Fragment>
  );
};

const ModalUserInfo: FC = () => {
  // Token
  const { token } = useToken();

  // Open
  const [open, setOpen] = useState(false);

  // User
  const user = useAuth();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button
          onClick={showDrawer}
          style={{ padding: '5px 8px', height: 'unset', width: '100%' }}
        >
          <Flex align="center" gap={10} justify="start">
            <UserIcon size={18} />
            Thông tin tài khoản
          </Flex>
        </Button>
      </Space>
      <Drawer
        title="Thông tin người dùng"
        placement="left"
        width={400}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        }
      >
        <Flex
          align="center"
          gap={15}
          vertical
          style={{ paddingTop: 30, paddingBottom: 20 }}
        >
          <Avatar
            size={80}
            shape="square"
            alt={user?.get?.nickname?.charAt(0)}
            src={`${BASE_URL}/${user?.get?.avatar}`}
          >
            {user?.get?.nickname?.charAt(0)}
          </Avatar>
          <Flex gap={1} vertical align="center">
            <Text style={{ fontSize: 23 }}>{user?.get?.nickname}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {user?.get?.email}
            </Text>
          </Flex>
        </Flex>
        <Flex vertical gap={10}>
          <Text
            style={{
              color: token.colorTextDescription,
            }}
          >
            THÔNG TIN NGƯỜI DÙNG
          </Text>
          <Flex align="left" gap={15} vertical>
            <Flex vertical gap={10}>
              <Flex align="center" gap={15}>
                <UserIcon
                  size={18}
                  style={{ color: token.colorTextDescription }}
                />
                <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                  Tên đầy đủ: {user?.get?.nickname}
                </Text>
              </Flex>
              <Flex align="center" gap={15}>
                <WechatLogo
                  size={18}
                  style={{ color: token.colorTextDescription }}
                />
                <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                  Giới tính:{' '}
                  {user?.get?.gender === GenderEnum.MALE ? 'Nam' : 'Nữ'}
                </Text>
              </Flex>
              <Flex align="center" gap={15}>
                <WechatLogo
                  size={18}
                  style={{ color: token.colorTextDescription }}
                />
                <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                  Điện thoại: {user?.get?.phone}
                </Text>
              </Flex>
              <Flex align="center" gap={15}>
                <Calendar
                  size={18}
                  style={{ color: token.colorTextDescription }}
                />
                <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                  Ngày tạo:{' '}
                  {formatToDateTime(user?.get?.created_at?.toString())}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Drawer>
    </>
  );
};

const UserProfile: FC = () => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Auth
  const auth: AuthHookType<User> = useAuth();

  // Open
  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  // Return
  return (
    <Popover
      content={
        <Flex>
          <Flex align="center" gap={5} vertical>
            <ModelLogout auth={auth} />
            <ModalUserInfo />
          </Flex>
        </Flex>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="topRight"
    >
      <Flex align="center" justify="space-between">
        <Button type="text" style={{ height: 'unset', padding: '0' }}>
          <Flex align="center" gap={15}>
            {auth?.get ? (
              <Badge dot status="success" offset={[-1, 1]}>
                <Avatar
                  shape="square"
                  alt={auth.get?.nickname?.charAt(0)}
                  size={35}
                  src={`${BASE_URL}/${auth.get?.avatar}`}
                >
                  {auth.get?.nickname?.charAt(0)}
                </Avatar>
              </Badge>
            ) : (
              <Flex gap={10} align="center">
                <Skeleton.Avatar
                  active
                  size={35}
                  shape="square"
                  className="flex-align"
                />
                <Skeleton.Input
                  active
                  style={{ width: 100, height: 35 }}
                  className="flex-align"
                />
              </Flex>
            )}
          </Flex>
        </Button>
      </Flex>
    </Popover>
  );
};

export default UserProfile;
