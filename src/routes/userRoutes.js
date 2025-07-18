const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM users';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by username
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM users WHERE username = ?';
  try {
    const [results] = await db.query(query, [customerId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save FCM token
router.post('/save-fcm-token', async (req, res) => {
  const { userId, fcmToken } = req.body;

  try {
    // Save or update token in database
    await db.query(
      `INSERT INTO fcm_tokens (user_id, token)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE token = ?`,
      [userId, fcmToken, fcmToken]
    );

    res.status(200).json({ message: 'FCM token saved' });
  } catch (error) {
    console.error('❌ Failed to save token:', error);
    res.status(500).json({ error: 'Failed to save token' });
  }
});

module.exports = router;