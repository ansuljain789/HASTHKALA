const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');


router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
