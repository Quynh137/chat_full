import { ChaterType } from '@/common/types/user/chater.type';
import { BASE_URL } from '@/common/utils/fetcher';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Tag,
  theme,
  Typography,
} from 'antd';
import { Fragment } from 'react';
import Search from 'antd/es/input/Search';
import { FriendStateEnum } from '@/common/enum/friend-state.enum';
import { formatToDateTime } from '@/common/utils/date';

// Friend Request Type
type FriendRequestType = {
  inviter: ChaterType;
  state: FriendStateEnum;
  createdAt: Date;
};

// Friend Request Type
type FriendSenderType = {
  friend: ChaterType;
  state: FriendStateEnum;
  createdAt: Date;
};

// Friend list
const friendsList: ChaterType[] = [
  {
    nickname: 'Đào Việt Bảo',
    user: '65f80266838a525b58e2dc28',
    avatar: '',
  },
  {
    nickname: 'Đào Việt Bảo',
    user: '65f80266838a525b58e2dc28',
    avatar: '',
  },
];

// Friend list
const friendRequest: FriendRequestType[] = [
  {
    inviter: {
      nickname: 'Đào Việt Bảo',
      user: '65f80266838a525b58e2dc28',
      avatar: '',
    },
    state: FriendStateEnum.PENDING,
    createdAt: new Date(),
  },
  {
    inviter: {
      nickname: 'Đào Việt Bảo',
      user: '65f80266838a525b58e2dc28',
      avatar: '',
    },
    state: FriendStateEnum.PENDING,
    createdAt: new Date(),
  },
];

// Friend list
const friendSender: FriendSenderType[] = [
  {
    friend: {
      nickname: 'Đào Việt Bảo',
      user: '65f80266838a525b58e2dc28',
      avatar: '',
    },
    state: FriendStateEnum.PENDING,
    createdAt: new Date(),
  },
  {
    friend: {
      nickname: 'Đào Việt Bảo',
      user: '65f80266838a525b58e2dc28',
      avatar: '',
    },
    state: FriendStateEnum.PENDING,
    createdAt: new Date(),
  },
];

// Use Token
const { useToken } = theme;

// Text
const { Text } = Typography;

type Props = {};

export default function Phonebook({}: Props) {
  // Token
  const { token } = useToken();

  // Return
  return (
    <Fragment>
      <Row style={{ height: '100%' }}>
        <Col
          xl={5}
          lg={6}
          md={8}
          sm={24}
          xs={24}
          style={{ borderRight: `1px solid ${token.colorBorder}` }}
        >
          <Flex style={{ padding: 20 }} vertical>
            <Flex vertical>
              <Flex justify="space-between" align="center">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'medium',
                    color: token.colorTextSecondary,
                  }}
                >
                  Danh sách bạn bè
                </Text>
              </Flex>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 'medium',
                  color: token.colorTextPlaceholder,
                }}
              >
                Danh sách tất cả các bạn bè.
              </Text>
            </Flex>
            <Flex flex={1}>
              <Search
                variant="filled"
                placeholder="Tìm kiếm bạn bè..."
                style={{ marginTop: 20 }}
              />
            </Flex>
            <Flex vertical gap={10}>
              {friendsList?.map(({ user, nickname, avatar }: ChaterType) => (
                <Flex vertical>
                  <Divider orientation="left" plain orientationMargin="0">
                    <Text
                      style={{
                        color: token.colorPrimary,
                      }}
                    >
                      {nickname?.charAt(0)}
                    </Text>
                  </Divider>
                  <Button style={{ height: 'unset', padding: '8px 10px' }}>
                    <Flex align="center" gap={10}>
                      <Avatar
                        shape="square"
                        size={27}
                        src={`${BASE_URL}/${avatar}`}
                      >
                        {nickname?.charAt(0)}
                      </Avatar>
                      <Text style={{ fontSize: 14, fontWeight: '400' }}>
                        {nickname}
                      </Text>
                    </Flex>
                  </Button>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Col>
        <Col xl={19} lg={18} md={16} sm={0} xs={0} className="h-100">
          <Flex style={{ padding: 20 }} vertical>
            <Flex vertical>
              <Flex justify="space-between" align="center">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'medium',
                    color: token.colorTextSecondary,
                  }}
                >
                  Lời mời kết bạn
                </Text>
              </Flex>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 'medium',
                  color: token.colorTextPlaceholder,
                }}
              >
                Danh sách tất cả các lời mời kết bạn.
              </Text>
            </Flex>
            <Flex flex={1}>
              <Search
                variant="filled"
                placeholder="Tìm kiếm lời mời kết bạn..."
                style={{ marginTop: 20 }}
              />
            </Flex>
            <Flex vertical gap={20} style={{ padding: '15px 5px' }}>
              <Flex>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    color: token.colorTextSecondary,
                  }}
                >
                  Lời mời kết bạn đã nhận{'  '}
                  <Tag color={token.colorPrimary}>{friendRequest.length}</Tag>
                </Text>
              </Flex>
              <Row gutter={[20, 20]}>
                {friendRequest?.map(
                  ({ inviter, state, createdAt }: FriendRequestType) => (
                    <Col span={6}>
                      <Flex
                        vertical
                        gap={20}
                        style={{
                          border: `1px solid ${token.colorBorder}`,
                          borderRadius: 5,
                          padding: 15,
                        }}
                      >
                        <Flex gap={10} align="center">
                          <Avatar
                            shape="square"
                            size={37}
                            src={`${BASE_URL}/${inviter?.avatar}`}
                          >
                            {inviter?.nickname?.charAt(0)}
                          </Avatar>
                          <Flex vertical gap={1}>
                            <Text style={{ fontSize: 14, fontWeight: '400' }}>
                              {inviter?.nickname}
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '400',
                                color: token.colorTextDescription,
                              }}
                            >
                              {formatToDateTime(createdAt.toString())}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap={15} justify="space-between">
                          <Button style={{ width: '100%' }} type="primary">
                            Đồng ý
                          </Button>
                          <Button style={{ width: '100%' }} danger>
                            Từ chối
                          </Button>
                        </Flex>
                      </Flex>
                    </Col>
                  ),
                )}
              </Row>
            </Flex>
            <Flex vertical gap={20} style={{ padding: '15px 5px' }}>
              <Flex>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'medium',
                    color: token.colorTextSecondary,
                  }}
                >
                  Lời mời kết bạn đã gửi{'  '}
                  <Tag color={token.colorPrimary}>{friendSender.length}</Tag>
                </Text>
              </Flex>
              <Row gutter={[20, 20]}>
                {friendSender?.map(
                  ({ friend, state, createdAt }: FriendSenderType) => (
                    <Col span={6}>
                      <Flex
                        vertical
                        gap={20}
                        style={{
                          border: `1px solid ${token.colorBorder}`,
                          borderRadius: 5,
                          padding: 15,
                        }}
                      >
                        <Flex gap={10} align="center">
                          <Avatar
                            shape="square"
                            size={37}
                            src={`${BASE_URL}/${friend?.avatar}`}
                          >
                            {friend?.nickname?.charAt(0)}
                          </Avatar>
                          <Flex vertical gap={1}>
                            <Text style={{ fontSize: 14, fontWeight: '400' }}>
                              {friend?.nickname}
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '400',
                                color: token.colorTextDescription,
                              }}
                            >
                              {formatToDateTime(createdAt.toString())}
                            </Text>
                          </Flex>
                        </Flex>
                        <Button>Thu hồi lời mời</Button>
                      </Flex>
                    </Col>
                  ),
                )}
              </Row>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Fragment>
  );
}
