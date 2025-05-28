const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all customer
router.get('/', (req, res) => {
  const query = 'SELECT * FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get customer by shopID
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM customer WHERE cIdShop = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;