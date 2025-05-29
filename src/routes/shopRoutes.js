const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all shops
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM shops';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get shop by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM shops WHERE susername = ?';
  try {
    const [results] = await db.query(query, [username]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;