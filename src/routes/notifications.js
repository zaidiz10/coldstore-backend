const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = require('../config/db'); // your MySQL connection

router.post('/send-notification', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  try {
    const [rows] = await db.query('SELECT token FROM fcm_tokens');
    const tokens = rows.map(row => row.token);

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'No FCM tokens found in DB' });
    }

    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('📤 Notifications sent:', response.successCount);

    // 🧹 Remove dead tokens
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.warn(`⚠️ Failed token: ${tokens[idx]}`, resp.error?.message);
        failedTokens.push(tokens[idx]);
      }
    });

    if (failedTokens.length > 0) {
      const deleteQuery = `DELETE FROM fcm_tokens WHERE token IN (${failedTokens.map(() => '?').join(',')})`;
      await db.query(deleteQuery, failedTokens);
      console.log(`🧹 Removed ${failedTokens.length} invalid tokens`);
    }

    res.status(200).json({
      message: `Sent to ${response.successCount} devices.`,
      errors: response.failureCount,
    });

  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
