const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            customization: {
                image: { type: String },
                text: { type: String },
                note: { type: String }
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'ONLINE'
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
        required: true
    },
    deliveredAt: {
        type: Date,
    },
    orderNotes: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
