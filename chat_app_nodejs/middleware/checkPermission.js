const jwt = require('jsonwebtoken');
// const userMember = require('../models/roommembersModel')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const User = require('../models/usersModel');
const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    console.log("abc", user)
    if(!user){
        return res.status(403).json({
            message: "Token lỗi!",
        });
    }

    if (!user.roles.includes("USER")) {
        return res.status(400).json({
            message: "Bạn không đủ quyền làm việc này!",
        });
    }
    
    next();
};

module.exports = authenticateJWT;
