const roomsModel= require("../models/roomsModel");
const conversationsServices = require("./conversationsServices"); 
const roomsMembersModel = require('../models/roommembersModel');
class RoomsServices {
  async get(props) {
    // Body data
    const params = props;

    // Exception
    try {
      // Find
      return await roomsModel.findOne({
        "name": params.name,
        "image": params.image,
        "member_count": params.member_count,
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
    const type = "ROOM";

    // Find chat
    const finded = await this.get({
        "name": body.name,
        "image": body.image,
        "member_count": body.member_count,
    });

    let _id = finded?.conversation;

    if (!finded) {
        if (body.member_count < 3) {
            throw new Error("Phòng chat cần ít nhất 3 thành viên để tạo nhóm.");
        }
        // Joined conversation
        const joinedCvs = await conversationsServices.join({ type });

        // Assign conversation
        _id = joinedCvs?._id.toString();

        // Create chats
        await roomsModel.create({
            conversation: _id,
            name: body.name,
            image: body.image,
            member_count: body.member_count,
            created_at: new Date(),
        });
    } else {
      const isUserJoined = await roomsMembersModel.aggregate([
        {
          $match: {
            room: finded._id, // ID của phòng
            user: body._id, // ID của người dùng
          },
        },
        {
          $count: "count",
        },
      ]);
    }

    // Get with ref
    const getWithRef = await conversationsServices.getWithRef({ _id, type });

    // Return
    return getWithRef;
}

}

module.exports = new RoomsServices();
