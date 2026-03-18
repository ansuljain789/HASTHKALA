const Coupon = require('../models/Coupon');




exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            coupon
        });
    } catch (err) {
        next(err);
    }
};




exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();

        res.status(200).json({
            success: true,
            coupons
        });
    } catch (err) {
        next(err);
    }
};




exports.validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Invalid Coupon Code' });
        }

        if (coupon.expiryDate < Date.now()) {
            return res.status(400).json({ success: false, error: 'Coupon has expired' });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
        }

        res.status(200).json({
            success: true,
            coupon
        });
    } catch (err) {
        next(err);
    }
};
