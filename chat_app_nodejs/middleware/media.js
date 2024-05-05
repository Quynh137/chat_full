const multer = require('multer')

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    },
});
const media = multer({
    storage: storage,
    limits: {
        //giới hạn 10MB
        fileSize: 1*1024*1024,
    }
})

module.exports = media;