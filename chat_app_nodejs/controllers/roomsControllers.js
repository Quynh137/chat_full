const roomsServices = require("../services/roomsServices");

class RoomsController {
  // Lấy ra dữ liệu của chats
  async get(req, res, next) {
    // Params Data
    const params = req.query;

    // Exception
    try {
      // Call services
      const rooms = await roomsServices.get(params);

      // Send Response
      res.status(200).json({
        data: rooms,
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

  // Kiểm tra xem nếu có rồi thì trả về còn chưa có thì tạo mới
  async join(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const joined = await roomsServices.join(body);

      // Send Response
      res.status(200).json({
        data: joined,
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
}

module.exports = new RoomsController();
