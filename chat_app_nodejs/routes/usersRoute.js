const express = require('express')
const router = express.Router();
const { get, find } = require("../controllers/usersController");

router.get("/get", get);
router.get("/find", find);

module.exports = router;
