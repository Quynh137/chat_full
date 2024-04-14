import { Button, Flex, Popover, Switch, Typography, theme } from 'antd';
import React from 'react';
import { useConfig } from '@/common/hooks/use-config';
import { Gear } from '@phosphor-icons/react';

// Use Token
const { useToken } = theme;

const Setting: React.FC = () => {
  // Config
  const config = useConfig();

  // Toeken
  const { token } = useToken();

  // Open State
  const [open, setOpen] = React.useState<boolean>(false);

  // Open
  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  // Change Theme
  const changeTheme = (checked: boolean) =>
    config?.set('theme', checked ? 'DARK' : 'LIGHT');

  // Return
  return (
    <Popover
      content={
        <Flex align="center" gap={15}>
          <Typography.Text>Chủ đề</Typography.Text>
          <Switch
            checkedChildren="Tối"
            unCheckedChildren="Sáng"
            defaultChecked={config.get?.theme === 'DARK'}
            onChange={(checked) => changeTheme(checked)}
          />
        </Flex>
      }
      title="Cài đặt nhanh"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button
        type="text"
        icon={<Gear size={20} />}
        style={{ color: token.colorTextSecondary }}
      />
    </Popover>
  );
};

export default Setting;
