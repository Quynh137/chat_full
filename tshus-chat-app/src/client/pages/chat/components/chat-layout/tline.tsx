import { MessageType } from '@/common/enum/message-type';
import { useAuth } from '@/client/hooks/use-auth';
import { Download } from '@phosphor-icons/react';
import {
  DeleteOutlined,
  UndoOutlined,
  ForwardOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import {
  App,
  Avatar,
  Badge,
  Button,
  Col,
  Flex,
  Image,
  Input,
  Modal,
  Popover,
  Row,
  Space,
  Typography,
  Upload,
  theme,
  
} from 'antd';
import React, { Fragment } from 'react';
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { BASE_URL, fetcher } from '@/common/utils/fetcher';
import { ThemeEnum } from '@/common/enum/theme.enum';
import { useConfig } from '@/common/hooks/use-config';
import { css } from '@emotion/css';
import { formatDate } from '@/common/utils/date';
import { useState } from 'react';
import { Response } from '@/common/types/response/response.type';
import { MesssageState } from '@/common/enum/message-state';


type Props = { data: any };

type FileMessage = {
  files: any;
  token: any;
  isSender: boolean;
};

type TextMessage = {
  msg: string;
  token: any;
  isSender: boolean;
};

const { Text } = Typography;

const { useToken } = theme;

const download = (file: any) => {
  fetch(`${BASE_URL}/files/${file.filename}`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalname;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
    });
};

const UnsendMessage: React.FC<any> = ({ isSender, token, msg }: TextMessage) => {
  // Config
  const config: any = useConfig();

  // ligght theme
  const isLight: boolean = config?.theme === ThemeEnum.LIGHT;

  // Return
  return (
    <Space
      className={css`
        height: 32px;
        border-radius: 5px;
        padding: 8px 13px;
        position: relative;
        border: 0.1px solid ${token.colorBorder};
      `}
    >
      {isSender ? (
        <Text
          className={css`
            color: ${token.colorText};
          `}
        >
          {msg}
        </Text>
      ) : (
        <Text
          className={css`
            color: ${isLight ? '#000' : 'rgb(97, 97, 97)'};
          `}
        >
          {msg}
        </Text>
      )}
    </Space>
  );
};

// Check message state and render
const renderMessage = (props: any) => {
  // Check sw
  switch (props.data.state) {
    case MesssageState.RECEIVER:
      return !props.isSender ? <MessageNode {...props} /> : <UnsendMessage isSender={props.isSender} token={props.token} msg="Tin nhắn đã bị xoá" />;
    case MesssageState.NONE:
      return <UnsendMessage isSender={props.isSender} token={props.token} msg="Tin nhắn đã bị thu hồi" />;
    default:
      return <MessageNode {...props} />
  }
}

// Message Node
const MessageNode = ({ data, justify, token, isSender }: any) => {
  // Return
  return (
    <Flex justify={justify}>
      {data?.type === MessageType.TEXT ? (
        <MessageText
          token={token}
          isSender={isSender}
          msg={data?.messages}
        />
      ) : (
        <MessageFileLine
          token={token}
          isSender={isSender}
          files={data?.files}
        />
      )}
    </Flex>
  );
}

