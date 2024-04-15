const express = require("express");
const { create, page, upload, chats, unmessage, remove, forwardMessage } = require("../controllers/messagesController");
const media = require('../middleware/media');

const router = express.Router();

router.post("/upload", media.array('files[]'),upload);
router.post("/create", create);
router.get("/page", page);
router.get("/chats", chats);
router.delete("/unsend", unmessage);
router.delete("/delete", remove);
router.patch("/forward/:id", forwardMessage);
module.exports = router;
