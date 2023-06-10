var multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');
var fs = require('fs');

var dir = './uploads';
var upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, './uploads');
        },
        filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

    }),

    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(/*res.end('Only images are allowed')*/ null, false)
        }
        callback(null, true)
    }
});

export { upload };