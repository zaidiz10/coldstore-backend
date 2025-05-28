const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all users
router.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get user by username
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;