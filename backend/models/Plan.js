const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Base', 'Silver', 'Gold', 'Diamond']
  },
  joinFee: {
    type: Number,
    required: true
  },
  dailyInvestment: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 365
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  profitPercentage: {
    type: Number,
    default: 10
  },
  referralBonus: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);