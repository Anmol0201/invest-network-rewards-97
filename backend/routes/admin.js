const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

// Dashboard overview stats
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const stats = {
      totalUsers: 2484,
      monthlyRevenue: 67000,
      activeSubscriptions: 1892,
      pendingWithdrawals: 156,
      todayProfit: 12450,
      weekProfit: 78320,
      monthProfit: 284560,
      activeEarners: 1856
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revenue data for charts
router.get('/dashboard/revenue', adminAuth, async (req, res) => {
  try {
    const revenueData = [
      { month: 'Jan', revenue: 45000, withdrawals: 32000 },
      { month: 'Feb', revenue: 52000, withdrawals: 38000 },
      { month: 'Mar', revenue: 48000, withdrawals: 35000 },
      { month: 'Apr', revenue: 61000, withdrawals: 42000 },
      { month: 'May', revenue: 55000, withdrawals: 39000 },
      { month: 'Jun', revenue: 67000, withdrawals: 45000 }
    ];
    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recent activities
router.get('/dashboard/activities', adminAuth, async (req, res) => {
  try {
    const activities = [
      {
        type: 'user_registration',
        message: 'New user registered',
        details: 'user@example.com',
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        type: 'withdrawal_request',
        message: 'Withdrawal request',
        details: '₹5,000',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        type: 'new_subscription',
        message: 'New subscription',
        details: 'Gold Plan',
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      }
    ];
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;