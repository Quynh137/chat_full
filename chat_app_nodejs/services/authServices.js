const { createToken } = require("../core/token");
const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const OTP = require("../core/otp");
const validator = require("validator");
var cache = require('memory-cache');


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
          message: "All fields are required.",
        };
      }

      if (!validator.isEmail(email)) {
        //  Return
        return {
          status: 400,
          message: "Email is invalid.",
        };
      }
      if (!validator.isMobilePhone(phone, "any", { strictMode: false })) {
        //  Return
        return {
          status: 400,
          message: "Phone must be a valid number excluding country code..",
        };
      }

      // if (!validator.isStrongPassword(password)) {
      //   //  Return
      //   return {
      //     status: 400,
      //     message: "Password must be strong..",
      //   };
      // }

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
        gender: gender || usersModel.schema.paths.gender.defaultValue,
        // mail_otp: otp,
        online: { state: "OFFLINE", time: Date.now() },
        otp:"000000"
      });

      await created.save();

      // Return
      return {
        status: 200,
        message: "Register successfully.",
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }
  async sendOtp(email) {
    try {
      const checkUserPresent = await usersModel.findOne({ email });
  
      if (checkUserPresent) {
        throw new Error('Tài khoản đã được đăng ký');
      }
      // // Create Email OTP
      const otp = await OTP.generateOTP();

      cache.put(email, otp);

      // // Call mail sender
      await OTP.mailSender(email, otp, 300000);

      return otp;
    } catch (error) {
      throw error;
    }
  }

async verifyOTP(email, otp) {
  try {
    const cachedOTP = cache.get(email);

    if (!cachedOTP) {
      throw new Error('Invalid or expired OTP');
    }

    if (otp !== cachedOTP) {
      throw new Error('Invalid OTP');
    }

    cache.del(email);

    return true;
  } catch (error) {
    throw error;
  }
}

}

module.exports = new AuthServices();
