import React from 'react';
import { Card, Avatar, Input, DatePicker, Button } from 'antd';

const AccountInfo = () => {
  return (
    <Card title="Thông tin tài khoản">
      <Avatar src="link_to_avatar_image" size={64} />
      <p>Tên: Quỳnh</p>
      <Input placeholder="Giới tính" />
      <DatePicker placeholder="Ngày sinh" />
      <Button type="primary">Cập nhật</Button>
    </Card>
  );
};

export default AccountInfo;
