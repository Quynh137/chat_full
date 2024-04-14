import React from 'react';
import { Button, Cascader, Flex, Form, Modal, Spin, Typography } from 'antd';
import { UserPlus } from '@phosphor-icons/react';
import Search from 'antd/es/input/Search';
import { fetcher } from '@/common/utils/fetcher';
import UserFinded from '@/client/components/modals/friend/add/private/find';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '@/client/hooks/use-auth';
import { verifyEmail, verifyPhone } from '@/common/utils/form-rules';
import { User } from '@/common/interface/User';
import { Response } from '@/common/types/res/response.type';
import HrzEmpty from '@/client/components/skeleton/empty.skeleton.horizontal';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

// Search Options
const options: Option[] = [
  {
    value: 'EMAIL',
    label: 'Email',
  },
  {
    value: 'PHONE',
    label: 'Phone',
  },
];

const AddFriendsModal: React.FC = () => {
  // Search Input State
  const [searchInput, setSearchInput] = React.useState('');

  // List user state
  const [userFind, setUserFind] = React.useState<User | null>(null);

  // Open State
  const [open, setOpen] = React.useState(false);

  // User
  const user: any = useAuth();

  // Search loading state
  const [searchLoading, setSearchLoading] = React.useState(false);

  // Search type state
  const [searchType, setSearchType] = React.useState<string>('EMAIL');

  const handleSetSearchType = (value: any[]) => {
    setSearchType(value[0]);
  };

  // Handle set search input
  const handleSearchInput = (value: string) => setSearchInput(value);

  const showModal = () => setOpen(true);

  const handleOk = () => setOpen(false);

  const handleCancel = () => {
    // Clear search input
    setSearchInput('');

    // Clear user list
    setUserFind(null);

    // Set open
    setOpen(false);

    // Set search type
    setSearchType('EMAIL');
  };

  // Search
  const onSearch = async (value: string) => {
    // Check find value
    if (value !== '') {
      // Enable loading
      setSearchLoading(true);

      // Search
      const res: Response = await fetcher({
        method: 'GET',
        url: '/users/find',
        payload: {
          search: value,
          user: user.get?._id,
          type: searchType,
        },
      });

      // Set timeout
      setTimeout(() => {
        // Disable loading
        setSearchLoading(false);

        // Set User
        setUserFind(res?.status === 200 ? res.data : null);
      }, 2000);
    }
  };

  // Return
  return (
    <>
      <Button type="text" icon={<UserPlus size={20} />} onClick={showModal} />
      <Modal
        title="Thêm bạn bè"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
        ]}
      >
        <div style={{ paddingTop: 10 }}>
          <Form name="search_user" layout="vertical" requiredMark="optional">
            <Form.Item
              hasFeedback
              style={{ marginBottom: '30px' }}
              rules={[
                {
                  validator: searchType === 'PHONE' ? verifyPhone : verifyEmail,
                },
              ]}
            >
              <Search
                value={searchInput}
                loading={searchLoading}
                onChange={(e) => handleSearchInput(e.target.value)}
                addonBefore={
                  <Cascader
                    options={options}
                    allowClear={false}
                    placeholder="Chọn..."
                    value={[searchType]}
                    style={{ width: 90 }}
                    onChange={handleSetSearchType}
                  />
                }
                onSearch={onSearch}
                placeholder="Nhập số điện thoại hoặc email"
              />
            </Form.Item>
          </Form>
          <Flex vertical style={{ marginTop: 20 }}>
            <Typography.Text>Kết quả tìm kiếm</Typography.Text>
            <Flex
              justify="center"
              align="center"
              style={{ marginTop: 15, marginBottom: 15 }}
            >
              {!searchLoading ? (
                userFind ? (
                  <Flex align="center" flex={1}>
                    <UserFinded item={userFind} closeAddModal={handleCancel} />
                  </Flex>
                ) : (
                  <HrzEmpty />
                )
              ) : (
                <Flex style={{ marginTop: 20 }}>
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
        </div>
      </Modal>
    </>
  );
};

export default AddFriendsModal;
