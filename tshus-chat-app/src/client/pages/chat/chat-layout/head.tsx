import { ConversationEnum } from '@/common/enum/conversation.enum';
import { Avatar, Badge, Flex, Skeleton, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

type Props = {
  token: any;
  cvs: any;
  currCvsLoading: boolean;
};

const ChatHead: React.FC<Props> = ({ token, cvs, currCvsLoading }: Props) => {
  // Conversation Name
  const cvsName =
    cvs?.type === ConversationEnum.ROOMS
      ? cvs?.rooms[0]?.name
      : cvs?.chats[0]?.friend?.nickname;
  // Return
  return (
    <Flex
      style={{
        padding: '17px',
        background: token.colorBgBase,
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={15}>
          {!currCvsLoading ? (
            <React.Fragment>
              <Badge
                dot
                style={{
                  padding: 3.5,
                  background: token.colorSuccess,
                }}
                status="processing"
                offset={[-1, '100%']}
              >
                <Avatar shape="square" alt={'1'} size={35}>
                  {cvsName.charAt(0)}
                </Avatar>
              </Badge>
              <Flex gap={1} vertical justify="space-between">
                <Text style={{ fontSize: 13 }}>{cvsName}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Đang hoạt động
                </Text>
              </Flex>
            </React.Fragment>
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
      </Flex>
    </Flex>
  );
};

export default ChatHead;
