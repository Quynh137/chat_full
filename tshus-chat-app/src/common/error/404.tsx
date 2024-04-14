import React from 'react';
import { Button, Result } from 'antd';

const Page404: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Trang mà bạn truy cập không tồn tại."
    extra={<Button type="primary">Về trang chủ</Button>}
  />
);

export default Page404;
