const express = require('express');
const router = express.Router();

/*
Subscription simulation:
POST /api/subscription/subscribe  -> { userId, plan } => returns success
GET  /api/subscription/plans      -> returns plans
*/

const PLANS = [
  { id:'basic', price:50, monthly:true, name:'Basic' },
  { id:'pro', price:100, monthly:true, name:'Pro' },
  { id:'premium', price:200, monthly:true, name:'Premium' }
];

router.get('/plans', (req,res) => res.json({ success:true, data: PLANS }));

router.post('/subscribe', (req,res) => {
  const { userId, plan } = req.body;
  if(!userId || !plan) return res.status(400).json({ success:false, error:'userId and plan required' });
  // simulate subscription record
  res.json({ success:true, userId, plan, subscribedAt: Date.now() });
});

module.exports = router;
