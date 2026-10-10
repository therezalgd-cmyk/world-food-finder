const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/*
Endpoints:
POST /api/bkash/create   -> { amount } => returns paymentID, checkoutUrl (sandbox)
POST /api/bkash/verify   -> { paymentID } => returns status
*/

router.post('/create', (req,res) => {
  const { amount, merchantId } = req.body;
  if(!amount) return res.status(400).json({ success:false, error:'amount required' });
  const paymentID = 'BKASH_' + Date.now();
  // In sandbox simulate storing payment info; in prod you'd call bKash token & create payment
  const checkoutUrl = `https://tokenized.sandbox.bka.sh/checkout?paymentID=${paymentID}`;
  // For simulation, return token + url
  return res.json({ success:true, paymentID, checkoutUrl, amount });
});

router.post('/verify', (req,res) => {
  const { paymentID } = req.body;
  if(!paymentID) return res.status(400).json({ success:false, error:'paymentID required' });
  // Always success in sandbox simulation
  return res.json({ success:true, paymentID, status:'Completed' });
});

module.exports = router;
