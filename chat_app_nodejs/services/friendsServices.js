const { mongoose } = require("mongoose");
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

  //Đặt trạng thái mối quan hệ bạn bè
  async page(props) {
    // Exception
    try {
      // Created
      const friend = await friendsModel.find({
        $and: [
          {
            $or: [
              { "inviter.user": props.user },
              { "friend.user": props.user },
            ],
          },
          { state: "ACCEPTED" },
          { block: false },
        ],
      });

      let data = {};
      
      // Data
      friend?.forEach((i) => {
        // Check is inviter
        if (i?.inviter?.user === props.user) {
          // Group to
          data[i.friend.nickname.charAt(0).toUpperCase()] = [i?.inviter];
        } else {
          // Group to
          data[i.inviter.nickname.charAt(0).toUpperCase()] = [i?.inviter];
        }
      });
      
      //  Return
      return data;
      
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async load_request(props) {
    // Exception
    try {
      // Load reqeust
      const request = await friendsModel.find({
        $and: [{ "friend.user": props.user }, { state: "PENDING" }],
      });

      // Load sended
      const sended = await friendsModel.find({
        $and: [{ "inviter.user": props.user }, { state: "PENDING" }],
      });

      //  Return
      return { request, sended };
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
      if (friend)
        return { status: 400, message: "Đã gửi kết bạn cho người này rồi" };

      // Created
      await this.create(body);
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  // Check trang thai ban be
  async check(inviter, friend) {
    // Exception
    try {
      // Kiem tra xem 2 nguoi dung co phai ban be khong
      const isFriend = await friendsModel.findOne({
        $or: [
          {
            $and: [{ "inviter.user": inviter }, { "friend.user": friend }],
          },
          {
            $and: [{ "inviter.user": friend }, { "friend.user": inviter }],
          },
        ],
      });

      // Check xem minh co phai nguoi gui khong
      const isSender = isFriend?.inviter?.user?.toString() === inviter;

      // Return
      return {
        // Cai nay la trang thai ban be, neu da ton tai trong conllection thi tra ve trang thai trong collec, con neu trong collect chua co thi tra ve NOT_YET
        // Van phai de cai NOT_YET ne, bo cai REQUEST :))))
        state: isFriend ? isFriend.state : "NOT_YET",
        // Tra ve xem minh co phai la nguoi gui khong
        isSender,
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  // Tim kiem ban be
  async search(params) {
    // Exception
    try {
      // Tạo một biến để lưu trữ các điều kiện tìm kiếm
      const searchConditions = [];

      // Tìm kiếm dựa trên một phần của tên của inviter hoặc friend
      searchConditions.push({
        $or: [
          { "inviter.nickname": { $regex: params.search, $options: 'i' } }, // $regex: Tìm kiếm dựa trên một phần của tên, $options: 'i' để không phân biệt chữ hoa chữ thường
          { "friend.nickname": { $regex: params.search, $options: 'i' } },
        ],
      });

      // Thêm các điều kiện khác (state và block)
      searchConditions.push({ state: "ACCEPTED" });
      searchConditions.push({ block: false });

      // Thực hiện truy vấn với các điều kiện tìm kiếm được tổng hợp
      const finded = await friendsModel
        .find({ $and: searchConditions })
        .limit(params.limit);

      // Trả về kết quả
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
}


  //hủy lời mời kết ban
  async cancel(params) {
    // Exception
    try {
      // Tìm yêu cầu kết bạn ở trạng thái PENDING
      const deleted = await friendsModel.deleteOne({
        _id: new mongoose.Types.ObjectId(params),
      });

      // Check
      if (deleted?.deletedCount !== 0) {
        // Return
        return deleted;
      } else {
        // Throw error
        throw new Error("Thu hồi yêu cầu kết bạn không thành công");
      }
    } catch (error) {
      // Xử lý lỗi
      throw new Error(error.message);
    }
  }

  //Đồng ý lời mời kb
  async accept(params) {
    // Exception
    try {
      // Tìm yêu cầu kết bạn ở trạng thái PENDING
      const updated = await friendsModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(params),
        },
        { state: "ACCEPTED" },
      );

      // Check
      if (updated) {
        // Return
        return updated;
      } else {
        // Throw error
        throw new Error("Đồng ý yêu cầu kết bạn thất bại");
      }
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
        $or: [{ "inviter.user": inviter }, { "friend.user": friend }],
      });

      const upRequest = await friendsModel.updateMany(
        {
          $or: [
            { "inviter.user": inviter, state: "PENDING" },
            { "friend.user": friend, state: "PENDING" },
          ],
        },
        { $set: { state: "NOTYET" } },
      );

      return {
        status: 200,
        message: "Đã hủy kết bạn và cập nhật trạng thái thành NOTYET",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
module.exports = new FriendsServices();
