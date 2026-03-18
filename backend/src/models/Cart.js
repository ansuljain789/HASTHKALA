const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            size: {
                type: String, 
                required: true
            },
            customization: {
                image: { type: String }, 
                text: { type: String },
                note: { type: String }
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
