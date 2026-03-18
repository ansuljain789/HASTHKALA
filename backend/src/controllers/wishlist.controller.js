const Wishlist = require('../models/Wishlist');




exports.getWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products', 'name images price');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                products: []
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });
    } catch (err) {
        next(err);
    }
};




exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                products: [productId]
            });
        } else {
            
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        res.status(200).json({
            success: true,
            wishlist
        });
    } catch (err) {
        next(err);
    }
};




exports.removeFromWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
            await wishlist.save();
        }

        res.status(200).json({
            success: true,
            wishlist
        });
    } catch (err) {
        next(err);
    }
};
