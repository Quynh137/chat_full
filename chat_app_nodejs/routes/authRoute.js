const express = require("express");
const { login, register, sendOtp, verifyOTP, sendResetPass, updatePassword} = require("../controllers/authController");



const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/sendOtp', sendOtp)
router.post('/verifyOTP', verifyOTP)
router.post('/sendResetPass', sendResetPass);
router.post('/updatePassword', updatePassword);

module.exports = router;
