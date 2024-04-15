const chatsModel = require("../Models/chatsModel");
const conversationsServices = require("../services/conversationsServices"); 

class ChatsServices {
  async get(props) {
    // Body data
    const params = props;

    // Exception
    try {
      // Find
      return await chatsModel.findOne({
        "inviter.user": params.inviter,
        "friend.user": params.friend,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Kiểm tra xem nếu có rồi thì trả về còn chưa có thì tạo mới
  async join(props) {
    // Body data
    const body = props;

    // Chat type
    const type = "CHATS";

    // Find chat
    const finded = await this.get({
      inviter: body.inviter.user,
      friend: body.friend.user,
    });

    let _id = finded?.conversation;

    if (!finded) {
      // Joined conversation
      const joinedCvs = await conversationsServices.join({ type });

      // Assign conversation
      _id = joinedCvs?._id.toString();

      // Create chats
      await chatsModel.create({
        conversation: _id,
        friend: body.friend,
        inviter: body.inviter,
        createdAt: new Date(),
      });
    }

    // Get with ref
    const getWithRef = await conversationsServices.getWithRef({ _id, type });

    // Return
    return getWithRef;
  }
}

module.exports = new ChatsServices();
