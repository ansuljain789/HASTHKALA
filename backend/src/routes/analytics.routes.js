const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
