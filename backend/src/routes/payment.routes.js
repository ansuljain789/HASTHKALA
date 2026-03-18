const express = require('express');
const router = express.Router();
const { checkout, paymentVerification, getRazorpayKey } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/key').get(protect, getRazorpayKey);
router.route('/checkout').post(protect, checkout);
router.route('/verify').post(protect, paymentVerification);

module.exports = router;
