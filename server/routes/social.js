const express = require('express');
const router = express.Router();

router.post('/share', (req,res)=> {
  const { platform, text, url } = req.body;
  // create share link client side usually; server can create prefilled messages
  let shareLink = null;
  switch(platform){
    case 'whatsapp': shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
    case 'facebook': shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
    case 'twitter': shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
    default: shareLink = url;
  }
  res.json({ success:true, shareLink });
});

module.exports = router;
