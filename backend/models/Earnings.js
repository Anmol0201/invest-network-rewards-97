const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily_investment', 'referral_bonus', 'level_bonus', 'special_bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  planName: String,
  level: Number,
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'credited', 'cancelled'],
    default: 'credited'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Earnings', earningsSchema);