import { Empty } from 'antd';

const VtcEmpty: React.FC = () => {
  return (
    <Empty
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
};

export default VtcEmpty;
