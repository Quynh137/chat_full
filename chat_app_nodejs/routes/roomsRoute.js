const express = require('express');
const router = express.Router();
const {get, join} = require("../controllers/roomsControllers");

router.get("/", get);
router.post("/join", join);


module.exports = router;
