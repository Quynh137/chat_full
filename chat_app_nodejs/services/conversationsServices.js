const conversationsModel = require("../Models/conversationsModel");
const mongoose = require("mongoose");

class ConversationsServices {
  // Get Services
  async create(props) {
    // Body data
    const body = props;

    // Exception
    try {
      // Created
      const created = await conversationsModel.create({
        type: body?.type,
        createdAt: new Date(),
      });

      // Return
      return created;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async get(props) {
    // Prams Data
    const params = props;

    // Exception
    try {
      // Get
      const conversation = await conversationsModel.findOne({ _id: params?._id });

      // Return
      return conversation;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async search(props) {
    const { username, find, page } = props;
    const itemsPerPage = 10; // Số mục trên mỗi trang
    const skip = (page - 1) * itemsPerPage; // Số mục bỏ qua

    try {
      // Tìm kiếm các cuộc trò chuyện dựa trên username và find
      const conversations = await conversationsModel.find({
        participants: { $elemMatch: { username } },
        // Tìm kiếm theo tên hoặc các thông tin liên quan khác của cuộc trò chuyện
        $or: [
          { name: { $regex: find, $options: "i" } }, // Tên cuộc trò chuyện
          // Các trường khác bạn muốn tìm kiếm, ví dụ: avatar, người tham gia khác, v.v.
        ],
      })
        .skip(skip)
        .limit(itemsPerPage)
        .exec();

      // Trả về danh sách cuộc trò chuyện
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error searching conversations:", error);
      // Trả về lỗi nếu có lỗi xảy ra
      res
        .status(500)
        .json({ message: "An error occurred while searching conversations" });
    }
  }

  async join(body, withRef) {
    
    // Exception
    try {
      // Get conversation
      const cvs = withRef ? await this.getWithRef(body) : await this.get(body?._id);

      if (cvs) return cvs;

      // Created
      const created = await conversationsModel.create({
        type: body?.type,
        createdAt: new Date(),
      });

      if (!withRef) return created;

      // Return
      return await this.getWithRef({
        _id: created?._id,
        type: created?.type,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async page(props) {
    // Params Data
    const params = props;

    // Exception
    try {
      const limit = 20;

      const finded = await conversationsModel.aggregate([
        {
          $lookup: {
            as: 'chats',
            from: 'chats',
            localField: '_id',
            foreignField: 'conversation',
            let: { conversationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$conversation', '$$conversationId'] },
                          {
                            $eq: [
                              '$inviter.user',
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ['$conversation', '$$conversationId'] },
                          {
                            $eq: [
                              '$friend.user',
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'rooms',
            as: 'rooms',
            localField: '_id',
            foreignField: 'conversation',
            pipeline: [
              {
                $lookup: {
                  from: 'roommembers',
                  let: { roomId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$room', '$$roomId'] },
                            {
                              $eq: [
                                '$user',
                                new mongoose.Types.ObjectId(params.user),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'roommembers',
                },
              },
              {
                $match: {
                  roommembers: { $not: { $size: 0 } },
                },
              },
            ],
          },
        },
        {
          $match: {
            $expr: {
              $not: {
                $and: [
                  {
                    $and: [{ $eq: ['$chats', []] }, { $eq: ['$rooms', []] }],
                  },
                ],
              },
            },
          },
        },
        { $limit: limit },
        { $skip: (params.page - 1) * limit },
      ]);

      // Return
      console.log(finded);
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Check type and render mes
  render_last_message(mes) {
    // Sender lastname
    const lastname = mes.sender?.nickname?.split(' ')[1];

    // Swithcare
    switch (mes.type) {
      case "FILES":
        return `${lastname} đã gửi ${mes.files.length} tệp tin.`;
      case "VOICE":
        return `${lastname} đã gửi tin nhắn thoại.`;
      default:
        // Return
        return `${lastname}: ${mes.messages}`;
    }
  }

  // Set last message
  async set_last_message(message){
    // Exception
    try {
      // Message text
      const text = this.render_last_message(message);

      // Return
      await conversationsModel.updateOne(
        { _id: message.conversation },
        { last_message: text, last_send: message.send_at },
      );

      // Return
      return text;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async getWithRef(params) {
    // Exception
    try {
      // Match type
      const type = params?.type.toLowerCase();

      const finded = await conversationsModel.aggregate([
        { $match: { _id: params?._id } },
        {
          $lookup: {
            as: type,
            from: type,
            localField: "_id",
            foreignField: "conversation",
          },
        },
      ]);

      // Return
      return finded[0];
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }
}

module.exports = new ConversationsServices();
