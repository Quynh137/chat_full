const messagesModel = require("../models/messagesModel");
const { s3, S3_BUCKET_NAME } = require("../config/aws");
const cvsServices = require("./conversationsServices");
const { default: mongoose } = require("mongoose");

class MessagesServices {
  async create(props) {
    // Body data
    const body = props;

    // Exceptionn
    try {
      // Created
      const created = await messagesModel.create({
        ...body,
        seenders: [],
      });

      const last_message = await cvsServices.set_last_message(created);

      // Return
      return { ...created._doc, last_message };
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async page(props) {
    // Params data
    const params = props;

    // Exceptionn
    try {
      // Limit
      const limit = 15;

      // Skip
      const skip = (parseInt(params.page) - 1) * limit;

      // Finded
      const finded = await messagesModel
        .find({ conversation: props.conversation })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async chats(data) {
    // Exceptionn
    try {
      // Created
      const created = await this.create(data);

      // Return
      return created;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async unmessage(params) {
    // Exception
    try {
      // Finded
      const updated = await messagesModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(params._id),
        },
        {
          state: "NONE",
        },
      );

      console.log(params);

      // Return
      return updated;
    } catch (error) {
      // Log any caught errors
      throw new Error(error.message);
    }
  }

  async transfer(body) {
    // Exceptionn
    try {
      // Created
      const tranfer = await messagesModel.create({
        ...body,
        seenders: [],
        send_at: new Date(),
      });

      // Last message
      const last_message = await cvsServices.set_last_message(tranfer);

      // Return
      return { ...tranfer._doc, last_message };
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async delete(props) {
    // Exception
    try {
      // Truyền vào tham số messageId
      const _id = props._id;

      // Tìm tin nhắn để xóa dựa trên _id
      const mess = await messagesModel.findById(_id);

      // Nếu không tìm thấy tin nhắn
      if (!mess) throw new Error("Không tìm thấy tin nhắn");

      // Xoa tin nhan chi ban than nhin thay
      const data = await messagesModel.updateOne(
        { _id },
        { state: "RECEIVER" },
      );

      // Return
      return true;
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  async upload(files) {
    const uploadPromises = files.map(async (file) => {
      const filePath = `${Date.now().toString()}.${file.size}.${
        file?.originalname
      }`;
      const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      // Exception
      try {
        const s3Data = await s3.upload(uploadParams).promise();

        // Destructuring
        const { buffer, filename, originalname, ...data } = file;

        // Return
        return { ...data, filename: filePath, originalname: filePath };
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error(error.message);
      }
    });

    return await Promise.all(uploadPromises);
  }

  // Transfer
  async transfer(body) {
    // Exceptionn
    try {
      // Created
      const tranfer = await messagesModel.create({
        ...body,
        seenders: [],
        send_at: new Date(),
      });

      // Last message
      const last_message = await cvsServices.set_last_message(tranfer);

      // Return
      return { ...tranfer, last_message };
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

}
module.exports = new MessagesServices();
