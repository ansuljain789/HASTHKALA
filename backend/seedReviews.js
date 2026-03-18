const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const Review = require('./src/models/Review');

dotenv.config({ path: './.env' });

const indianNames = [
    "Aarav", "Neha", "Vihaan", "Aditi", "Vivaan", "Riya", "Ananya", "Diya", 
    "Ishaan", "Sai", "Arjun", "Kavya", "Saanvi", "Kabir", "Aanya", "Pooja", 
    "Rahul", "Rohan", "Maya", "Priya", "Karan", "Simran", "Raj", "Sameer",
    "Sneha", "Vikram", "Tara", "Amit", "Suresh", "Ramesh", "Sunita", "Anita"
];

const positiveComments = [
    "Absolutely love the craftsmanship! The quality is top-notch.",
    "Such a beautiful piece. It definitely added elegance to my home.",
    "Highly recommended! The details are stunning.",
    "Worth every penny. The delivery was fast and the product was securely packed.",
    "Very satisfied with my purchase. Looks exactly like the pictures.",
    "Exceeded my expectations! It's clear that a lot of effort went into making this.",
    "Good quality, nice design. Will buy again.",
    "A perfect gift! My friend absolutely loved it.",
    "Great customer service and a fantastic product.",
    "The colors are so vibrant and the finish is perfect.",
    "Amazing work! I'm already planning my next purchase.",
    "Very unique and elegant design. Beautifully handcrafted."
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to Database. Starting Review Seeding...');

        // 1. Fetch all products
        const products = await Product.find();
        console.log(`Found ${products.length} products to seed.`);

        let totalReviewsAdded = 0;

        for (const product of products) {
            // Count existing reviews
            const existingReviewsCount = await Review.countDocuments({ product: product._id });
            
            // We want at least 5 reviews. If there are fewer, add the difference.
            const neededReviews = Math.max(0, 5 - existingReviewsCount);

            if (neededReviews > 0) {
                console.log(`Adding ${neededReviews} reviews to product: ${product.name}`);
                
                const reviewsToAdd = [];
                let newRatingSum = product.averageRating * existingReviewsCount; // retain old sum

                for (let i = 0; i < neededReviews; i++) {
                    const rating = Math.random() > 0.3 ? 5 : 4; // 70% 5-star, 30% 4-star
                    const reviewerName = getRandomItem(indianNames) + ' ' + getRandomItem(['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Jain', 'Reddy']);
                    const comment = getRandomItem(positiveComments);
                    
                    reviewsToAdd.push({
                        product: product._id,
                        reviewerName,
                        rating,
                        comment
                    });

                    newRatingSum += rating;
                }

                // Insert the seeded reviews
                await Review.insertMany(reviewsToAdd);
                totalReviewsAdded += reviewsToAdd.length;

                // Update product rating and numReviews
                const totalNumReviews = existingReviewsCount + reviewsToAdd.length;
                const newAvgRating = newRatingSum / totalNumReviews;

                product.averageRating = newAvgRating;
                product.numReviews = totalNumReviews;
                await product.save({ validateBeforeSave: false });
            } else {
                console.log(`Product: ${product.name} already has ${existingReviewsCount} reviews. Skipping.`);
            }
        }

        console.log(`\nReview Seeding Complete! Added ${totalReviewsAdded} total new reviews.`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding reviews:', error);
        process.exit(1);
    }
};

seedReviews();