const MessageFileLine: React.FC<FileMessage> = ({
  token,
  files,
  isSender,
}: FileMessage) => {
  // Justiry
  const justify: string | any = isSender ? 'end' : 'start';

  // Color text
  const color: string = isSender ? 'white' : 'rgb(97, 97, 97)';

  // Return
  return (
    <Flex vertical>
      <Flex gap={7} vertical>
        <Row gutter={[10, 10]} justify={justify}>
          {files?.map((file: any, index: number) =>
            !file.mimetype.startsWith('image') ? (
              <Col
                span={24}
                key={index}
                style={{ display: 'flex', justifyContent: justify }}
              >
                <Button
                  onClick={() => download(file)}
                  type={isSender ? 'primary' : 'default'}
                  style={{
                    height: 'unset',
                    padding: '6px 13px',
                  }}
                >
                  <Flex gap={10} align="center">
                    <Flex
                      style={{
                        padding: 6,
                        background: 'white',
                        borderRadius: '50%',
                        border: isSender
                          ? 'none'
                          : `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Download
                        weight="regular"
                        size={19}
                        color={token.colorPrimary}
                      />
                    </Flex>
                    <Flex justify="center" vertical align="start">
                      <Text style={{ color, fontSize: 14 }}>
                        {file.originalname}
                      </Text>
                      <Text style={{ color, fontSize: 9 }}>{file.size}</Text>
                    </Flex>
                  </Flex>
                </Button>
              </Col>
            ) : (
              <Col key={index} span={files.length < 3 ? 24 / files?.length : 8}>
                <Space
                  className={css`
                    padding: 6px;
                    border-radius: 5px;
                    border: 1px solid ${token.colorBorder};
                  `}
                >
                  <Image
                    height="100%"
                    src={`${BASE_URL}/files/${file.filename}`}
                    fallback="data:image/png;base64,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"
                    preview={{
                      toolbarRender: (
                        _,
                        {
                          transform: { scale },
                          actions: {
                            onFlipX,
                            onFlipY,
                            onZoomIn,
                            onZoomOut,
                            onRotateLeft,
                            onRotateRight,
                          },
                        },
                      ) => (
                        <Space size={12} className="toolbar-wrapper">
                          <DownloadOutlined onClick={() => download(file)} />
                          <SwapOutlined rotate={90} onClick={onFlipY} />
                          <SwapOutlined onClick={onFlipX} />
                          <RotateLeftOutlined onClick={onRotateLeft} />
                          <RotateRightOutlined onClick={onRotateRight} />
                          <ZoomOutOutlined
                            disabled={scale === 1}
                            onClick={onZoomOut}
                          />
                          <ZoomInOutlined
                            disabled={scale === 50}
                            onClick={onZoomIn}
                          />
                        </Space>
                      ),
                    }}
                  />
                </Space>
              </Col>
            ),
          )}
        </Row>
      </Flex>
    </Flex>
  );
};

const MessageText: React.FC<any> = ({ isSender, token, msg }: TextMessage) => {
  // Config
  const config: any = useConfig();

  // ligght theme
  const isLight: boolean = config?.theme === ThemeEnum.LIGHT;

  const colors: string = isSender
    ? token.colorPrimary
    : isLight
      ? '#999'
      : '#fff';

  // Return
  return (
    <Space
      className={css`
        height: 32px;
        border-radius: 5px;
        padding: 8px 13px;
        position: relative;
        border: 0.1px solid ${token.colorBorder};
        background-color: ${colors};
      `}
    >
      {isSender ? (
        <Text
          className={css`
            color: ${token.colorWhite};
          `}
        >
          {msg}
        </Text>
      ) : (
        <Text
          className={css`
            color: ${isLight ? '#000' : 'rgb(97, 97, 97)'};
          `}
        >
          {msg}
        </Text>
      )}
    </Space>
  );
};

const ChatLine: React.FC<Props> = ({ data }: Props) => {
  // Toeken
  const { token } = useToken();

  // User
  const user: any = useAuth();

  const isSender = user.get?._id === data?.sender?.user;

  const justify = isSender ? 'end' : 'start';

  const { message } = App.useApp();

  const avatar = (
    <Badge
      dot
      style={{
        padding: 3.5,
        background: token.colorSuccess,
      }}
      status="processing"
      offset={[-1, '100%']}
    >
      <Avatar
        size={28}
        shape="square"
        alt={data?.sender?.nickname?.charAt(0)}
        style={{ fontSize: 13 }}
        src={`${BASE_URL}/${data?.sender?.avatar}`}
      >
        {data?.sender?.nickname?.charAt(0)}
      </Avatar>
    </Badge>
  );

  // Handle deleteMessage
  const handleDelteMessage = async () => {
    // Exception
    try {
      const res: Response = await fetcher({
        method: 'DELETE',
        url: '/messages/delete',
        payload: {
          _id: data._id
        }
      });

      // Check status
      if (res?.status === 200) {
        // Show success message
        message.success('Xoa tin nhan thanh cong')
      } else {
        // Show error message
        message.error('Xoa tin nhan that bai')
      }
    } catch (error) {
      // Show error
      message.error('Xoa tin nhan that bai')
    }
  }

  // Handle unMessage
  const handleUnmessage = async () => {
    // Exception
    try {
      const res: Response = await fetcher({
        method: 'DELETE',
        url: '/messages/unsend',
        payload: {
          _id: data._id,
        }
      });

      // Check status
      if (res?.status === 200) {
        // Show success message
        message.success('Thu hoi tin nhan thanh cong')
      } else {
        // Show error message
        message.error('Thu hoi tin nhan that bai')
      }
    } catch (error) {
      // Show error
      message.error('Loi khong thu hoi duoc')
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
 const handleCancel = () => {
  setModalVisible(false);
 }
  // Handle unMessage
  const handleForwardMessage = async () => {
    setModalVisible(true)
  };
  // Return
  return (
    <Fragment>
      <Row
        justify={justify}
      >
        <Col span={12}>
          <Flex align="center" style={{ padding: 10 }} justify={justify}>
            <Flex align="flex-start" gap={15}>
              <Space style={{ order: isSender ? 3 : 1 }}>{avatar}</Space>
              <Flex style={{ order: 2 }} vertical gap={4}>
                <Flex justify={justify} align="center" gap={20}>
                  <Text style={{ fontSize: 10, order: 2 }}>
                    {formatDate(data?.send_at)}
                  </Text>
                  <Text style={{ fontSize: 12.5, order: isSender ? 3 : 1 }}>
                    {data?.sender?.nickname}
                  </Text>
                </Flex>
                <Popover content={
                  <Flex
                    style={{
                      marginTop: '2px',
                      marginRight: '20px',
                      background: 'rgba(192, 192, 192, 0.3)',
                      padding: '2px',
                      borderRadius: '10px',
                    }}
                  >
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{
                        marginRight: '2px',
                        border: 'none',
                        background: 'transparent',
                      }}
                      // Handle deleteMessage
                      onClick={handleDelteMessage}
                    />
                    <Button
                      size="small"
                      icon={<UndoOutlined />}
                      style={{
                        marginRight: '2px',
                        border: 'none',
                        background: 'transparent',
                      }}
                      onClick={(handleUnmessage)}
                    />
                    <Button
                      size="small"
                      icon={<ForwardOutlined />}
                      style={{
                        marginRight: '2px',
                        border: 'none',
                        background: 'transparent',
                      }}
                      onClick={(handleForwardMessage)}
                    />
                    
                  </Flex>
                } trigger="click" placement='left'>
                  <Fragment>
                    {renderMessage({ data, justify, token, isSender })}
                  </Fragment>
                </Popover>
              </Flex>
            </Flex>
          </Flex>
        </Col>
      </Row>
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
        </div>

        <div>{/* Render friend list  ở đay nha*/}</div>
      </Modal>

    </Fragment>

  );
};

export default ChatLine;
