const express = require('express');
const router = express.Router();

/*
Promotion endpoints:
POST /api/promotion/auto -> { itemId } -> schedule or generate post links
GET  /api/promotion/history -> returns simulated history
*/

const history = [];

router.post('/auto', (req,res) => {
  const { itemId } = req.body;
  if(!itemId) return res.status(400).json({ success:false, error:'itemId required' });
  const record = { id: 'p_' + Date.now(), itemId, platforms:['facebook','whatsapp'], createdAt: Date.now() };
  history.push(record);
  res.json({ success:true, record });
});

router.get('/history', (req,res) => res.json({ success:true, data: history }));

module.exports = router;
