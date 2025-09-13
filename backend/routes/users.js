const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get all users with pagination and filters
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, plan } = req.query;
    
    // Mock data - replace with actual database queries
    const users = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 9876543210',
        plan: 'Gold',
        status: 'Active',
        joinDate: '2024-01-15',
        totalEarnings: 15640,
        level: 5,
        referrals: 12
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 8765432109',
        plan: 'Silver',
        status: 'Active',
        joinDate: '2024-02-10',
        totalEarnings: 12850,
        level: 4,
        referrals: 8
      }
    ];
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 10,
        totalUsers: 200,
        hasNext: true,
        hasPrev: false
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = {
      id: userId,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      plan: 'Gold',
      status: 'Active',
      joinDate: '2024-01-15',
      totalEarnings: 15640,
      level: 5,
      referrals: 12,
      kyc: {
        status: 'Approved',
        documentType: 'Aadhaar',
        documentNumber: 'XXXX-XXXX-1234'
      },
      wallet: {
        balance: 5400,
        totalDeposits: 25000,
        totalWithdrawals: 19600
      }
    };
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Unblock user
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;
    
    // Update user status in database
    
    res.json({ 
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      userId,
      newStatus: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;