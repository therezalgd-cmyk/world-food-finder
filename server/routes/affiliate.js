const express = require('express');
const router = express.Router();

/*
Affiliate simulation routes:
GET /api/affiliate/links -> returns example affiliate links per partner
POST /api/affiliate/track -> { partner, clickId } -> simulate tracking
*/

router.get('/links', (req,res) => {
  res.json({
    success:true,
    data: {
      foodpanda: 'https://affiliate.foodpanda.example/?ref=your_ref',
      pathao: 'https://affiliate.pathao.example/?ref=your_ref',
      hungrynaki: 'https://affiliate.hungrynaki.example/?ref=your_ref'
    }
  });
});

router.post('/track', (req,res) => {
  const { partner, clickId } = req.body;
  // store to analytics (in production)
  res.json({ success:true, partner, clickId, recordedAt: Date.now() });
});

module.exports = router;
