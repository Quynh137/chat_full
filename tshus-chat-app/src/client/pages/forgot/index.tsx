import React from 'react';
import {
  App,
  Button,
  Form,
  Input,
  Space,
  theme,
  Typography,
} from 'antd';
import { MailOutlined, LockOutlined} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '@/client/context/auth/services';

// Use Token
const { useToken } = theme;

// Text, Title
const { Text } = Typography;

export default function SendResetPass() {
  // Token
  const { token } = useToken();
  // Navigate
  const navigate = useNavigate();
  // Message
  const { message } = App.useApp();
  // Loading state
  const [loading, setLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [otp, setOtp] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [currentStep, setCurrentStep] = React.useState<'email' | 'otp' | 'password'>('email');


  const handleFinish = async () => {
    setLoading(true);
    try {
      if (currentStep === 'email') {
        // Call API to send reset pass request
        const result = await authServices.sendResetPass({ email });
        if (result) {
          message.success('Đăng ký thành công, tự động chuyển về đăng nhập');
          setCurrentStep('otp');
        } else {
          message.error('Nhận mã OTP thất bại, vui lòng thử lại');
        }
      } else if (currentStep === 'otp') {
        // Call API to verify OTP
        const isOTPValid = await authServices.verifyOTP({ email, otp });
        if (isOTPValid) {
          setCurrentStep('password'); // Chuyển sang bước nhập mật khẩu
        } else {
          message.error('Mã OTP không hợp lệ');
        }
      } else if (currentStep === 'password') {
        // Call API to update password
        const result = await authServices.updatePassword({ email, otp, password });
        if (result) {
          message.success('Cập nhật mật khẩu thành công');
          setEmail('');
          setOtp('');
          setPassword('');
          setConfirmPassword('');
          navigate('/auth/login');
        } else {
          message.error('Cập nhật mật khẩu không thành công. Vui lòng thử lại sau.');
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
            marginBottom: token.marginXL,
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              color: token.colorTextSecondary,
              textAlign: 'center',
            }}
          >
            Nhập email của bạn vào đây
          </Text>
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
          {currentStep === 'otp' && (
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
          {currentStep === 'password' && (
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận lại mật khẩu',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve('Vui lòng nhập lại mật khẩu đã nhập!');
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
