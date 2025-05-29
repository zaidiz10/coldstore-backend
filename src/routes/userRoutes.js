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

module.exports = router;