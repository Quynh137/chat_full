import React from 'react';
import { Avatar, Badge, Flex, Skeleton, Typography } from 'antd';
import { useAuth } from '@/client/hooks/use-auth';
import Setting from '../../../client/components/setting';
import { baseUrl } from '@/common/utils/fetcher';

const { Text } = Typography;

const Head: React.FC = () => {
  // User
  const user: any = useAuth();

  // Return
  return (
    <React.Fragment>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={15}>
          {user?.get ? (
            <React.Fragment>
              <Badge
                style={{ padding: 4 }}
                status="success"
                dot
                offset={[-1, 17]}
              >
                <Avatar
                  shape="square"
                  alt={user.get?.nickname.charAt(0)}
                  size={35}
                  src={`${baseUrl}/${user.get?.avatar}`}
                >
                  {user.get?.nickname.charAt(0)}
                </Avatar>
              </Badge>
              <Flex gap={1} vertical justify="space-between">
                <Text style={{ fontSize: 13 }}>{user.get?.nickname}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {user.get?.email}
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
        <Flex>
          <Setting />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default Head;
