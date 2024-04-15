import { Conversations } from '@/common/interface/Conversations';
import React from 'react';
import { useAuth } from '../hooks/use-auth';

// Message Context
export const ConversationsContext = React.createContext(null);

interface Props {
  children: React.ReactNode;
}

const ConversationsProvider: React.FC<Props> = ({ children }: Props) => {
  // Conversations List
  const [conversations, setConversations] = React.useState<Conversations[] | null>();

  // Lay ra user_id tu useAuth
  const user_id: string = useAuth()?.get?._id;

  // Current consersation
  const [currentCvs, setCurrentCvs] = React.useState<Conversations | null>(null);

  // Ham nay su dung de khi m gui tin nhan thi no se update luon o phan tin nhan nhanh (last_message)
  const updateCurrentCvs = async (cvs: Conversations) => {
    // Set current conversation
    hanleSetCurrentCvs(cvs);

    // Find index
    const i: number | undefined = conversations?.findIndex(
      (c) => c._id === cvs._id,
    );

    // New conversation
    const newCvs = conversations;

    // Check and set data
    if (newCvs && i !== -1 && i !== undefined) {
      // Set new data
      newCvs[i] = {...newCvs[i], ...cvs};

      // Set conversation
      setConversations(newCvs);
    }
  };

  // Ham nay de "luu vao" storage de moi khi load lai trang no khong bi chuyen sang chat khac
  // Luu ca user id vao, neu la nguoi dung do thi load ra, neu khong phai thi khong load

  // Handle set current conversation
  const hanleSetCurrentCvs = (cvs: Conversations) => {
    // Set to session
    sessionStorage.setItem(
      'tshus.current.conversation', 
      JSON.stringify({user_id, cvs})
    );

    // Set current cvs
    setCurrentCvs(cvs);

  }
  // Shared Data
  const sharedData: any = {
    list: {
      get: conversations,
      set: setConversations,
    },
    current: {
      get: currentCvs,
      set: hanleSetCurrentCvs,
      update: updateCurrentCvs
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
