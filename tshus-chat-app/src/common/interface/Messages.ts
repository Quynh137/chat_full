import { MessageType } from "antd/es/message/interface";
import { Chater } from "../types/chat/chater.type";

export interface Messages {
     _id: string;
     conversation: string;
     type: MessageType;
     files: any[];
     messages: string;
     sender: Chater;
}
