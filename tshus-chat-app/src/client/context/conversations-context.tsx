import React from 'react';

// Message Context
export const ConversationsContext = React.createContext(null);

interface Props {
  children: React.ReactNode;
}

const ConversationsProvider: React.FC<Props> = ({ children }: Props) => {
  // Conversations List
  const [conversations, setConversations] = React.useState<any[] | null>();

  // Current consersation
  const [currentCvs, setCurrentCvs] = React.useState<any | null>(null);

  // Shared Data
  const sharedData: any = {
    list: {
      get: conversations,
      set: setConversations,
    },
    current: {
      get: currentCvs,
      set: setCurrentCvs,
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
