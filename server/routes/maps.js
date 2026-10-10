const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

/*
GET /api/maps/geocode?q=address
Uses Nominatim (OSM) - no API key required.
Rate-limit note: respect usage policy in production.
*/
router.get('/geocode', async (req,res) => {
  const q = req.query.q;
  if(!q) return res.status(400).json({ success:false, error:'q required' });
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const r = await fetch(url, { headers:{ 'User-Agent': 'WorldFoodFinder/1.0 (contact@example.com)' }});
    const j = await r.json();
    return res.json({ success:true, data: j[0] || null });
  } catch(err){
    return res.status(500).json({ success:false, error: err.message });
  }
});

module.exports = router;
