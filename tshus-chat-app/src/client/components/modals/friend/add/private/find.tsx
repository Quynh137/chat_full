import { App, Avatar, Button, Flex, Modal, Tooltip, Typography } from 'antd';
import { Hourglass, UserPlus, Users } from '@phosphor-icons/react';
import React from 'react';
import { fetcher } from '@/common/utils/fetcher';
import { useAuth } from '@/client/hooks/use-auth';
import { FriendEnum } from '@/common/enum/friend.enum';
import { green, blue } from '@ant-design/colors';
import { baseUrl } from '@/common/utils/fetcher';
import { User } from '@/common/interface/User';
import { Response } from '@/common/types/res/response.type';
import { useConfig } from '@/common/hooks/use-config';

const { Text } = Typography;

type Props = { item: User; closeAddModal: Function };

// Icon Friend Status
const friendStatus = (
  key: FriendEnum,
  friendRequest: any,
  reqfLoading: boolean,
) => {
  // Swith Case
  switch (key) {
    case FriendEnum.PENDING:
      return (
        <Tooltip title="Đã gửi yêu cầu">
          <Button
            loading={reqfLoading}
            icon={<Hourglass size={16} />}
            style={{
              display: 'flex',
              color: '#F29339',
              cursor: 'pointer',
              alignItems: 'center',
              borderColor: '#F29339',
            }}
          >
            Đã yêu cầu
          </Button>
        </Tooltip>
      );
    case FriendEnum.ACCEPTED:
      return (
        <Tooltip title="Đã kết bạn">
          <Button
            icon={<Users size={18} />}
            style={{
              display: 'flex',
              color: green.primary,
              cursor: 'pointer',
              alignItems: 'center',
              borderColor: green.primary,
            }}
          >
            Bạn bè
          </Button>
        </Tooltip>
      );
    default:
      return (
        <Tooltip title="Kết bạn">
          <Button
            loading={reqfLoading}
            icon={<UserPlus size={18} />}
            onClick={friendRequest}
            style={{
              display: 'flex',
              color: blue.primary,
              cursor: 'pointer',
              alignItems: 'center',
              borderColor: blue.primary,
            }}
          >
            Kết bạn
          </Button>
        </Tooltip>
      );
  }
};

const UsersFinded: React.FC<Props> = React.memo(
  ({ item, closeAddModal }: Props) => {
    // User
    const user: any = useAuth();

    const config = useConfig();

    // Message
    const { message } = App.useApp();

    // friend state
    const [friend, setFriend] = React.useState<any>(null);

    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const [opChatLoading, setOpChatLoading] = React.useState<boolean>(false);

    const showModal = () => setIsModalOpen(true);

    const handleCancel = () => setIsModalOpen(false);

    const [reqfLoading, setReqfLoading] = React.useState<boolean>(false);

    // Use Effect
    React.useEffect(() => {
      // Set friend
      setFriend(item);

      // Return clean
      return () => setFriend(null);
    }, []);

    // Handle Add Friend
    const friendRequest = async () => {
      // Enable loading
      setReqfLoading(true);

      // Add friend
      const res: Response = await fetcher({
        method: 'POST',
        url: '/friends/send',
        payload: {
          inviter: {
            user: user.get?._id,
            avatar: user.get?.avatar,
            nickname: user.get?.nickname,
          },
          friend: {
            user: friend?._id,
            avatar: friend?.avatar,
            nickname: friend?.nickname,
          },
        },
      });

      // Time delay
      setTimeout(() => {
        // Check response and handle data
        if (res?.status !== 200) {
          message.error('Gửi yêu cầu kết bạn thất bại');
        } else {
          // Set hasFriend
          setFriend((prev: any) => ({ ...prev, friend: FriendEnum.PENDING }));

          // Message success
          message.success('Đã gửi yêu cầu kết bạn');
        }

        // Disable loading
        setReqfLoading(false);
      }, 1000);
    };

    const openChat = async () => {
      // Enable loading
      setOpChatLoading(true);

      // Response
      const res: Response = await fetcher({
        method: 'POST',
        url: '/chats/join',
        payload: {
          inviter: {
            user: user.get?._id,
            avatar: user.get?.avatar,
            nickname: user.get?.nickname,
          },
          friend: {
            user: friend?._id,
            avatar: friend?.avatar,
            nickname: friend?.nickname,
          },
        },
      });


      setTimeout(() => {
        if (res?.status !== 200) {
          // Message error
          message.error('Mở tin nhắn thất bại');
        } else {
          // Cancel
          handleCancel();

          // Close modal
          closeAddModal();
        }

        // Disable loading
        setOpChatLoading(false);
      }, 1300);
    };

    // Return
    return (
      <React.Fragment>
        <Modal
          footer={null}
          open={isModalOpen}
          onCancel={handleCancel}
          title="Thông tin tài khoản"
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
              alt={friend?.nickname.charAt(0)}
              src={`${baseUrl}/${friend?.avatar}`}
            >
              {friend?.nickname.charAt(0)}
            </Avatar>
            <Flex gap={1} vertical align="center">
              <Text style={{ fontSize: 23 }}>{friend?.nickname}</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {friend?.email}
              </Text>
            </Flex>
            <Flex gap={10}>
              <Button type="primary" onClick={openChat} loading={opChatLoading}>
                Nhắn tin
              </Button>
              {friendStatus(friend?.friend, friendRequest, reqfLoading)}
            </Flex>
          </Flex>
        </Modal>
        {item && (
          <Flex
            flex={1}
            align="center"
            justify="space-between"
            onClick={showModal}
            style={{ padding: '2px 3px', cursor: 'pointer' }}
            className={`${config.get.theme === 'dark' ? 'cvs-d-hover' : 'cvs-l-hover'}`}
          >
            <Flex align="center" gap={15}>
              <Avatar
                shape="square"
                alt={friend?.nickname.charAt(0)}
                size={35}
                src={`${baseUrl}/${friend?.avatar}`}
              >
                {friend?.nickname.charAt(0)}
              </Avatar>
              <Flex gap={1} vertical justify="space-between">
                <Text style={{ fontSize: 13 }}>{friend?.nickname}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {friend?.email}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </React.Fragment>
    );
  },
);

export default UsersFinded;
