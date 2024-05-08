import { MessageType } from '@/common/enum/message-type';
import { useAuth } from '@/client/hooks/use-auth';
import { Download } from '@phosphor-icons/react';
import {
  App,
  Avatar,
  Badge,
  Button,
  Col,
  Flex,
  Image,
  Modal,
  Popover,
  Radio,
  Row,
  Space,
  Typography,
  theme,
} from 'antd';
import React, { useState } from 'react';
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { AWS_URL, BASE_URL, fetcher } from '@/common/utils/fetcher';
import { ThemeEnum } from '@/common/enum/theme.enum';
import { useConfig } from '@/common/hooks/use-config';
import { css } from '@emotion/css';
<<<<<<< HEAD
import { formatDate } from '@/common/utils/date';
=======
import { formatToTime } from '@/common/utils/date';
>>>>>>> 0ea8fedb010380818218161aae4b407f41ecabeb
import EmptyHorizontal from '@/client/components/empty/horizontal.empty';
import { useConversations } from '@/client/hooks/user-conversations';
import { ConversationEnum } from '@/common/enum/conversation.enum';
import { Response } from '@/common/types/response/response.type';
import { Conversations } from '@/common/interface/Conversations';

type Props = { data: any };

type FileMessage = {
  files: any;
  msg?: string;
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

// Download file
const download = (file: any) => {
  fetch(`${AWS_URL}/${file.filename}`)
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

const MessageFileLine: React.FC<FileMessage> = ({
  token,
  files,
  isSender,
  msg,
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
                    src={`${AWS_URL}/${file.filename}`}
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
          {msg?.trim() !== '' && (
            <span style={{ padding: '0 5px' }}>
              <MessageTextLine token={token} isSender={isSender} msg={msg} />
            </span>
          )}
        </Row>
      </Flex>
    </Flex>
  );
};

const MessageTextLine: React.FC<any> = ({
  isSender,
  token,
  msg,
}: TextMessage) => {
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

  const cvsContext = useConversations();

  const [tranfModelOpen, setTranfModelOpen] = useState(false);

  // Set tranf conversation id
  const [tranfCvs, setTransfCvs] = useState<Conversations | null>(null);

  const showModal = () => setTranfModelOpen(true);

  // Use message app
  const { message } = App.useApp();

  // Config
  const config = useConfig();

  const handleOk = async () => {
    // Delete _id
    const { _id, ...transferMessage } = data;

    // Response
    const res: Response = await fetcher({
      method: 'POST',
      url: '/messages/transfer',
      payload: {
        ...transferMessage,
        conversation: tranfCvs?._id,
      },
    });

    // Close modal
    setTranfModelOpen(false);

    // Check status
    if (res?.status === 200) {
      // Update conversation last message
      cvsContext.current.update({
        ...tranfCvs,
        last_message: res.data.last_message,
        last_send: res.data.send_at,
      });

      // Show success message
      message.success('Chuyển đổi thành công');
    } else {
      // Show error message
      message.error('Chuyển đổi thất bại');
    }
  };

  // Cancel
  const handleCancel = async () => setTranfModelOpen(false);

  // Handle transfer conversation
  const handleTranfCvs = (transf: Conversations) => setTransfCvs(transf);

  const justify = isSender ? 'end' : 'start';

  // Avatar
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

  // Return
  return (
    <Row justify={justify}>
      <Col span={12}>
        <Flex align="center" style={{ padding: 10 }} justify={justify}>
          <Flex align="flex-start" gap={15}>
            <Space style={{ order: isSender ? 3 : 1 }}>{avatar}</Space>
            <Flex style={{ order: 2 }} vertical gap={4}>
              <Flex justify={justify} align="center" gap={10}>
                <Text style={{ fontSize: 10, order: 2 }}>
<<<<<<< HEAD
                  {formatDate(data?.send_at)}
=======
                  {formatToTime(data?.send_at)}
>>>>>>> 0ea8fedb010380818218161aae4b407f41ecabeb
                </Text>
                <Text
                  style={{ fontSize: 12.5, order: isSender ? 3 : 1 }}
                  strong
                >
                  {data?.sender?.nickname}
                </Text>
              </Flex>
              <Popover
                placement="left"
                content={
                  <Flex>
                    <Button onClick={showModal}>Chuyển tiếp</Button>
                  </Flex>
                }
                trigger="contextMenu"
              >
                <Flex justify={justify}>
                  {data?.type === MessageType.TEXT ? (
                    <MessageTextLine
                      token={token}
                      isSender={isSender}
                      msg={data?.messages}
                    />
                  ) : (
                    <MessageFileLine
                      token={token}
                      isSender={isSender}
                      files={data?.files}
                      msg={data?.messages}
                    />
                  )}
                </Flex>
              </Popover>
            </Flex>
          </Flex>
        </Flex>
      </Col>
      <Modal
        onOk={handleOk}
        open={tranfModelOpen}
        title="Chuyển tiếp tin nhắn"
        onCancel={handleCancel}
      >
        <Radio.Group style={{ width: '100%' }} value={tranfCvs?._id}>
          {cvsContext?.list.get?.length > 0 ? (
            cvsContext?.list.get?.map((item: Conversations) => {
              // Check not current cvs
              if (item?._id !== data?.conversation) {
                // Is Rooms
                const isRooms = item?.type === ConversationEnum.ROOMS;

                const chats = item?.chats?.[0];

                const isInviter = user.get?._id === chats?.inviter?.user;

                const cvsName = isRooms
                  ? item?.rooms[0]?.name
                  : isInviter
                  ? chats?.friend?.nickname
                  : chats?.inviter?.nickname;

                // Return
                return (
                  <Flex
                    key={item._id}
                    justify="space-between"
                    style={{ borderRadius: 5 }}
                    className={`${
                      config.get.theme === ThemeEnum.DARK
                        ? 'cvs-d-hover'
                        : 'cvs-l-hover'
                    } ${
                      item._id === tranfCvs?._id &&
                      ` ${
                        config.get.theme === ThemeEnum.DARK
                          ? 'cvs-d-active'
                          : 'cvs-l-active'
                      }`
                    }`}
                  >
                    <Flex
                      gap={15}
                      align="center"
                      style={{ padding: 10, cursor: 'pointer', width: '100%' }}
                      onClick={() => handleTranfCvs(item)}
                    >
                      <Badge
                        dot
                        style={{
                          padding: 3.5,
                          background: token.colorSuccess,
                        }}
                        status="processing"
                        offset={[-1, '100%']}
                      >
                        <Avatar shape="square" size={35}>
                          {cvsName?.charAt(0)}
                        </Avatar>
                      </Badge>
                      <Flex gap={1} vertical justify="space-between">
                        <Text style={{ fontSize: 13 }}>{cvsName}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {item?.last_message || 'Không có tin nhắn nào'}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex>
                      <Radio value={item?._id} />
                    </Flex>
                  </Flex>
                );
              }
            })
          ) : (
            <EmptyHorizontal desc="Không có dữ liệu" />
          )}
        </Radio.Group>
      </Modal>
    </Row>
  );
};

export default ChatLine;
