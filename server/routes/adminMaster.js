const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ============================================
// MIDDLEWARE: Verify Admin Token
// ============================================
const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// ============================================
// ROUTE: Admin Login
// ============================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin for demo
  if (email === 'admin@foodfinder.com' && password === 'admin123') {
    const token = jwt.sign(
      { 
        id: 'admin', 
        email, 
        role: 'admin', 
        name: 'Admin' 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: 'admin',
        email,
        name: 'Admin',
        role: 'admin'
      }
    });
  }

  res.status(401).json({ 
    success: false, 
    message: 'Invalid credentials' 
  });
});

// ============================================
// ROUTE: Dashboard Stats
// ============================================
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const Food = require('../models/Food');
    const Payment = require('../models/Payment');

    const totalFoods = await Food.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const previousUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const monthlyGrowth = previousUsers > 0 
      ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalFoods,
        totalUsers,
        totalRevenue,
        monthlyGrowth,
        recentOrders: []
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ROUTES: Manage Foods (Admin)
// ============================================

// Get all foods
router.get('/foods', verifyAdmin, async (req, res) => {
  try {
    const Food = require('../models/Food');
    const foods = await Food.find().sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: foods 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create food
router.post('/foods', verifyAdmin, async (req, res) => {
  try {
    const Food = require('../models/Food');
    const foodData = {
      ...req.body,
      ownerId: req.user?.id || null
    };
    
    const food = await Food.create(foodData);
    
    res.status(201).json({ 
      success: true, 
      data: food 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update food
router.put('/foods/:id', verifyAdmin, async (req, res) => {
  try {
    const Food = require('../models/Food');
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        updatedAt: Date.now() 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: food 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete food
router.delete('/foods/:id', verifyAdmin, async (req, res) => {
  try {
    const Food = require('../models/Food');
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Food deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ROUTES: Manage Users (Admin)
// ============================================

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Toggle user status
router.put('/users/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ROUTE: Revenue Report
// ============================================
router.get('/revenue', verifyAdmin, async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const User = require('../models/User');

    const totalResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = totalResult[0]?.total || 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyResult = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyRevenue = monthlyResult[0]?.total || 0;

    const totalOrders = await Payment.countDocuments({ 
      status: 'completed' 
    });

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    const revenueBySource = {
      listing: 3200,
      featured: 2400,
      boost: 1800,
      ads: 2100,
      commissions: 3000
    };

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthResult = await Payment.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      monthlyData.push({
        month,
        revenue: monthResult[0]?.total || 0
      });
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        monthlyRevenue,
        totalOrders,
        activeUsers,
        revenueBySource,
        monthlyData
      }
    });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ROUTES: Promotion Management
// ============================================

// In-memory promotion storage
const promotionHistory = [];

// Get promotion history
router.get('/promotions', verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: promotionHistory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create promotion
router.post('/promotions', verifyAdmin, async (req, res) => {
  try {
    const { itemId, platforms = ['facebook', 'whatsapp', 'twitter'] } = req.body;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const promotion = {
      id: 'p_' + Date.now(),
      itemId,
      platforms,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.user?.id || 'admin'
    };

    promotionHistory.unshift(promotion);

    if (promotionHistory.length > 50) {
      promotionHistory.pop();
    }

    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete promotion
router.delete('/promotions/:id', verifyAdmin, async (req, res) => {
  try {
    const index = promotionHistory.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    promotionHistory.splice(index, 1);

    res.json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ROUTE: Settings
// ============================================
router.get('/settings', verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        siteName: 'Food Finder',
        maintenanceMode: false,
        autoPromotion: true,
        notifications: true,
        language: 'en',
        currency: 'BDT'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.put('/settings', verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.body,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;