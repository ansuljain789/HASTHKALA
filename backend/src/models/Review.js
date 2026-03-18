const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    reviewerName: {
        type: String,
        required: function() { return !this.user; }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });


// Create a sparse unique index so null users don't trigger duplicate key errors for the same product

module.exports = mongoose.model('Review', reviewSchema);
