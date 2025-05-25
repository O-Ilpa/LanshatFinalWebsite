import express from 'express';
import verifyMiddleWare, { verifyAdmin } from './verifyMiddleWare.js';
import User from '../models/User.js';
import QuoteRequest from '../models/QuoteRequest.js';
import Machine from '../models/machines.js';
import EgyptMaterial from '../models/egyptMaterial.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', verifyMiddleWare, verifyAdmin, async (req, res) => {
  console.log("[ADMIN /stats] req.user:", req.user);
  try {
    const totalUsers = await User.countDocuments();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentSignups = await User.countDocuments({ createdAt: { $gte: last30Days } });
    const totalQuoteRequests = await QuoteRequest.countDocuments();
    const totalMachines = await Machine.countDocuments();
    const totalMaterials = await EgyptMaterial.countDocuments();
    res.json({
      success: true,
      data: {
        totalUsers,
        recentSignups,
        totalQuoteRequests,
        totalProducts: totalMachines + totalMaterials,
        totalMachines,
        totalMaterials
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/recent-activity
router.get('/recent-activity', verifyMiddleWare, verifyAdmin, async (req, res) => {
  console.log("[ADMIN /recent-activity] req.user:", req.user);
  try {
    const recentUsers = await User.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email companyName phone createdAt');
    const recentQuotes = await QuoteRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email company message items createdAt');
    res.json({
      success: true,
      data: {
        recentUsers,
        recentQuotes
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/chart-data
router.get('/chart-data', verifyMiddleWare, verifyAdmin, async (req, res) => {
  console.log("[ADMIN /chart-data] req.user:", req.user);
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29); // 30 days including today

    // Helper to get YYYY-MM-DD string
    const formatDate = (date) => date.toISOString().slice(0, 10);

    // Initialize date map
    const dateMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dateMap[formatDate(d)] = { signups: 0, quoteRequests: 0 };
    }

    // Get signups
    const users = await User.find({ createdAt: { $gte: startDate } }).select('createdAt');
    users.forEach(u => {
      const d = formatDate(u.createdAt);
      if (dateMap[d]) dateMap[d].signups++;
    });

    // Get quote requests
    const quotes = await QuoteRequest.find({ createdAt: { $gte: startDate } }).select('createdAt');
    quotes.forEach(q => {
      const d = formatDate(q.createdAt);
      if (dateMap[d]) dateMap[d].quoteRequests++;
    });

    // Prepare arrays for charting
    const labels = Object.keys(dateMap);
    const signups = labels.map(d => dateMap[d].signups);
    const quoteRequests = labels.map(d => dateMap[d].quoteRequests);

    res.json({
      success: true,
      data: {
        labels,
        signups,
        quoteRequests
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 