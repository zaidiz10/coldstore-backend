const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all shops
router.get('/', (req, res) => {
  const query = 'SELECT * FROM shops';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get baramad by username
router.get('/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM shops WHERE susername = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;