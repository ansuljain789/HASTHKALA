const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getWishlist)
    .post(protect, addToWishlist);

router.route('/:productId').delete(protect, removeFromWishlist);

module.exports = router;
