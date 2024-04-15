const usersModel = require("../models/usersModel");
const friendsService = require("./friendsServices");

class UsersServices {
  // Get Services
  async get(props) {                           
    // Exception
    try {
      // Users
      const users = await usersModel.find({ _id: props.id });

      // Return
      return users;
    } catch (error) {
          
      // Throw error
      throw new Error(error.message);
    }
  }

  async find(props) {
    // Find type
    const type = props.type.toLowerCase();

    // Match find condition
    const match = { [type]: props.search, _id: { $ne: props.user } };

    // Exception
    try {
      // Find user
      const finded = await usersModel.findOne(match).exec();

      // Check finded
      if (!finded) return null;

      const friend = await friendsService.check(
        props.user.toString(),
        finded._id.toString(),
      );

      const { password, firstname, lastname, ...data } = finded._doc;


      // Return
      return {
        ...data,
        ...friend,
        nickname: `${firstname} ${lastname}`,
      };
    } catch (e) {
      // Throw error
      throw new Error(e.message);
    }
  }
}
module.exports = new UsersServices();
