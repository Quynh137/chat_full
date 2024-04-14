import React from 'react';
import { ConversationsContext } from '@/client/context/conversations-context';

// Use Message
export const useConversations: Function = () =>
  React.useContext<any>(ConversationsContext);
