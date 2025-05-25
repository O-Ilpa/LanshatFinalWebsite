import express from 'express';
import SearchAnalytics from '../models/SearchAnalytics.js';
const router = express.Router();

// Get popular searches
router.get('/popular', async (req, res) => {
  try {
    const popularSearches = await SearchAnalytics.aggregate([
      {
        $match: {
          type: 'full_search',
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          term: '$_id',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      searches: popularSearches
    });
  } catch (error) {
    console.error('Error getting popular searches:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting popular searches'
    });
  }
});

// Track search analytics
router.post('/analytics', async (req, res) => {
  try {
    const { query, timestamp, type, resultsCount } = req.body;
    
    const analytics = new SearchAnalytics({
      query,
      timestamp: timestamp || new Date(),
      type: type || 'suggestion',
      resultsCount
    });

    await analytics.save();

    res.json({
      success: true,
      message: 'Search analytics tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking search analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking search analytics'
    });
  }
});

export default router; 