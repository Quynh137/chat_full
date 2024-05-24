const express = require("express");
const { login, register, sendOtp, verifyOTP } = require("../controllers/authController");



const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/verify/check', verifyOTP)
router.post('/verify/create', sendOtp)

module.exports = router;
