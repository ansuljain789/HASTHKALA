const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');




exports.getDashboardStats = async (req, res, next) => {
    try {
        
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
        const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        
        
        const salesByCategory = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    name: { $first: '$productDetails.category' },
                    value: { $sum: 1 } 
                }
            }
        ]);

        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); 

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    orderStatus: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
            name: monthNames[item._id.month - 1],
            revenue: item.revenue
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalProducts,
                totalSales,
                totalUsers
            },
            recentOrders,
            salesByCategory: salesByCategory.length > 0 ? salesByCategory : [
                { name: 'Resin Art', value: 0 },
                { name: 'String Art', value: 0 },
                { name: 'Mandala Art', value: 0 },
                { name: 'Portrait', value: 0 }
            ], 
            monthlyRevenue: formattedMonthlyRevenue
        });
    } catch (err) {
        next(err);
    }
};
