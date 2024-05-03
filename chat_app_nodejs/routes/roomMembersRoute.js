const express = require('express');
const router = express.Router();
const {page, add, deletes, transfer} = require("../controllers/roomMembersController");


router.get('/page', page);
router.post('/add', add);
router.delete('/delete', deletes);
router.post('/transfer', transfer);
module.exports = router;
