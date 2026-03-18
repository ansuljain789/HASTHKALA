const multer = require('multer');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/', { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ 
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    storage,
    
    
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});


function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, GIF images allowed!'));
    }
}

module.exports = upload;
