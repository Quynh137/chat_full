const { default: mongoose } = require("mongoose");
const messagesModel = require("../models/messagesModel");
const { s3, S3_BUCKET_NAME } = require('../config/aws');
class MessagesServices {
  async create(props) {
    // Body data
    const body = props;

    // Exceptionn
    try {
      // Created
      const created = await messagesModel.create({
        ...body,
        seenders: [],
      });

      // Return
      return created;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async page(props) {
    // Params data
    const params = props;

    // Exceptionn
    try {
      // Limit
      const limit = 15;

      // Skip
      const skip = (parseInt(params.page) - 1) * limit;

      // Finded
      const finded = await messagesModel
        .find({ conversation: props.conversation })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async chats(socket, data) {
    console.log(data)
    // Exceptionn
    try {
      // Created
      const created = await this.create(data);

      socket.emit("chats", created);

    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async unmessage(props) {
    // Exception
    try {
      // Message finded
      const mess = await messagesModel.findOne({ _id: props._id });

      // Nếu không tìm thấy tin nhắn
      if (!mess) throw new Error('Message not found');

      // Thu hoi tin nhan (ca hai ben khong nhin thay)
      await messagesModel.updateOne({ _id: props._id }, { state: "NONE" })

      // Return
      return true;
    } catch (error) {
      // Log any caught errors
      throw new Error(error.message);
    }
  }


  async delete(props) {
    // Exception
    try {
      // Truyền vào tham số messageId
      const _id = props._id;

      // Tìm tin nhắn để xóa dựa trên _id
      const mess = await messagesModel.findById(_id);

      // Nếu không tìm thấy tin nhắn
      if (!mess) throw new Error('Message not found');

      // Xoa tin nhan chi ban than nhin thay
      const data = await messagesModel.updateOne({ _id }, { state: "RECEIVER" });

      // Return
      return true;
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  async upload(files) {
    const uploadPromises = files.map(async file => {
        const filePath = `${Date.now().toString()}.${file.size}.${file?.originalname}`;
        const uploadParams = {
            Bucket: S3_BUCKET_NAME,
            Key: filePath,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        try {
            const s3Data = await s3.upload(uploadParams).promise();
            return {
                type: file.mimetype.includes('image') ? 'image' : file.mimetype.includes('video') ? 'video' : 'file',
                media: {
                    name: file?.originalname,
                    type: file.mimetype,
                    size: file.size,
                    url: s3Data.Location
                }
            };
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw new Error(error.message);
          }
    });

    return await Promise.all(uploadPromises);
};

// async forwardMessage(messageId, chat) {
//   try {
//     const id = messageId._id;
//     const {body} = chat;
//     const message = await messagesModel.findOne(id);
    
//     if (!message) {
//       throw new Error('Message not found');
//     }

//     const newMessage = new messagesModel({
//       nickname: message.sender.nickname,
//       image: message.sender.image,
//       sender: message.sender.user,
//       content: message.content,
//       type: message.type,
//       media: message.media,
//       isForwarded: true,
//       // sender: {} // Khởi tạo sender là một đối tượng rỗng
//     });

//     const room = await messagesModel
//     .find({ conversation: chat.conversation})
//     if (!room) {
//       throw new Error('Chat room not found');
//     }
//     newMessage.sender.nickname = message.sender.nickname;
//     newMessage.sender.image = message.sender.image;
//     const rooms = room[0];
//     room.push(newMessage._id);
//     room.lastMessage = newMessage._id;

//     await newMessage.save();
//     await rooms.save();

//     return newMessage;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }
async forwardMessage(messageId, chat) {
  try {
    const id = messageId._id;
    const message = await messagesModel.findById(id); // Sử dụng findById thay vì findOne

    if (!message) {
      throw new Error('Message not found');
    }

    // Tạo một bản sao của tin nhắn hiện có để chuyển tiếp
    const newMessage = new messagesModel({
      nickname: message.nickname,
      image: message.image,
      sender: message.sender,
      content: message.content,
      type: message.type,
      media: message.media,
      isForwarded: true,
    });

    // Lưu tin nhắn mới vào cơ sở dữ liệu
    await newMessage.save();

    // Lấy phòng trò chuyện mà tin nhắn ban đầu thuộc về
    const room = await conversationsModel.findById(chat.conversation);
    if (!room) {
      throw new Error('Chat room not found');
    }

    // Thêm ID của tin nhắn mới vào danh sách tin nhắn của phòng trò chuyện
    room.messages.push(newMessage._id);
    // Cập nhật tin nhắn cuối cùng của phòng trò chuyện
    room.lastMessage = newMessage._id;

    // Lưu lại phòng trò chuyện đã cập nhật
    await room.save();

    return newMessage;
  } catch (error) {
    throw new Error(error.message);
  }
}

}
module.exports = new MessagesServices();