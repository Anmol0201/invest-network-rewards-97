const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validateLogin, validateUser } = require('../utils/validation');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Check password
    const validPassword = await admin.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin user (initial setup)
router.post('/setup', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const adminData = {
      ...req.body,
      role: 'admin',
      status: 'active'
    };

    const admin = new User(adminData);
    await admin.save();

    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Change admin password
router.patch('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    // This would require auth middleware in a real implementation
    const adminId = req.user.userId; // From auth middleware
    const admin = await User.findById(adminId);

    const validPassword = await admin.comparePassword(currentPassword);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;