const Cart = require('../models/Cart');
const Product = require('../models/Product');




exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('cartItems.product', 'name images price');

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                cartItems: []
            });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (err) {
        next(err);
    }
};




exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, size, customization } = req.body; 

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        
        const selectedSize = product.sizes.find(s => s.label === size);
        if (!selectedSize) {
            return res.status(400).json({ success: false, error: 'Invalid size selected' });
        }

        
        if (selectedSize.stock < quantity) {
            return res.status(400).json({ success: false, error: 'Out of stock' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                cartItems: []
            });
        }

        
        
        
        
        
        

        
        

        const isCustomized = customization && (customization.image || customization.text || customization.note);

        if (!isCustomized) {
            const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId && p.size === size);

            if (itemIndex > -1) {
                let productItem = cart.cartItems[itemIndex];
                productItem.quantity += quantity;
                cart.cartItems[itemIndex] = productItem;
            } else {
                cart.cartItems.push({
                    product: productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: selectedSize.price,
                    quantity,
                    size,
                    customization: {}
                });
            }
        } else {
            
            cart.cartItems.push({
                product: productId,
                name: product.name,
                image: product.images[0].url,
                price: selectedSize.price,
                quantity,
                size,
                customization
            });
        }

        
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            cart
        });
    } catch (err) {
        next(err);
    }
};




exports.removeCartItem = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        cart.cartItems = cart.cartItems.filter(item => item._id.toString() !== req.params.itemId);

        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            cart
        });
    } catch (err) {
        next(err);
    }
};
