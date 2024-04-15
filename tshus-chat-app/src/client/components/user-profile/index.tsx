import {
    Avatar,
    Badge,
    Button,
    Flex,
    Modal,
    Popover,
    Skeleton,
    Typography,
  } from 'antd';
  import { SignOut } from '@phosphor-icons/react';
  import { FC, Fragment, useState } from 'react';
  import { useAuth } from '@/client/hooks/use-auth';
  import { logout } from '@/client/context/auth/reducers';
  import { AuthHookType } from '@/common/types/other/hook.type';
  import { User } from '@/common/interface/User';
  import { BASE_URL } from '@/common/utils/fetcher';
  
  type ModalLogoutProps = {
    auth: AuthHookType<User>;
  };
  
  const { Text } = Typography;
  
  const ModelLogout: FC<ModalLogoutProps> = ({ auth }: ModalLogoutProps) => {
    // Open
    const [open, setOpen] = useState(false);
  
    // Confirm Loading
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    // Show Modal
    const showModal = () => setOpen(true);
  
    // Handle Cancel
    const handleCancel = () => setOpen(false);
  
    // Handle Ok
    const handleOk = async () => {
      // Set Moda
      setConfirmLoading(true);
  
      // Logout
      auth?.set &&
        auth.set(
          await logout(async () => {
            // Close Modal
            setOpen(false);
  
            // Set Confirm Loading
            setConfirmLoading(false);
          }),
        );
    };
  
    // Return
    return (
      <Fragment>
        <Button
          type="text"
          onClick={showModal}
          style={{ padding: '5px 8px', height: 'unset' }}
        >
          <Flex align="center" gap={20} justify="space-between">
            <Text>Đăng xuất</Text>
            <SignOut size={18} />
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
            <Flex align="center" gap={15}>
              <ModelLogout auth={auth} />
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
  