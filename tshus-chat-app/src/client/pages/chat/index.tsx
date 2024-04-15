import {
  Button,
  Col,
  Flex,
  Row,
  theme,
  UploadFile,
  Tooltip,
  GetProp,
  UploadProps,
  Skeleton,
  Badge,
  Avatar,
  Typography,
  Drawer,
  Divider,
  Collapse,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  Calendar,
  DotsThree,
  ImageSquare,
  Link,
  Microphone,
  PaperPlaneRight,
  User,
  WechatLogo,
} from '@phosphor-icons/react';
import EmojiPick from '@/client/components/emoji';
import ConversationsProvider from '@/client/context/conversations-context';
import { useConversations } from '@/client/hooks/user-conversations';
import { useSocket } from '@/common/hooks/use-socket';
import { useAuth } from '@/client/hooks/use-auth';
import ChatSide from './components/chat-layout/side';
import ChatUploadFile from './components/chat-upload/upload-file';
import ChatUploadImage from './components/chat-upload/upload-image';
import { MessageType } from '@/common/enum/message-type';
import { Response } from '@/common/types/response/response.type';
import { BASE_URL, fetcher } from '@/common/utils/fetcher';
import { Socket } from 'socket.io-client';
import ChatContent from './components/chat-layout/content';
import EmptyVertical from '@/client/components/empty/vertical.empty';
import { Messages } from '@/common/interface/Messages';
import {
  FC,
  FormEvent,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ConversationEnum } from '@/common/enum/conversation.enum';
import { Conversations } from '@/common/interface/Conversations';
import { formatToDateTime } from '@/common/utils/date';
import { ThemeEnum } from '@/common/enum/theme.enum';
import { useConfig } from '@/common/hooks/use-config';
import AddMemberToGroupModal from '@/client/components/modals/member/add';
import DeleteMemberFromGroupModal from '@/client/components/modals/member/delete';
import { Roommembers } from '@/common/interface/Roommembers';

const { Text } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ChatWrapper: FC = () => {
  // Return
  return (
    <ConversationsProvider>
      <Chat />
    </ConversationsProvider>
  );
};

// Use Token
const { useToken } = theme;

