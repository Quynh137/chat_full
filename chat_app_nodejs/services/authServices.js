const { createToken } = require("../core/token");
const usersModel = require("../models/usersModel");
const otpModel = require("../models/otpModel");

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
      const { email, otp, phone, password, firstname, lastname, gender} = props;

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
       if (!validator.isEmail(email)) {
        //  Return
        return {
          status: 400,
          message: "Email is invalid.",
        };
      }
      // Tạo mã OTP
      const otp = await OTP.generateOTP();
      // Lưu mã OTP vào trường `otp` của người dùng
      const created = new otpModel({
        email,
        otp,
      });

      await created.save();

      // Gửi mã OTP đến email của người dùng
      await OTP.mailSender(email, otp, 600000);
      return otp;
    } catch (error) {
      throw error;
    }
  }

async verifyOTP(email, otp) {
  try {
    // Tìm người dùng có email tương ứng
    const user = await otpModel.findOne({ email });
    // Kiểm tra xem OTP của người dùng có trùng khớp không
    if (!user || otp !== user.otp) {
      throw new Error('OTP không hợp lệ.');
    }
    return true;
  } catch (error) {
    throw error;
  }
}


async sendResetPass(email) {
  try {
    if (!email) {
      throw new Error('Không tìm thấy email');
    }
   // // Create Email OTP
   const otp = await OTP.generateOTP();

   const created = new otpModel({
    email,
    otp,
  });
  await created.save();

   // // Call mail sender
   await OTP.mailSender(email, otp, 300000);

    return otp;
  } catch (error) {
    throw error;
  }
}

async updatePassword(email, password) {
  if (!email || !password) {
    throw new Error("Email hoặc mật khẩu mới không được để trống");
  }
  const user = await usersModel.findOne({ email });
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Cập nhật mật khẩu
  user.password = hashedPassword;

  // Lưu thay đổi vào cơ sở dữ liệu
  await user.save();
  return { success: true, message: "Mật khẩu đã được cập nhật thành công" };
}

}

module.exports = new AuthServices();
