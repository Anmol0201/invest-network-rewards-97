const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['news', 'advertisement', 'marketing', 'announcement'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishDate: Date,
  scheduledDate: Date,
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'active_users', 'premium_users']
  },
  imageUrl: String,
  priority: {
    type: Number,
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);