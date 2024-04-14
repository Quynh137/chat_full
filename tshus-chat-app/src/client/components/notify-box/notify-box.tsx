import { Button, Space } from 'antd';

type Props = {
  notify: any;
  title: string;
  id?: string;
};

const NotifyBox: React.FC<Props> = ({ notify, title, id }: Props) => {
  // Return
  return (
    <Space>
      <Button type="link" size="small" onClick={() => notify.destroy()}>
        {title}
      </Button>
      <Button type="primary" size="small" onClick={() => notify.destroy(id)}>
        Đóng
      </Button>
    </Space>
  );
};

export default NotifyBox;
