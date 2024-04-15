import { MessageType } from "@/common/enum/message-type";
import { ChaterType } from "@/common/types/user/chater.type";

export interface Messages {
     _id?: string;
     conversation: string;
     type: MessageType;
     files: any[];
     messages: string;
     sender: ChaterType;
     send_at?: Date;
     last_message?: string;
}
