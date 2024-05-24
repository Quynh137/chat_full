export interface Conversations {
  _id: string;
  type: string;
  chats?: any;
  rooms?: any;
  last_send: Date;
  last_message: string;
  created_at: Date;
  updated_at: Date;
}
