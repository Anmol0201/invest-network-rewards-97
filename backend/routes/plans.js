const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get all plans
router.get('/', adminAuth, async (req, res) => {
  try {
    const plans = [
      {
        id: 1,
        name: 'Base',
        joinFee: 1499,
        dailyInvestment: 25,
        duration: 365,
        features: ['Basic Support', 'Daily Earnings', 'Referral Bonus'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        name: 'Silver',
        joinFee: 1799,
        dailyInvestment: 50,
        duration: 365,
        features: ['Priority Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: 3,
        name: 'Gold',
        joinFee: 2499,
        dailyInvestment: 100,
        duration: 365,
        features: ['VIP Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus', 'Monthly Bonus'],
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: 4,
        name: 'Diamond',
        joinFee: 4999,
        dailyInvestment: 200,
        duration: 365,
        features: ['Premium Support', 'Daily Earnings', 'Referral Bonus', 'All Bonuses', 'VIP Events'],
        isActive: true,
        createdAt: '2024-01-01'
      }
    ];
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new plan
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, joinFee, dailyInvestment, duration, features } = req.body;
    
    // Validation
    if (!name || !joinFee || !dailyInvestment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newPlan = {
      id: Date.now(),
      name,
      joinFee,
      dailyInvestment,
      duration: duration || 365,
      features: features || [],
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({ 
      message: 'Plan created successfully',
      plan: newPlan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update plan
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const planId = req.params.id;
    const updates = req.body;
    
    res.json({ 
      message: 'Plan updated successfully',
      planId,
      updates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete plan
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const planId = req.params.id;
    
    res.json({ 
      message: 'Plan deleted successfully',
      planId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;