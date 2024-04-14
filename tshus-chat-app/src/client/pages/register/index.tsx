import React from 'react';
import {
  App,
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Select,
  Space,
  theme,
  Typography,
} from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '@/client/context/auth/services';

// Use Token
const { useToken } = theme;

// Text, Title
const { Text, Title } = Typography;

export default function Register() {
  // Toeken
  const { token } = useToken();

  // Navigate
  const navigate = useNavigate();

  // Message
  const { message } = App.useApp();

  // Loading state
  const [loading, setLoading] = React.useState<boolean>(false);

  const onFinish = async (values: any) => {
    // Destructuring
    const { remember, ...data } = values;

    // Enable Loading
    setLoading(true);

    // Result
    const result = await authServices.register(data);

    // Disable Loading
    setLoading(false);

    // Check result
    if (result) {
      // Show message
      message.success('Đăng ký thành công, tự động chuyển về đăng nhập');

      // Delay 0.3s
      setTimeout(() => {
        // Check loged and redirect
        navigate('/auth/login', { replace: true });
      }, 300);
    } else {
      // Show message
      message.error('Đăng ký thất bại, vui lòng thử lại');
    }
  };

  // Return
  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <div style={{ width: '400px' }}>
        <div
          style={{
            marginBottom: token.marginXL,
            textAlign: 'center',
          }}
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={{ textAlign: 'center' }}>Đăng ký</Title>
          <Text
            style={{
              color: token.colorTextSecondary,
              textAlign: 'center',
            }}
          >
            Chào mừng đến với với Tshus chat app, đăng ký tài khoản để trò
            chuyện với bạn bè ngay
          </Text>
        </div>
        <Form
          name="register_form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            hasFeedback
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Vui lòng nhập đúng định dạng Email!',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>
          <Flex gap={10} justify="space-between">
            <Form.Item
              name="firstname"
              hasFeedback
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ của bạn!',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Họ đệm" />
            </Form.Item>
            <Form.Item
              name="lastname"
              hasFeedback
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên của bạn!',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Tên" />
            </Form.Item>
          </Flex>
          <Flex gap={10} justify="space-between">
            <Form.Item
              name="gender"
              hasFeedback
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn giới tính',
                },
              ]}
            >
              <Select
                placeholder="Chọn giới tính"
                options={[
                  { value: 'MALE', label: 'Nam' },
                  { value: 'FEMALE', label: 'Nữ' },
                  { value: 'OTHER', label: 'Khác' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              hasFeedback
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại',
                },
              ]}
            >
              <Input addonBefore="+84" placeholder="Số điện thoại" />
            </Form.Item>
          </Flex>
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    // Return Resolve
                    return Promise.resolve(
                      'Vui lòng nhập lại mật khẩu đã nhập!',
                    );
                  }
                  // Return reject
                  return Promise.reject(
                    // Throws Error
                    new Error('Mật khẩu xác nhận không trùng khớp!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Đồng ý với điều khoản và chính sách</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              disabled={loading}
            >
              Đăng ký
            </Button>
            <div
              style={{
                marginTop: token.marginLG,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: token.colorTextSecondary,
                  marginRight: 5,
                }}
              >
                Bạn đã có tài khoản?
              </Text>
              <Link to="/auth/login">Đăng nhập ngay</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Space>
  );
}
