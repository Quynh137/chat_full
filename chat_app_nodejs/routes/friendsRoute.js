const express = require('express');
const router = express.Router();
const {send, search, cancelRequest, acceptFriendRequest, unfriend} = require("../controllers/friendsController");

// [GET] /search
router.get("/search", search);

// [GET] /send
router.post("/send", send);

router.delete('/cancelRequest', cancelRequest);

router.put('/acceptFriendRequest', acceptFriendRequest);

router.delete('/unfriend', unfriend);



module.exports = router;
