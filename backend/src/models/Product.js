const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Resin Art', 'Portrait', 'String Art', 'Mandala Art', 'Candles', 'Rakhi', 'Other']
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    customizationType: {
        type: String,
        enum: ['photo', 'text', 'both', 'none'],
        default: 'none'
    },
    sizes: [{
        label: { type: String, required: true }, 
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        available: { type: Boolean, default: true }
    }],
    isReturnable: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating must can not be more than 5']
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
