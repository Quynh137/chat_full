const roomMembersModel = require("../models/roommembersModel");
const mongoose = require("mongoose");

class roomMembersServices {
  async check_role(user, role) {
    // Exception
    try {
      // Return
      return await roomMembersModel.findOne({
        user: new mongoose.Types.ObjectId(user),
        role,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Add member services
  async create(room, creater, members) {
    // Map insert data
    const data = members.map((member) => ({
      room: room,
      user: member.member.user,
      nickname: member.member.nickname,
      role: member.role,
    }));

    // Exception
    try {
      // Created
      const insert = await roomMembersModel.insertMany([
        {
          room: room,
          user: creater.member.user,
          nickname: creater.member.nickname,
          role: creater.role,
        },
        ...data,
      ]);

      // Create
      return insert;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Add member services
  async add(body) {
    // Exception
    try {
      // Finded
      const check = await this.check_role(body.user, "MANAGER");

      const finded = await roomMembersModel.findOne({
        user: new mongoose.Types.ObjectId(body.member.member.user),
        room: body.room,
      });

      // Check check
      if (check) {
        // Check finded
        if (!finded) {
          // Delete
          return await roomMembersModel.create({
            nickname: body.member.member.nickname,
            user: body.member.member.user,
            room: body.room,
            role: body.member.role,
          });
        } else {
          // Throw http exception
          throw new Error("Thành viên này đã có trong nhóm này rồi");
        }
      } else {
        // Throw http exception
        throw new Error("Bạn không có quyền thêm thành viên");
      }
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async delete(params) {
    // Exceptionn
    try {
      // Finded
      const finded = await this.check_role(params.user, "MANAGER");

      // Check finded
      if (finded) {
        // Delete
        return await roomMembersModel.deleteOne({
          _id: new mongoose.Types.ObjectId(params.member),
        });
      } else {
        // Throw http exception
        throw new Error("Bạn không có quyền đuổi thành viên");
      }
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async page(params) {
    // Exceptionn
    try {
      // Finded
      const finded = await roomMembersModel.find({
        room: new mongoose.Types.ObjectId(params.room),
      });

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }
}

module.exports = new roomMembersServices();
