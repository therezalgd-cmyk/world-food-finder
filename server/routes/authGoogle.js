const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const OAuthAccount = require('../models/OAuthAccount.js');
const { encrypt } = require('../utils/cryptoUtil.js');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
    'profile',
    'email'
];

router.get('/google/start', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        
        const account = new OAuthAccount({
            tokens: tokens
        });
        await account.save();
        
        // ব্রাউজারকে জোরপূর্বক আপনার এক্সপো অ্যাপের পোর্টে রিডাইরেক্ট করার জন্য HTML স্ক্রিপ্ট
        res.send(`
            <script>
                window.location.href = "http://localhost:19006/?token=${tokens.access_token}";
            </script>
        `);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;