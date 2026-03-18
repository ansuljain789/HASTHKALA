const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});




exports.getRazorpayKey = (req, res, next) => {
    res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
};




exports.checkout = async (req, res, next) => {
    try {
        const { amount } = req.body; 

        if (!amount) {
            return res.status(400).json({ success: false, error: 'Please provide amount' });
        }

        const options = {
            amount: Number(amount) * 100, 
            currency: "INR",
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (err) {
        console.error('Razorpay Order Creation Error:', err);
        
        const errorMsg = err.error?.description || err.message || 'Failed to initialize payment gateway';
        res.status(500).json({ success: false, error: errorMsg });
    }
};




exports.paymentVerification = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            
            

            
            if (orderId) {
                const order = await Order.findById(orderId);
                if (order) {
                    order.paymentStatus = 'paid';
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: razorpay_payment_id,
                        status: 'paid',
                        update_time: Date.now(),
                        email_address: req.user.email
                    };
                    await order.save();
                }
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid signature'
            });
        }
    } catch (err) {
        next(err);
    }
};
