const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Get all content (news, ads, marketing)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const content = [
      {
        id: 1,
        type: 'news',
        title: 'New Investment Plans Launched',
        content: 'Exciting new investment opportunities with higher returns...',
        status: 'published',
        author: 'Admin',
        publishDate: '2024-01-15',
        views: 1250
      },
      {
        id: 2,
        type: 'advertisement',
        title: 'Referral Bonus Campaign',
        content: 'Earn extra rewards by referring friends...',
        status: 'active',
        startDate: '2024-01-10',
        endDate: '2024-02-10',
        clicks: 456
      },
      {
        id: 3,
        type: 'marketing',
        title: 'Special Offer - Limited Time',
        content: 'Get 20% bonus on your first investment...',
        status: 'scheduled',
        scheduledDate: '2024-01-20',
        targetAudience: 'new_users'
      }
    ];
    
    res.json({
      content,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 3,
        totalItems: 50
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new content
router.post('/', adminAuth, async (req, res) => {
  try {
    const { type, title, content, status, scheduledDate, targetAudience } = req.body;
    
    if (!type || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newContent = {
      id: Date.now(),
      type,
      title,
      content,
      status: status || 'draft',
      author: req.user.userId,
      createdAt: new Date().toISOString(),
      scheduledDate,
      targetAudience
    };
    
    res.status(201).json({ 
      message: 'Content created successfully',
      content: newContent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update content
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const contentId = req.params.id;
    const updates = req.body;
    
    res.json({ 
      message: 'Content updated successfully',
      contentId,
      updates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete content
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const contentId = req.params.id;
    
    res.json({ 
      message: 'Content deleted successfully',
      contentId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish/unpublish content
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const contentId = req.params.id;
    const { status } = req.body;
    
    res.json({ 
      message: `Content ${status} successfully`,
      contentId,
      newStatus: status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;