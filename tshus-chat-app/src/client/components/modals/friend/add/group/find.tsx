import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import {
  App,
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import { BASE_URL, fetcher } from '@/common/utils/fetcher';
import { User } from '@/common/interface/User';
import { Response } from '@/common/types/response/response.type';
import { useAuth } from '@/client/hooks/use-auth';
import { useConversations } from '@/client/hooks/user-conversations';
import { RoomRoleEnum } from '@/common/enum/room-role.enum';
import { AuthHookType, SpecialHookType } from '@/common/types/other/hook.type';
import { Friends } from '@/common/interface/Friends';
import { Conversations } from '@/common/interface/Conversations';

const { Text } = Typography;

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (user: User, search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    title: string;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);
  const auth: AuthHookType<User> = useAuth();

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(auth.get, value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
      optionRender={(option) => (
        <Space>
          <span role="img" aria-label={option.data.label}>
            <Avatar
              size={28}
              shape="square"
              alt={option.data?.label?.charAt(0)}
              style={{ fontSize: 13 }}
              src={`${BASE_URL}/${option.data?.avatar}`}
            >
              {option.data?.label?.charAt(0)}
            </Avatar>
          </span>
          <Text>{option.data.label}</Text>
        </Space>
      )}
      {...props}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
  title: string;
}

async function fetchUserList(user: User, search: string): Promise<UserValue[]> {
  // Fetch Data
  const res: Response = await fetcher({
    method: 'GET',
    url: '/friends/search',
    payload: {
      search,
      inviter: user,
      limit: 5,
    },
  });

  // Return
  return res?.data?.map((user: Friends) => ({
    label: `${user.friend.nickname}`,
    value: user.friend.user,
    title: user.friend.avatar,
  }));
}

type FormFindType = {
  name: string;
  members: UserValue[];
};

type FindAndSelectFriendProps = {
  changeOpen: Dispatch<SetStateAction<boolean>>;
}


const FindAndSelectFriend: React.FC<FindAndSelectFriendProps> = ({changeOpen}) => {
  // Value state
  const [value, setValue] = useState<UserValue[]>([]);

  // User
  const user = useAuth();

  // Message
  const { message } = App.useApp();

  // Conversations
  const cvsContext: SpecialHookType<Conversations> = useConversations();

  const onFinish = async (values: FormFindType) => {
    // Exception
    try {
      // Response
      const res: Response = await fetcher({
        method: 'POST',
        url: '/rooms/create',
        payload: {
          image: '',
          name: values.name,
          conversation: cvsContext?.current.get._id,
          creater: {
            role: RoomRoleEnum.MANAGER,
            member: {
              user: user.get?._id,
              avatar: user.get?.avatar,
              nickname: user.get?.nickname,
            },
          },
          members: values?.members
            ? values.members.map((value: UserValue) => ({
                role: RoomRoleEnum.MEMBER,
                member: {
                  user: value.value,
                  avatar: value.title,
                  nickname: value.label,
                },
              }))
            : [],
        },
      });

      // Check response status
      if (res?.status === 201) {
        // Close modal
        changeOpen(false);
        
        // Show message success
        message.success('Tạo nhóm chat thành công!');
      } else {
        // Show message error
        message.error('Tạo nhóm thất bại, vui lòng thử lại!');
      }
    } catch (error) {
      // Show message error
      message.error('Tạo nhóm thất bại, vui lòng thử lại!');
    }
  };

  return (
    <Flex vertical>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên nhóm chat"
          name="name"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên nhóm chat',
            },
          ]}
        >
          <Input placeholder="Tên nhóm chat" />
        </Form.Item>
        <Form.Item label="Chọn thành viên nhóm" name="members">
          <DebounceSelect
            mode="multiple"
            value={value}
            placeholder="Chọn thành viên nhóm"
            fetchOptions={fetchUserList}
            onChange={(newValue) => {
              setValue(newValue as UserValue[]);
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Flex justify="end">
          <Button type="primary" htmlType="submit">
            Tạo nhóm chat
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default FindAndSelectFriend;
