const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get all staff members
router.get('/', adminAuth, async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    
    const staff = [
      {
        id: 1,
        name: 'Amit Kumar',
        email: 'amit@luminaflow.com',
        role: 'sales',
        status: 'active',
        joinDate: '2024-01-01',
        performance: {
          usersOnboarded: 45,
          revenue: 125000,
          target: 50,
          completionRate: 90
        }
      },
      {
        id: 2,
        name: 'Sneha Patel',
        email: 'sneha@luminaflow.com',
        role: 'support',
        status: 'active',
        joinDate: '2024-01-15',
        performance: {
          ticketsResolved: 234,
          avgResponseTime: '2.5 hours',
          satisfaction: 4.8,
          target: 250
        }
      },
      {
        id: 3,
        name: 'Rahul Singh',
        email: 'rahul@luminaflow.com',
        role: 'withdrawal_manager',
        status: 'active',
        joinDate: '2024-02-01',
        performance: {
          withdrawalsProcessed: 156,
          avgProcessingTime: '4 hours',
          accuracy: 99.2,
          target: 200
        }
      }
    ];
    
    res.json({
      staff,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 2,
        totalStaff: 25
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new staff member
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, role, permissions } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newStaff = {
      id: Date.now(),
      name,
      email,
      role,
      status: 'active',
      joinDate: new Date().toISOString(),
      permissions: permissions || [],
      performance: {
        usersOnboarded: 0,
        ticketsResolved: 0,
        withdrawalsProcessed: 0
      }
    };
    
    res.status(201).json({ 
      message: 'Staff member added successfully',
      staff: newStaff
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff member
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const staffId = req.params.id;
    const updates = req.body;
    
    res.json({ 
      message: 'Staff member updated successfully',
      staffId,
      updates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const staffId = req.params.id;
    const { status } = req.body;
    
    res.json({ 
      message: `Staff member ${status} successfully`,
      staffId,
      newStatus: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff performance
router.get('/:id/performance', adminAuth, async (req, res) => {
  try {
    const staffId = req.params.id;
    const { period = 'month' } = req.query;
    
    const performance = {
      staffId,
      period,
      metrics: {
        usersOnboarded: 45,
        revenue: 125000,
        ticketsResolved: 234,
        withdrawalsProcessed: 156,
        targetAchievement: 90,
        rating: 4.8
      },
      trend: [
        { date: '2024-01-01', value: 10 },
        { date: '2024-01-08', value: 15 },
        { date: '2024-01-15', value: 20 },
        { date: '2024-01-22', value: 45 }
      ]
    };
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;