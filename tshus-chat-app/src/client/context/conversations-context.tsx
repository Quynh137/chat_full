import { Conversations } from '@/common/interface/Conversations';
import { createContext, FC, ReactNode, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { ConversationType } from '@/common/types/conversation/cvs.type';

// Message Context
export const ConversationsContext = createContext<any>(undefined);

interface Props {
  children: ReactNode;
}

const ConversationsProvider: FC<Props> = ({ children }: Props) => {
  // Conversations List
  const [conversations, setConversations] = useState<Conversations[] | []>();

  // User data
  const user_id = useAuth().get?._id;

  // Current consersation
  const [currentCvs, setCurrentCvs] = useState<Conversations | null>(null);

  const hanleSetCurrentCvs = (cvs: Conversations) => {
    // Set current conversation to sesstion storage
    sessionStorage.setItem(
      'tshus.curent.conversation',
      JSON.stringify({ user_id, cvs }),
    );

    // Set current conversation
    setCurrentCvs(cvs);
  };

  // Update list conversation
  const updateListCvs = (cvs: Conversations) => {
    // Set new conversation
    setConversations((prev) => prev?.map((item) => item?._id === cvs?._id ? cvs : item));
  };

  const updateCurrentCvs = async (cvs: Conversations) => {
    // Set current conversation
    hanleSetCurrentCvs(cvs);

    // Update
    updateListCvs(cvs)
  };

  // Shared Data
  const sharedData: ConversationType | any = {
    list: {
      get: conversations,
      set: setConversations,
      update: updateListCvs,
    },
    current: {
      get: currentCvs,
      set: hanleSetCurrentCvs,
      update: updateCurrentCvs,
    },
  };

  // Return
  return (
    <ConversationsContext.Provider value={sharedData}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsProvider;
