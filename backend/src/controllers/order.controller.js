const Order = require('../models/Order');
const Product = require('../models/Product');




exports.newOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderNotes
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, error: 'No order items' });
        }

        
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, error: `Product not found: ${item.name}` });
            }
            const sizeObj = product.sizes.find(s => s.label === item.size);
            if (!sizeObj) {
                return res.status(400).json({ success: false, error: `Invalid size for product: ${item.name}` });
            }
            if (sizeObj.stock < item.quantity) {
                return res.status(400).json({ success: false, error: `Insufficient stock for product: ${item.name}` });
            }

            
            sizeObj.stock -= item.quantity;
            
            if (sizeObj.stock <= 0) {
                sizeObj.available = false;
            }
            await product.save({ validateBeforeSave: false });
        }

        const order = await Order.create({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderNotes,
            paidAt: Date.now(), 
            user: req.user._id,
            paymentStatus: 'pending' 
        });

        
        try {
            const sendNotification = require('../utils/notification');
            sendNotification('ORDER_PLACED', {
                email: req.user.email,
                phone: shippingAddress.phone,
                orderId: order._id,
                orderItems: orderItems,
                totalPrice: totalPrice,
                userName: req.user.name
            });

            // 2. Send email to Admin
            sendNotification('ADMIN_NEW_ORDER', {
                email: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
                customerEmail: req.user.email,
                phone: shippingAddress.phone,
                orderId: order._id,
                orderItems: orderItems,
                totalPrice: totalPrice,
                userName: req.user.name
            });
        } catch (error) {
            console.error('Notification failed', error);
        }

        res.status(201).json({
            success: true,
            order
        });
    } catch (err) {
        next(err);
    }
};




exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, error: 'No order found with this ID' });
        }

        
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to view this order' });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        next(err);
    }
};




exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('orderItems.product', 'name images').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        next(err);
    }
};

exports.adminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').populate('orderItems.product', 'name images').sort({ createdAt: -1 });
        let totalAmount = 0;
        orders.forEach(order => totalAmount += order.totalPrice);
        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (err) {
        next(err);
    }
};




exports.allOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (err) {
        next(err);
    }
};




exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'No order found with this ID' });
        }

        if (order.orderStatus === 'Completed') {
            return res.status(400).json({ success: false, error: 'You have already delivered this order' });
        }

        order.orderStatus = req.body.status;

        if (req.body.status === 'Completed') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        next(err);
    }
};




exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'No order found with this ID' });
        }

        await order.remove();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        next(err);
    }
};
