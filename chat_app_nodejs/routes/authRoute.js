const express = require("express");
const { login, register, sendOtp, verifyOTP } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/sendOtp', sendOtp)
router.post('/verifyOTP', verifyOTP)

module.exports = router;
