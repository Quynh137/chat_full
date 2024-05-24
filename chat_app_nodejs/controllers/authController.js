const authServices = require("../services/authServices");

class AuthController {
  // Login
  async login(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const loged = await authServices.login(body);
      console.log(loged);
      // Send Response
      res.status(200).json({
        data: loged,
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
  
  async verifyOTP(req, res, next) {
    // Exception
    try {
      // Get OTP
      await authServices.verifyOTP(req.body);
  
<<<<<<< HEAD
      // Send
      res.status(200).json({ message: 'Xác thực OTP thành công' });

      // Next
      next();
=======
      const isOTPValid = await authServices.verifyOTP(email, otp);
      
      if (!isOTPValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      return res.status(200).json({ 
        data: isOTPValid,
        status: 200,
       });
>>>>>>> ad4e62adbe339590df7032be9c3bc91d913e8f1f
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      });  
    }
  }
  
  async register(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const registed = await authServices.register(body);

      // Send Response
      res.status(registed.status).json(registed);

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
  async sendOtp(req, res, next) {
    // Exception
    try {
      // OTP
      await authServices.sendOtp(req.body);
  
      // Send
      res.status(200).json({ message: 'Tạo mã OTP thành công, vui lòng kiểm tra Email' });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);    }
  };
}

module.exports = new AuthController();
