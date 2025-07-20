// routes/fcmTokens.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Save a new token (or ignore if already exists)
router.post('/fcm-tokens', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  try {
    // Insert if not exists
    await db.query(
      `INSERT IGNORE INTO fcm_tokens (token) VALUES (?)`,
      [token]
    );
    res.status(200).json({ message: 'Token saved' });
  } catch (err) {
    console.error('Error saving token:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
