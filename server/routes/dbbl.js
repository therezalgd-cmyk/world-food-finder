const express = require('express');
const router = express.Router();

router.post('/transfer', (req,res) => {
  const { account, amount } = req.body;
  if(!account || !amount) return res.status(400).json({ success:false, error:'account & amount required' });
  return res.json({ success:true, transferId:'DBBL_'+Date.now(), status:'Simulated' });
});

module.exports = router;
