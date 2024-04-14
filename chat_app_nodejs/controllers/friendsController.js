const friendsServices = require("../services/friendsServices");

class FriendsController {
  // Tìm kiếm bạn bè
  async search(req, res, next) {
     // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const finded = await friendsServices.search(body);

      // Send Response
      res.status(200).json({
        data: finded,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }

  // Gửi request kết bạn với người khác
  async send(req, res, next) {
     // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const sended = await friendsServices.send(body);

      // Send Response
      res.status(200).json({
        data: sended,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }
  async cancelRequest(req, res, next)  {
    
    const body = req.body;
  
    try {
      const result = await friendsServices.cancelRequest(body.inviter, body.friend);
      // Gửi phản hồi
      res.status(200).json({
        data: result,
        status: 200,
      });
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        message: error.message,
        status: 500,
      });
      next(error);
    }
  };
  async acceptFriendRequest(req, res, next) {
    const body = req.body;
  
    try {
      const result = await friendsServices.acceptFriendRequest(body.inviter, body.friend); // Gọi hàm acceptFriendRequest từ friendsServices
      res.status(200).json({
        data: result,
        status: 200,
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({
        message: error.message,
        status: 500,
      });
      next(error);
    }
  };
  
  async unfriend(req, res, next) {
    const { inviter, friend } = req.body;
  
    try {
        const inviterId = inviter.user;
        const friendId = friend.user;
      
        const result = await friendsServices.unfriend(inviterId, friendId);
        // Gửi phản hồi
        res.status(200).json({
            data: result,
            status: 200,
        });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({
            message: error.message,
            status: 500,
        });
        next(error);
    }
};

}

module.exports = new FriendsController();
