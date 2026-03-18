const express = require('express');
const router = express.Router();
const {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/new').post(protect, newOrder);
router.route('/me').get(protect, myOrders);
router.route('/:id').get(protect, getSingleOrder);

router.route('/admin/orders').get(protect, authorize('admin'), allOrders);
router.route('/admin/order/:id')
    .put(protect, authorize('admin'), updateOrder)
    .delete(protect, authorize('admin'), deleteOrder);

module.exports = router;
