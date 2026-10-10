import express from 'express';
import { google } from 'googleapis';
import { upload } from '../middleware/upload.js';
import OAuthAccount from '../models/OAuthAccount.js';
import { decrypt } from '../utils/cryptoUtil.js';

const router = express.Router();

router.post('/youtube', upload.single('file'), async (req, res) => {
  try {
    // 1) find oauth account for user
    const acc = await OAuthAccount.findOne({ provider: 'google' });
    if (!acc) return res.status(400).json({ error: 'Google account not linked' });

    const tokens = {
      access_token: decrypt(acc.accessToken),
      refresh_token: decrypt(acc.refreshToken)
    };

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // stream upload
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: { title: req.body.title || 'Upload', description: req.body.description || '' },
        status: { privacyStatus: 'private' }
      },
      media: { body: bufferStream }
    }, { maxBodyLength: Infinity, maxContentLength: Infinity });

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
