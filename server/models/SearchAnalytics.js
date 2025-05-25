import mongoose from 'mongoose';

const searchAnalyticsSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['suggestion', 'full_search'],
    default: 'suggestion'
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
searchAnalyticsSchema.index({ timestamp: -1 });
searchAnalyticsSchema.index({ query: 1, type: 1 });

const SearchAnalytics = mongoose.model('SearchAnalytics', searchAnalyticsSchema);

export default SearchAnalytics; 