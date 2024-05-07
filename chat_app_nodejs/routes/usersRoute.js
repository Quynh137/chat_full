const express = require('express')
const router = express.Router();
const { get, find } = require("../controllers/usersController");
const auth_MiddleWare = require("../middleware/authMiddleWare")

router.get("/get", get);
router.get("/find", find);

module.exports = router;
