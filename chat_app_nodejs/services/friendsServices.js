const friendsModel = require("../models/friendsModel");

class FriendsServices {

//Đặt trạng thái mối quan hệ bạn bè
  async create(props) {
    // Exception
    try {
      // Created
      const friend = await friendsModel.create(props);

      //  Return
      return friend;
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  // Gui yeu cau ket ban
  async send(body) {
    // Exception
    try {
      // Check friend is exists
      const friend = await friendsModel.findOne({
        "inviter.user": body.inviter.user,
        "friend.user": body.friend.user,
      });

      // Throw error if friend is exists
      if (friend) return {status: 400, message: "Đã gửi kết bạn cho người này rồi"};

      // Created
      await this.create(body);
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  // Check 2 user trong mqh ban be
  async check(inviter, friend) {
    // Exception
    try {
      const isFriend = await friendsModel.findOne({
        "inviter.user": inviter,
        "friend.user": friend,
      });

      // Return
      return isFriend ? isFriend?.state : 'NOT_YET';
    } catch (error) {
     // Throw error
      throw new Error(error.message);
    }
  }

  // Tim kiem ban be
  async search(params) {
    // Exception
    try {
      // Exception
      const finded = await friendsModel
        .find({
          $text: { $search: params.search },
          "inviter.user": params.inviter,
          block: false,
        })
        .limit(params.limit);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  //hủy lời mời kết ban
  async cancelRequest(inviter, friend) {
    try {
      // Tìm yêu cầu kết bạn ở trạng thái PENDING
      const request = await friendsModel.findOneAndDelete({
        "inviter.user": inviter.user,
        "friend.user": friend.user,
        "state": "PENDING"
      });
  
      // Nếu không tìm thấy yêu cầu kết bạn
      if (!request) {
        throw new Error("Không tìm thấy yêu cầu kết bạn");
      }
  
      // Cập nhật trạng thái thành NOTYET
      const updatedRequest = await friendsModel.findByIdAndUpdate(request._id, { new: true });
  
      // Trả về thông báo thành công
      return { status: 200, message: "Đã hủy yêu cầu kết bạn" };
    } catch (error) {
      // Xử lý lỗi
      throw new Error(error.message);
    }
  }
  

//Đồng ý lời mời kb
async acceptFriendRequest(inviter, friend) {
  try {
    // Tìm yêu cầu kết bạn có trạng thái PENDING
    const request = await friendsModel.findOneAndUpdate({
      "inviter.user": inviter.user,
      "friend.user": friend.user,
      "state": "PENDING"
    }, { state: "ACCEPTED" }, { new: true });

    // Nếu không tìm thấy yêu cầu kết bạn
    if (!request) {
      throw new Error("Không tìm thấy yêu cầu kết bạn");
    }

    // Trả về thông báo thành công
    return { status: 200, message: "Đã chấp nhận yêu cầu kết bạn" };
  } catch (error) {
    // Xử lý lỗi
    throw new Error(error.message);
  }
}


//xoa ban
async unfriend(inviter, friend) {
  try {
    // Xóa mối quan hệ bạn bè với nhiều người
    const request = await friendsModel.deleteMany({
      $or: [
        { "inviter.user": inviter },
        { "friend.user": friend }
      ]
    });

    const upRequest = await friendsModel.updateMany(
      { 
        $or: [
          { "inviter.user": inviter, "state": "PENDING" },
          { "friend.user": friend, "state": "PENDING" }
        ]
      },
      { $set: { state: "NOTYET" } }
    );

    return { status: 200, message: "Đã hủy kết bạn và cập nhật trạng thái thành NOTYET" };
  } catch (error) {
    throw new Error(error.message);
  }
}

}
module.exports = new FriendsServices();
