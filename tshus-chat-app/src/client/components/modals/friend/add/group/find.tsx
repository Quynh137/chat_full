import React, { useMemo, useRef, useState } from 'react';
import {
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
import { baseUrl, fetcher } from '@/common/utils/fetcher';
import { User } from '@/common/interface/User';
import { Response } from '@/common/types/res/response.type';
import { useAuth } from '@/client/hooks/use-auth';

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
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);
  const auth: any = useAuth();

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
              src={`${baseUrl}/${option.data?.avatar}`}
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
  return res?.data?.map((user: any) => ({
    label: `${user.friend.nickname}`,
    value: user.friend.user,
    avatar: user.friend.avatar,
  }));
}

const FindAndSelectFriend: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Flex vertical>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên nhóm chat"
          name="group_name"
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
        <Flex justify='end'>
             <Button type="primary" htmlType="submit">
               Tạo nhóm chat
             </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default FindAndSelectFriend;
