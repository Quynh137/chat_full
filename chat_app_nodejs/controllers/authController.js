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
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
  
      const isOTPValid = await authServices.verifyOTP(email, otp);
  
      if (!isOTPValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      return res.status(200).json({ message: 'OTP verified successfully' });
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
    try {
      const { email } = req.body;
  
      const otp = await authServices.sendOtp(email);
  
      res.status(200).json({
        success: true,
        message: 'OTP Sent Successfully',
        otp,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);    }
  };
}

module.exports = new AuthController();