const Chat: FC = () => {
  // Toeken
  const { token } = useToken();

  const delay = 300;

  // Message State
  const [message, setMessage] = useState<string>('');

  // Roommembers State
  const [roommembers, setRoommembers] = useState<Roommembers[] | []>([]);

  // Chat messages
  const [messages, setMessages] = useState<Messages[]>([]);

  const [currCvsLoading, setCurrCsvLoading] = useState<boolean>(true);

  // File list
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // File list
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  // Open Drawer
  const [open, setOpen] = useState<boolean>(false);

  // Config
  const config = useConfig();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Upload file btn ref
  const uploadFileBtn: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  // Upload file image ref
  const uploadImageBtn: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  // Socket
  const socket: Socket = useSocket();

  // Conversations
  const cvsContext: any = useConversations();

  // User
  const user: any = useAuth();

  // Handle Set Message
  const handleSetMessage: any = (value: string) => setMessage(value);

  // get cursor position and add the emoji to message string
  const handleEmojiPickup = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Send messages to server
  const onSubmit = async (e: FormEvent): Promise<void> => {
    // Event prevent
    e.preventDefault();

    // Handle Messages
    const promise = async (): Promise<any> => {
      // Handle promise
      return new Promise(async (resolve, reject) => {
        // User data
        const _user = user.get;

        // Check has file
        const hasFile = fileList.length > 0 || imageList.length > 0;

        // Check message valid
        const isValid = Boolean(message) && message.trim() !== '';

        // Create message info
        const info: Messages = {
          files: [],
          sender: {
            user: _user?._id,
            avatar: _user?.avatar,
            nickname: _user?.nickname,
          },
          messages: message.trim(),
          conversation: cvsContext.current.get?._id,
          type: hasFile ? MessageType.FILES : MessageType.TEXT,
        };

        // Check message valid or has file
        if (hasFile || isValid) {
          // Has file
          if (hasFile) {
            // Each and add file to form data
            const formData = new FormData();

            // Add files
            [...fileList, ...imageList]?.forEach((file: UploadFile) => {
              // File original
              const orf = file?.originFileObj as FileType;

              // Append
              formData.append('files[]', orf);
            });

            // Clear file list
            setFileList([]);

            // Clear image list
            setImageList([]);

            // Upload Image
            const uploaded: Response = await fetcher({
              method: 'UPLOAD',
              url: '/messages/upload',
              payload: formData,
            });

            // Check is uploaed success
            if (uploaded?.status === 201) {
              // Push files name
              info.files = uploaded.data;
            }
          }
        }

        // Clear message
        setMessage('');

        // Resolve Data
        resolve(info);

        // Resject
        reject();
      });
    };

    // Handle messages promise
    promise()
      .then((res) => {
        // Send Message
        socket.emit('chat-message', res);
      })
      .catch(() => {});
  };

  // First Loading Use Effect
  useEffect(() => {
    // Check socket connected
    if (socket) {
      // Subscribes events
      socket?.on('chats', async (mes: Messages) => {
        // Check conversation
        if (mes?.conversation === cvsContext.current.get?._id) {
          // Destructure
          const { last_message, ...data } = mes;

          // Updated conversation
          const updated = {
            ...cvsContext.current.get,
            last_message,
            last_send: data.send_at,
          };

          // Set current conversation
          await cvsContext.current.update(updated);

          // Set message
          setMessages((prev) => [data, ...prev]);
        }
      });
    }

    // Cleanup
    return () => {
      socket?.off('chats');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvsContext.current.get, socket]);

  // Use Effect
  useEffect(() => {
    // Load roommembers
    cvsContext.current.get?.type === ConversationEnum.ROOMS &&
      (async () => {
        // Response
        const res: Response = await fetcher({
          method: 'GET',
          url: '/roommembers/page',
          payload: { room: cvsContext.current.get?.rooms?.[0]?._id, page: 1 },
        });

        // If response success
        if (res?.status === 200) {
          // Set members
          setRoommembers(res?.data);
        }
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvsContext.current.get?.type]);

  // Effect
  useEffect(() => {
    // List conversation length
    const listCvsLength: number = cvsContext.list.get?.length;

    // Loading current conversation
    listCvsLength > 0 &&
      (async () => {
        // Load data to session storage
        const sessionCvs = sessionStorage.getItem('tshus.curent.conversation');

        // Parse data
        const parse = sessionCvs ? JSON.parse(sessionCvs) : null;

        // Handle set current cvs
        const setCurrentCvs = cvsContext.current.set;

        // Check session has conversation
        if (parse?.user_id === user.get?._id && parse?.cvs) {
          // Set default current conversation
          setCurrentCvs(parse.cvs);
        } else {
          // Set default current conversation
          setCurrentCvs(cvsContext.list.get[0]);
        }

        // Enable loading
        setCurrCsvLoading(true);
      })();

    // Disable Loadign
    setTimeout(() => {
      setCurrCsvLoading(false);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvsContext.list.get]);

  // Use Effect
  useEffect(() => {
    // Current conversation id
    const cvsId: string = cvsContext.current.get?._id;

    // Caling
    cvsId &&
      (async () => {
        // Get messages
        const res: Response = await fetcher({
          method: 'GET',
          url: '/messages/page',
          payload: { conversation: cvsId, page: 1 },
        });

        // Check status
        if (res?.status === 200) setMessages(res?.data);
      })();

    // Return clean
    return () => {
      // Clean message
      setMessages([]);

      // Clean file list
      setFileList([]);

      // Clean image list
      setImageList([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvsContext.current.get]);

  const DrawerContent = (cvs: Conversations) => {
    // Is room
    const isRoom = cvsContext.current.get?.type === ConversationEnum.ROOMS;

    // Data
    const data = isRoom ? cvs?.rooms?.[0] : cvs?.chats?.[0]?.friend;

    // Return
    return (
      <Flex
        vertical
        style={{ height: '100%', overflow: 'auto', scrollbarWidth: 'none' }}
      >
        <Flex align="center" gap={15} vertical>
          <Avatar
            shape="square"
            style={{ width: '100%', height: 200, fontSize: 50 }}
            alt={isRoom ? data?.name?.charAt(0) : data?.nickname?.charAt(0)}
            src={
              isRoom
                ? `${BASE_URL}/${data?.image}`
                : `${BASE_URL}/${data?.avatar}`
            }
          >
            {isRoom ? data?.name?.charAt(0) : data?.nickname?.charAt(0)}
          </Avatar>
          <Flex gap={1} vertical align="center">
            <Text style={{ fontSize: 23 }}>
              {isRoom ? data?.name : data?.nickname}
            </Text>
            <Flex align="center" gap={5}>
              <Badge dot status="success" />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Đang hoạt động
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider plain orientationMargin="0" dashed />
        <Flex justify="center">
          {isRoom && data?.roommembers?.length > 0 && (
            <Fragment>
              <AddMemberToGroupModal />
              <DeleteMemberFromGroupModal roommembers={roommembers}/>
            </Fragment>
          )}
        </Flex>
        <Divider plain orientationMargin="0" dashed />
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel key={'1'} header="THÔNG TIN">
            <Flex align="left" gap={15} vertical>
              <Flex vertical gap={10}>
                <Flex align="center" gap={15}>
                  <User
                    size={18}
                    style={{ color: token.colorTextDescription }}
                  />
                  <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                    Tên: {isRoom ? data?.name : data?.nickname}
                  </Text>
                </Flex>
                <Flex align="center" gap={15}>
                  <WechatLogo
                    size={18}
                    style={{ color: token.colorTextDescription }}
                  />
                  <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                    Nhắn tin: {isRoom ? 'Phòng chat' : 'Chat riêng'}
                  </Text>
                </Flex>
                <Flex align="center" gap={15}>
                  <Calendar
                    size={18}
                    style={{ color: token.colorTextDescription }}
                  />
                  <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                    Ngày tạo: {formatToDateTime(cvs?.createdAt.toString())}
                  </Text>
                </Flex>

                {isRoom && (
                  <Fragment>
                    <Flex align="center" gap={15}>
                      <Calendar
                        size={18}
                        style={{ color: token.colorTextDescription }}
                      />
                      <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                        Số lượng thành viên: {data?.members_count} thành viên
                      </Text>
                    </Flex>
                  </Fragment>
                )}
                <Flex align="center" gap={15}>
                  <Calendar
                    size={18}
                    style={{ color: token.colorTextDescription }}
                  />
                  <Text style={{ fontSize: 13.5, fontWeight: '400' }}>
                    Tin nhắn mới nhất:{' '}
                    {formatToDateTime(cvs?.last_send.toString())}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Collapse.Panel>
        </Collapse>
        <Divider plain orientationMargin="0" dashed />
        {isRoom && roommembers?.length > 0 && (
          <Collapse defaultActiveKey={['2']}>
            <Collapse.Panel key={'2'} header="THÀNH VIÊN NHÓM">
              <Flex align="left" gap={5} vertical>
                {roommembers?.map((member: any) => (
                  <Flex
                    key={member._id}
                    justify="space-between"
                    style={{ cursor: 'pointer', padding: 2, borderRadius: 5 }}
                    className={`${
                      config.get.theme === ThemeEnum.DARK
                        ? 'cvs-d-hover'
                        : 'cvs-l-hover'
                    }`}
                    align="center"
                  >
                    <Flex align="center" gap={15}>
                      <Avatar
                        shape="square"
                        alt={member?.nickname?.charAt(0)}
                        size={35}
                      >
                        {member?.nickname?.charAt(0)}
                      </Avatar>
                      <Flex gap={1} vertical justify="space-between">
                        <Text style={{ fontSize: 14 }}>{member?.nickname}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Collapse.Panel>
          </Collapse>
        )}
      </Flex>
    );
  };

  const ContentView = (cvs: Conversations) => {
    // Conversation Name
    const cvsName =
      cvs?.type === ConversationEnum.ROOMS
        ? cvs?.rooms?.[0]?.name
        : cvs?.chats?.[0]?.friend?.nickname;

    // Return
    return currCvsLoading === true || (currCvsLoading === false && cvs) ? (
      <Flex vertical style={{ height: '100%' }}>
        <Flex
          style={{
            padding: '17px',
            backgroundColor: token.colorBgBase,
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <Flex align="center" justify="space-between" flex={1}>
            <Flex align="center" gap={15}>
              {!currCvsLoading ? (
                <Fragment>
                  <Badge
                    dot
                    style={{
                      padding: 3.5,
                      backgroundColor: token.colorSuccess,
                    }}
                    status="processing"
                    offset={[-1, '100%']}
                  >
                    <Avatar shape="square" alt={'1'} size={35}>
                      {cvsName?.charAt(0)}
                    </Avatar>
                  </Badge>
                  <Flex gap={1} vertical justify="space-between">
                    <Text style={{ fontSize: 13 }}>{cvsName}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Đang hoạt động
                    </Text>
                  </Flex>
                </Fragment>
              ) : (
                <Flex gap={10} align="center">
                  <Skeleton.Avatar
                    active
                    size={35}
                    shape="square"
                    className="flex-align"
                  />
                  <Skeleton.Input
                    active
                    style={{ width: 100, height: 35 }}
                    className="flex-align"
                  />
                </Flex>
              )}
            </Flex>
            <Button
              onClick={showDrawer}
              style={{ height: 'unset', padding: '0' }}
            >
              <Flex align="center">
                <DotsThree size={20} />
              </Flex>
            </Button>
          </Flex>
        </Flex>
        <ChatContent mes={messages} cvsId={cvs?._id} setMes={setMessages} />
        <Flex
          style={{
            padding: '20px 20px 10px 20px',
            background: token.colorBgBase,
            borderTop: `1px solid ${token.colorBorder}`,
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <Flex gap={13}>
            <Flex flex={1} gap={4}>
              <Flex align="end" justify="center">
                <ChatUploadFile
                  fileList={fileList}
                  setFileList={setFileList}
                  uploadBtn={uploadFileBtn}
                />
                <ChatUploadImage
                  imageList={imageList}
                  setImageList={setImageList}
                  uploadBtn={uploadImageBtn}
                />
              </Flex>
              <Flex flex={1}>
                <TextArea
                  variant="filled"
                  onPressEnter={(e) => !e.shiftKey && onSubmit(e)}
                  placeholder="Nhập nội dung tin nhắn"
                  autoSize
                  value={message}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onChange={(e) => handleSetMessage(e.target.value)}
                />
              </Flex>
            </Flex>
            <Flex align="flex-end" gap={10}>
              <EmojiPick onSelect={handleEmojiPickup} />
              <Button
                icon={<PaperPlaneRight size={20} />}
                type="primary"
                onClick={onSubmit}
              />
            </Flex>
          </Flex>
          <Flex>
            <Tooltip title="Gửi tin nhắn thoại" placement="topLeft">
              <Button
                icon={<Microphone size={20} />}
                type="text"
                style={{ color: token.colorTextSecondary }}
              />
            </Tooltip>
            <Tooltip title="Tải tệp lên" placement="topLeft">
              <Button
                icon={<Link size={20} />}
                type="text"
                onClick={() => uploadFileBtn?.current?.click()}
                style={{ color: token.colorTextSecondary }}
              />
            </Tooltip>
            <Tooltip title="Tải hình ảnh lên" placement="topLeft">
              <Button
                icon={<ImageSquare size={20} />}
                type="text"
                onClick={() => uploadImageBtn?.current?.click()}
                style={{ color: token.colorTextSecondary }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    ) : (
      <Flex justify="center" align="center" className="h-100">
        <EmptyVertical desc="Không có dữ liệu" />
      </Flex>
    );
  };

  // Return
  return (
    <Fragment>
      <Row style={{ height: '100%' }}>
        <Col
          xl={5}
          lg={6}
          md={8}
          sm={24}
          xs={24}
          style={{ borderRight: `1px solid ${token.colorBorder}` }}
        >
          <ChatSide token={token} cvsContext={cvsContext} user={user} />
        </Col>
        <Col xl={19} lg={18} md={16} sm={0} xs={0} className="h-100">
          {ContentView(cvsContext.current.get)}
        </Col>
      </Row>
      <Drawer title="Thông tin cuộc trò chuyện" onClose={onClose} open={open}>
        {DrawerContent(cvsContext.current.get)}
      </Drawer>
    </Fragment>
  );
};

export default ChatWrapper;
