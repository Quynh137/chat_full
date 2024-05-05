import  { useState } from 'react';
import { Form, Input, Button, Space, Typography, Select, Checkbox, Flex, App } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '@/client/context/auth/services';

const { Text } = Typography;

export default function Register() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput]= useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'register'>('email');

  const handleFinish = async (values: any) => {
    setLoading(true);
    const { remember, ...data } = values;

    try {
      if (currentStep === 'email') {
        const result = await authServices.sendOtp({ email });
        if (result) {
          setCurrentStep('otp');
          setShowOtpInput(true);
        } else {
          console.error('Send OTP failed');
        }
      } else if (currentStep === 'otp') {
        const isOTPValid = await authServices.verifyOTP({ email, otp });
        // setShowOtpInput(false);
        if (isOTPValid) {
          setCurrentStep('register');
          setShowOtpInput(false);

        } else {
          console.error('Invalid OTP');
        }
      } else if (currentStep === 'register') {
        const result = await authServices.register(data);

        // Check result
        if (result) {
          // Show message
          message.success('Đăng ký thành công, tự động chuyển về đăng nhập');

          // Delay 0.3s
          setTimeout(() => {
            // Check logged in and redirect
            navigate('/auth/login', { replace: true });
          }, 300);
        } else {
          // Show message
          message.error('Đăng ký thất bại, vui lòng thử lại');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

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
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          <Text>Nhập email của bạn vào đây</Text>
        </div>
        <Form
          name="register_form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleFinish}
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
            <Input
              prefix={<MailOutlined />}
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={currentStep !== 'email'}
            />
          </Form.Item>
          {showOtpInput && ( 
            <Form.Item
              name="otp"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã OTP!',
                },
              ]}
            >
              <Input
                placeholder="Mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Item>
          )}
          {currentStep === 'register' && (
            <>
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
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Đồng ý với điều khoản và chính sách</Checkbox>
                </Form.Item>
              </Form.Item>
            </>
          )}
          <Form.Item style={{ marginBottom: '0px' }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              disabled={loading}
            >
              {currentStep === 'otp' ? 'Xác nhận' : 'Tiếp tục'}
            </Button>
            <div
              style={{
                marginTop: '12px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: '#666',
                  marginRight: '5px',
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
