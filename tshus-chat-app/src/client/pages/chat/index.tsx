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
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  ImageSquare,
  Link,
  Microphone,
  PaperPlaneRight,
} from '@phosphor-icons/react';
import EmojiPick from '@/client/components/emoji';
import ConversationsProvider from '@/client/context/conversations-context';
import { useConversations } from '@/client/hooks/user-conversations';
import { useSocket } from '@/common/hooks/use-socket';
import { useAuth } from '@/client/hooks/use-auth';
import ChatSide from './chat-layout/side';
import ChatUploadFile from './chat-upload/upload-file';
import ChatUploadImage from './chat-upload/upload-image';
import { MessageType } from '@/common/enum/message-type';
import { Response } from '@/common/types/response/response.type';
import { fetcher } from '@/common/utils/fetcher';
import { Socket } from 'socket.io-client';
import ChatContent from './chat-layout/content';
import ChatHead from './chat-layout/head';
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

  // Chat messages
  const [messages, setMessages] = useState<Messages[]>([]);

  const [currCvsLoading, setCurrCsvLoading] = useState<boolean>(true);

  // File list
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // File list
  const [imageList, setImageList] = useState<UploadFile[]>([]);

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

    // Get messages with page

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
      setMessages([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvsContext.current.get]);

  const ContentView = (cvs: any) => {
    return currCvsLoading === true || (currCvsLoading === false && cvs) ? (
      <Flex vertical style={{ height: '100%' }}>
        <ChatHead token={token} cvs={cvs} currCvsLoading={currCvsLoading} />
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
    </Fragment>
  );
};

export default ChatWrapper;
