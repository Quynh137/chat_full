import { UsersThree } from '@phosphor-icons/react';
import { Button, Modal, Tooltip } from 'antd';
import { FC, useState } from 'react';
import FindAndSelectMember from './find';

const AddMemberToGroupModal: FC = () => {
  // Open State
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const handleOk = () => setOpen(false);

  const handleCancel = () => {
    // Set open
    setOpen(false);
  };

  // Return
  return (
    <>
      <Tooltip title="Thêm thành viên">
        <Button
          type="text"
          icon={<UsersThree size={20} />}
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        title="Thêm thành viên vào nhóm chat"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <div style={{ paddingTop: 10 }}>
          <FindAndSelectMember changeOpen={setOpen} />
        </div>
      </Modal>
    </>
  );
};

export default AddMemberToGroupModal;
