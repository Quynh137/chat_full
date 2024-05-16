import { ChaterType } from '@/common/types/user/chater.type';
import { BASE_URL, fetcher } from '@/common/utils/fetcher';
import {
  App,
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
import { Fragment, useEffect, useState } from 'react';
import Search from 'antd/es/input/Search';
import { formatToDateTime } from '@/common/utils/date';
import { Response } from '@/common/types/response/response.type';
import { useAuth } from '@/client/hooks/use-auth';
import EmptyHorizontal from '@/client/components/empty/horizontal.empty';
import InfiniteScroll from 'react-infinite-scroll-component';

// Use Token
const { useToken } = theme;

// Text
const { Text } = Typography;

type Props = {};

export default function Phonebook({ }: Props) {
  // Auth
  const auth = useAuth();

  const { message } = App.useApp();

  // List friends state
  const [friendsList, setFriendsList] = useState<any[]>([]);

  const [friendSender, setFriendSender] = useState<any[]>([]);

  const [friendRequest, setFriendRequest] = useState<any[]>([]);

  // Effect
  useEffect(() => {
    // Load friends
    (async () => {
      // Response
      const res: Response = await fetcher({
        method: 'GET',
        url: '/friends/page',
        payload: { user: auth?.get?._id },
      });

      if (res?.status === 200) {
        // Set data
        setFriendsList(res?.data);
      }
      // Return
    })();

    // Load request
    (async () => {
      // Response
      const res: Response = await fetcher({
        method: 'GET',
        url: '/friends/load_request',
        payload: { user: auth?.get?._id },
      });

      // Check status
      if (res?.status === 200) {
        // Set request
        setFriendRequest(res?.data?.request);

        // Set sended
        setFriendSender(res?.data?.sended);
      }
      // Return
    })();
  }, [auth?.get?._id]);

  // Token
  const { token } = useToken();

  // Accept request
  const acceptRequest = async (id: string) => {
    // Response
    const res: Response = await fetcher({
      method: 'POST',
      url: '/friends/accept',
      payload: { id },
    });

    // Check status
    if (res?.status === 200) {
      // Index
      const index = friendRequest.findIndex((i) => i?._id === id);

      // Temp friends sender
      const temp = friendRequest;

      // Remove
      if (index !== -1) {
        // Remove
        temp.splice(index, 1);

        // Set new
        index === 0 ? setFriendRequest([]) : setFriendRequest(temp);
      }

      // Success message
      message.success('Đồng ý lời mời kết bạn thành công');
    } else {
      // error message
      message.error('Đồng ý lời mời kết bạn thất bại');
    }
  };

  // Cancel request
  const cancelRequest = async (id: string) => {
    // Response
    const res: Response = await fetcher({
      method: 'DELETE',
      url: '/friends/cancel',
      payload: { id },
    });

    // Check status
    if (res?.status === 200) {
      // Index
      const index = friendRequest.findIndex((i) => i?._id === id);

      // Temp friends sender
      const temp = friendRequest;

      // Remove
      if (index !== -1) {
        // Remove
        temp.splice(index, 1);

        // Set new
        index === 0 ? setFriendRequest([]) : setFriendRequest(temp);
      }

      // Success message
      message.success('Từ chối lời mời kết bạn thành công');
    } else {
      // error message
      message.error('Từ chối lời mời kết bạn thất bại');
    }
  };

  // Cancel request
  const cancelSended = async (id: string) => {
    // Response
    const res: Response = await fetcher({
      method: 'DELETE',
      url: '/friends/cancel',
      payload: { id },
    });

    // Check status
    if (res?.status === 200) {
      // Index
      const index = friendSender.findIndex((i) => i?._id === id);

      // Temp friends sender
      const temp = friendSender;

      // Remove
      if (index !== -1) {
        // Remove
        temp.splice(index, 1);

        // Set new
        index === 0 ? setFriendSender([]) : setFriendSender(temp);
      }

      // Success message
      message.success('Thu hồi lời mời kết bạn thành công');
    } else {
      // error message
      message.error('Thu hồi lời mời kết bạn thất bại');
    }
  };

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
              {Object.keys(friendsList).map((key, index) => (
                <Flex vertical key={index}>
                  <Divider orientation="left" plain orientationMargin="0">
                    <Text style={{ color: token.colorPrimary }}>{key}</Text>
                  </Divider>
                  {friendsList[key as keyof typeof friendsList]?.map(({ nickname, avatar, user }:ChaterType) => (
                    <Button style={{ height: 'unset', padding: '8px 10px' }} key={user}>
                      <Flex align="center" gap={10}>
                        <Avatar shape="square" size={27} src={`${BASE_URL}/${avatar}`}>
                          {nickname.charAt(0)}
                        </Avatar>
                        <Text style={{ fontSize: 14, fontWeight: '400' }}>{nickname}</Text>
                      </Flex>
                    </Button>
                  ))}
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
                {friendRequest?.length > 0 ? (
                  friendRequest?.map(({ inviter, _id, createdAt }: any) => (
                    <Col span={6} key={inviter?.user}>
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
                              {formatToDateTime(createdAt?.toString())}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap={15} justify="space-between">
                          <Button
                            style={{ width: '100%' }}
                            type="primary"
                            onClick={() => acceptRequest(_id)}
                          >
                            Đồng ý
                          </Button>
                          <Button
                            style={{ width: '100%' }}
                            danger
                            onClick={() => cancelRequest(_id)}
                          >
                            Từ chối
                          </Button>
                        </Flex>
                      </Flex>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <EmptyHorizontal desc="Không có lời mời kết bạn nào!" />
                  </Col>
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
                {friendSender?.length > 0 ? (
                  friendSender?.map(({ friend, _id, createdAt }) => (
                    <Col span={6} key={friend?.user}>
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
                              {formatToDateTime(createdAt?.toString())}
                            </Text>
                          </Flex>
                        </Flex>
                        <Button onClick={() => cancelSended(_id)}>
                          Thu hồi lời mời
                        </Button>
                      </Flex>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <EmptyHorizontal desc="Chưa gửi lời mời kết bạn nào!" />
                  </Col>
                )}
              </Row>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Fragment>
  );
}
