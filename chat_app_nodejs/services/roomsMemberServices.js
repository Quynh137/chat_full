const roomMembersModel= require("../models/roommembersModel");

class roomMembersServices {
    // Add
    async add(room, creater, members) {
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
}

module.exports = new roomMembersServices();
