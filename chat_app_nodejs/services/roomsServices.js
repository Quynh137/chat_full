const roomsModel = require("../models/roomsModel");
const conversationsServices = require("./conversationsServices");
const roomMembersService = require('./roomsMemberServices');

class RoomsServices {
  async create(body) {
    try {
      // Create conversation
      const cvs_created = await conversationsServices.create({ type: 'ROOMS' });

      // Check if conversation is created
      if (cvs_created) {
        // Create Room
        const created_room = await roomsModel.create({
          name: body.name,
          image: body.image,
          conversation: cvs_created._id,
          members_count: body.members.length + 1, // Including the creator
        });

        // Check if the room is created
        if (created_room) {
          // Add members
          const add_room_members = await roomMembersService.create(
            created_room._id,
            body.creater,
            body.members,
          );

          // Return
          return add_room_members;
        }
      }
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

}

module.exports = new RoomsServices();
