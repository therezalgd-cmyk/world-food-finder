const express = require('express');
const router = express.Router();
const { calculateRestaurantRevenue } = require('./services/revenueService');

// For demo, use foods DB (same as foods.js) via require is avoided; we will accept POST input
router.post('/calculate', (req,res) => {
  const data = req.body; // expected { listing, featured, boost, adClicks }
  const result = calculateRestaurantRevenue(data || {});
  res.json({ success:true, data: result });
});

module.exports = router;
