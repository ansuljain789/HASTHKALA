const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, validateCoupon } = require('../controllers/coupon.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, authorize('admin'), getAllCoupons)
    .post(protect, authorize('admin'), createCoupon);

router.route('/validate').post(protect, validateCoupon);

module.exports = router;
