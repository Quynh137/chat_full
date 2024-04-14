import React, { useState } from 'react';
import { Button, Typography, Modal, Input, Upload } from 'antd';
import Search from 'antd/es/input/Search';
import {
  UploadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  UsergroupDeleteOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface Props {
  title: string;
  onButtonClick: (buttonIndex: number) => void;
}

const Side: React.FC<Props> = ({ title, onButtonClick }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddGroup = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ marginTop: '5px', display: 'flex', margin: '5px' }}>
        <Title style={{ fontSize: 20, fontWeight: 'small', color: '#888888' }}>Liên hệ</Title>
        <UserAddOutlined style={{ fontSize: '20px', marginLeft: '120px', marginRight: '10px' }} />
        <UsergroupAddOutlined style={{ fontSize: '20px' }} onClick={handleAddGroup} />
      </div>
      <Search variant="filled" placeholder="Tìm kiếm..." style={{ marginTop: 10 }} />
      <Button
        style={{
          marginTop: '25px',
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
          width: 240,
          height: 40,
        }}
      >
        <SolutionOutlined style={{ fontSize: '22px', marginRight: '20px' }} />
        <Title style={{ fontSize: 15, fontWeight: 'small', margin: 0 }}>Danh sách bạn bè</Title>
      </Button>
      <Button
        style={{
          marginTop: '25px',
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
          width: 240,
          height: 40,
        }}
      >
        <UsergroupDeleteOutlined style={{ fontSize: '22px', marginRight: '20px' }} />
        <Title style={{ fontSize: 15, fontWeight: 'small', margin: 0 }}>Danh sách nhóm</Title>
      </Button>
      <Button
        style={{
          marginTop: '25px',
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
          width: 240,
          height: 40,
        }}
      >
        <MailOutlined style={{ fontSize: '22px', marginRight: '20px' }} />
        <Title style={{ fontSize: 15, fontWeight: 'small', margin: 0 }}>Lời mời kết bạn</Title>
      </Button>
      <Modal title="Tạo Nhóm" visible={modalVisible} onCancel={handleCancel} footer={null}>
        {/* Row 1 */}
        <div style={{ marginBottom: '20px', display: 'flex' }}>
          <Input placeholder="Tên nhóm" style={{ marginBottom: '10px' }} />
          <Upload>
            <Button icon={<UploadOutlined />} style={{ marginBottom: '10px' }}>
              Chọn hình ảnh
            </Button>
          </Upload>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Search variant="filled" placeholder="Tìm kiếm bạn bè" />
        </div>

        <div>{/* Render friend list  ở đay nha*/}</div>
      </Modal>
    </div>
  );
};

export default Side;
