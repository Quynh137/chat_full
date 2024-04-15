import React from 'react';
import ChatLine from './line';
import { Divider, Flex } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetcher } from '@/common/utils/fetcher';
import { Response } from '@/common/types/response/response.type';
import { Messages } from '@/common/interface/Messages';
import EmptyVertical from '@/client/components/empty/vertical.empty';

type Props = {
  mes: Messages[];
  cvsId: any;
  setMes: React.Dispatch<React.SetStateAction<any[]>>;
};

const ChatContent: React.FC<Props> = React.memo(
  ({ mes, cvsId, setMes }: Props) => {
    // Page
    const [page, setPage] = React.useState<number>(1);

    // Is has more
    const [hasMore, setHasMore] = React.useState<boolean>(true);

    const next = async () => {
      // Get messages
      const res: Response = await fetcher({
        method: 'GET',
        url: '/messages/page',
        payload: { conversation: cvsId, page: page + 1 },
      });

      // Check status
      if (res?.status === 200) {
        // Data
        const data = res?.data;

        // Check end messsage
        if (data?.length === 0) setHasMore(false);

        // Set page
        setPage(page + 1);

        // Set messages
        setMes(mes.concat(res?.data));
      }
    };

    // Return
    return (
      <Flex style={{ overflowY: 'auto' }} flex={1}>
        {mes?.length > 0 ? (
          <Flex
            flex={1}
            id="scrollableDiv"
            className="hide-scrollbar"
            style={{
              overflowY: 'auto',
              flexDirection: 'column-reverse',
              scrollBehavior: 'smooth',
            }}
          >
            <InfiniteScroll
              next={next}
              inverse={true}
              hasMore={hasMore}
              dataLength={mes.length}
              scrollableTarget="scrollableDiv"
              loader={<React.Fragment />}
              endMessage={<Divider plain>Không còn tin nhắn nào</Divider>}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                scrollBehavior: 'smooth',
              }}
            >
              {mes?.map((msg) => (
                <ChatLine key={msg._id} data={msg} />
              ))}
            </InfiniteScroll>
          </Flex>
        ) : (
          <Flex justify="center" align="center" flex={1}>
            <EmptyVertical desc="Không có tin nhắn nào" />
          </Flex>
        )}
      </Flex>
    );
  },
);

export default React.memo(ChatContent);
