const { createToken } = require("../core/token");
const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const OTP = require("../core/otp");
const validator = require("validator");
const cache = require("memory-cache");

class AuthServices {
  // Login
  async login(props) {
    // Exception
    try {
      let user = await usersModel.findOne({ email: props.email });

      if (!user) throw Error("Invalid email or password");

      const isValidPassword = await bcrypt.compare(
        props.password,
        user.password,
      );

      if (!isValidPassword) throw Error("Invalid email or password");

      // Token
      const token = createToken(user._id);
<<<<<<< HEAD

=======
>>>>>>> ad4e62adbe339590df7032be9c3bc91d913e8f1f
      // Remove password
      const { password, lastname, firstname, ...data } = user._doc;

      // Return
      return {
        token: token,
        user: {
          ...data,
          nickname: `${firstname} ${lastname}`,
        },
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async register(props) {
    // Exception
    try {
      const { email, phone, password, firstname, lastname, gender } = props;

      const user = await usersModel.findOne({ email });

      //  Check user is valid
      if (user)
        //  Return
        return {
          status: 400,
          message: "User with the given email already exists.",
        };

      if (!email || !password || !phone) {
        //  Return
        return {
          status: 400,
          message: "Vui lòng nhập đầy đủ các trường.",
        };
      }

      if (!validator.isEmail(email)) {
        //  Return
        return {
          status: 400,
          message: "Email không đúng định dạng.",
        };
      }
      if (!validator.isMobilePhone(phone, "any", { strictMode: false })) {
        //  Return
        return {
          status: 400,
          message: "Số điện thoại không đúng định dạng",
        };
      }

      //  Salt password
      const salt = await bcrypt.genSalt(10);

      //  Hash password
      const hashPassword = await bcrypt.hash(password, salt);

      // Create User
      const created = new usersModel({
        email,
        phone,
        firstname,
        lastname,
        password: hashPassword,
        roles: ["USER"],
        gender: gender,
        online: { state: "OFFLINE", time: Date.now() },
      });

      // Save to database
      await created.save();

      // Delete otp from cache
      cache.del(email);

      // Return
      return {
        status: 200,
        message: "Đăng ký thành công.",
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async sendOtp(body) {
    // Exception
    try {
      // Find user
      const find = await usersModel.findOne({ email: body.email });

      // If user is exist
      if (find) throw new Error("Tài khoản đã được đăng ký");

      // Create Email OTP
      const otp = await OTP.generateOTP();

      // Push OTP to cache
      cache.put(body.email, JSON.stringify({ otp, verify: false }), 1 * 1000 * 60);

      // Sender to email
      await OTP.mailSender(body.email, otp);

      // Return
      return otp;
    } catch (error) {
      // Throw error
      throw Error(error.message);
    }
  }

  async verifyOTP(params) {
    // Exception
    try {
      // Get cache otp
      const JSON_OTP = await cache.get(params.email);
      
      // Check OTP is exist
      if (JSON_OTP) {
        // OTP
        const { otp } = JSON.parse(JSON_OTP);

        // Check match otp
        if (otp !== params.otp)
          throw new Error("OTP không trùng khớp, vui lòng thử lại");

        // Change verify to true
        cache.put(params.email, JSON.stringify({ otp, verify: true }), 60 * 1000 * 60);

        // Return
        return otp;
      }

      // Throw error
      throw new Error("OTP chưa được tạo hoặc đã hết hạn");

      // Return
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthServices();
