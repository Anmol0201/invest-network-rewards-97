const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get withdrawal requests
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, period, page = 1, limit = 20 } = req.query;
    
    const withdrawals = [
      {
        id: 1,
        userId: 101,
        userName: 'Rajesh Kumar',
        amount: 5000,
        status: 'pending',
        requestDate: '2024-01-15T10:30:00Z',
        bankDetails: {
          accountNumber: '****1234',
          ifsc: 'SBIN0001234',
          bankName: 'State Bank of India'
        }
      },
      {
        id: 2,
        userId: 102,
        userName: 'Priya Sharma',
        amount: 3000,
        status: 'approved',
        requestDate: '2024-01-14T14:20:00Z',
        processedDate: '2024-01-15T09:15:00Z',
        bankDetails: {
          accountNumber: '****5678',
          ifsc: 'HDFC0001234',
          bankName: 'HDFC Bank'
        }
      }
    ];
    
    res.json({
      withdrawals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 5,
        totalWithdrawals: 100,
        hasNext: true,
        hasPrev: false
      },
      summary: {
        pending: 15,
        approved: 45,
        rejected: 5,
        totalAmount: 245000
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve withdrawal
router.patch('/:id/approve', adminAuth, async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const { remarks } = req.body;
    
    res.json({ 
      message: 'Withdrawal approved successfully',
      withdrawalId,
      status: 'approved',
      processedAt: new Date().toISOString(),
      remarks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject withdrawal
router.patch('/:id/reject', adminAuth, async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }
    
    res.json({ 
      message: 'Withdrawal rejected successfully',
      withdrawalId,
      status: 'rejected',
      processedAt: new Date().toISOString(),
      reason
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;