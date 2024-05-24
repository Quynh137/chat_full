const conversationsServices = require("../services/conversationsServices");

class ConversationsController {
  async get(req, res, next) {
    // Body Data
    const params = req.query;

    // Exception
    try {
      // Call services
      const user = await conversationsServices.get(params);

      // Send Response
      res.status(200).json({
        data: user,
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

  async page(req, res, next) {
    // Body Data
    const params = req.query;

    // Exception
    try {
      // Call services
      const page = await conversationsServices.page(params);

      // Send Response
      res.status(200).json({
        data: page,
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

  async join(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const user = await conversationsServices.join(body);

      // Send Response
      res.status(200).json({
        data: user,
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

  async search(req, res, next) {
    // Body Data
    const params = req.query;

    // Exception
    try {
      // Call services
      const finded = await conversationsServices.search(params);

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
}

module.exports = new ConversationsController();
