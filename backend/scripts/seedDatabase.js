const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Content = require('../models/Content');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luminaflow_admin');
    console.log('🍃 Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Content.deleteMany({});
    
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@luminaflow.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    console.log('👤 Admin user created');

    // Create investment plans
    const plans = [
      {
        name: 'Base',
        joinFee: 1499,
        dailyInvestment: 25,
        duration: 365,
        features: ['Basic Support', 'Daily Earnings', 'Referral Bonus'],
        profitPercentage: 8,
        referralBonus: 3
      },
      {
        name: 'Silver',
        joinFee: 1799,
        dailyInvestment: 50,
        duration: 365,
        features: ['Priority Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus'],
        profitPercentage: 10,
        referralBonus: 5
      },
      {
        name: 'Gold',
        joinFee: 2499,
        dailyInvestment: 100,
        duration: 365,
        features: ['VIP Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus', 'Monthly Bonus'],
        profitPercentage: 12,
        referralBonus: 7
      },
      {
        name: 'Diamond',
        joinFee: 4999,
        dailyInvestment: 200,
        duration: 365,
        features: ['Premium Support', 'Daily Earnings', 'Referral Bonus', 'All Bonuses', 'VIP Events'],
        profitPercentage: 15,
        referralBonus: 10
      }
    ];

    await Plan.insertMany(plans);
    console.log('💎 Investment plans created');

    // Create sample content
    const sampleContent = [
      {
        type: 'news',
        title: 'Welcome to LuminaFlow Admin Dashboard',
        content: 'Your comprehensive investment management platform is now live!',
        status: 'published',
        author: admin._id,
        publishDate: new Date(),
        targetAudience: 'all',
        priority: 1
      },
      {
        type: 'announcement',
        title: 'New Features Released',
        content: 'Check out our latest dashboard improvements and analytics tools.',
        status: 'published',
        author: admin._id,
        publishDate: new Date(),
        targetAudience: 'all',
        priority: 2
      }
    ];

    await Content.insertMany(sampleContent);
    console.log('📄 Sample content created');

    // Create sample users
    const sampleUsers = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash('User@123', 10);
      sampleUsers.push({
        name: `Test User ${i}`,
        email: `user${i}@example.com`,
        phone: `987654321${i}`,
        password: hashedPassword,
        role: 'user',
        status: 'active',
        plan: ['Base', 'Silver', 'Gold', 'Diamond'][Math.floor(Math.random() * 4)],
        level: Math.floor(Math.random() * 5) + 1,
        wallet: {
          balance: Math.floor(Math.random() * 10000) + 1000,
          totalDeposits: Math.floor(Math.random() * 50000) + 5000,
          totalWithdrawals: Math.floor(Math.random() * 20000) + 2000,
          totalEarnings: Math.floor(Math.random() * 15000) + 3000
        }
      });
    }

    await User.insertMany(sampleUsers);
    console.log('👥 Sample users created');

    console.log('✅ Database seeded successfully!');
    console.log(`📧 Admin Login: admin@luminaflow.com`);
    console.log(`🔐 Admin Password: Admin@123`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;