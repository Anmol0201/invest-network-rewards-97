const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get earnings analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const analytics = {
      todayProfit: 12450,
      weekProfit: 78320,
      monthProfit: 284560,
      activeEarners: 1856,
      earningsData: [
        { date: '2024-01', totalEarnings: 45000, userEarnings: 38000, adminProfit: 7000 },
        { date: '2024-02', totalEarnings: 52000, userEarnings: 44000, adminProfit: 8000 },
        { date: '2024-03', totalEarnings: 48000, userEarnings: 40000, adminProfit: 8000 },
        { date: '2024-04', totalEarnings: 61000, userEarnings: 51000, adminProfit: 10000 },
        { date: '2024-05', totalEarnings: 55000, userEarnings: 46000, adminProfit: 9000 },
        { date: '2024-06', totalEarnings: 67000, userEarnings: 56000, adminProfit: 11000 }
      ]
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top earners
router.get('/top-earners', adminAuth, async (req, res) => {
  try {
    const topEarners = [
      { name: 'Rajesh Kumar', earnings: 15640, plan: 'Diamond', level: 'Level 5' },
      { name: 'Priya Sharma', earnings: 12850, plan: 'Gold', level: 'Level 4' },
      { name: 'Amit Singh', earnings: 11240, plan: 'Gold', level: 'Level 3' },
      { name: 'Sunita Devi', earnings: 9850, plan: 'Silver', level: 'Level 4' },
      { name: 'Vikash Yadav', earnings: 8750, plan: 'Silver', level: 'Level 3' }
    ];
    
    res.json(topEarners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get plan-wise earnings
router.get('/plan-wise', adminAuth, async (req, res) => {
  try {
    const planEarnings = [
      { plan: 'Base', earnings: 145000, color: '#FED7AA' },
      { plan: 'Silver', earnings: 285000, color: '#F97316' },
      { plan: 'Gold', earnings: 420000, color: '#EA580C' },
      { plan: 'Diamond', earnings: 180000, color: '#DC2626' }
    ];
    
    res.json(planEarnings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;