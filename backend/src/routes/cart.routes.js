const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeCartItem } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart);

router.route('/:itemId')
    .delete(protect, removeCartItem);

module.exports = router;
