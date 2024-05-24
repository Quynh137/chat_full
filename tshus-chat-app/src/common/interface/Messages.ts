import { MesssageState } from "../enum/message-state.enum";
import { MessageType } from "../enum/message-type";
import { ChaterType } from "../types/user/chater.type";

export interface Messages {
     _id?: string;
     conversation: string | undefined;
     type: MessageType;
     files: any[];
     messages: string;
     state: MesssageState;
     sender: ChaterType;
     send_at?: Date;
     last_message?: string;
}
