const express = require('express');
const router = express.Router();

// in-memory store for demo
const analytics = { views: [], clicks: [] };

router.post('/view', (req,res) => {
  const { entityId, type } = req.body;
  analytics.views.push({ entityId, type, ts: Date.now() });
  res.json({ success:true });
});

router.post('/click', (req,res) => {
  const { entityId, type } = req.body;
  analytics.clicks.push({ entityId, type, ts: Date.now() });
  res.json({ success:true });
});

router.get('/summary', (req,res) => {
  res.json({ success:true, views: analytics.views.length, clicks: analytics.clicks.length });
});

module.exports = router;
