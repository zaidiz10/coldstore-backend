const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all baramad
router.get('/', (req, res) => {
  const query = 'SELECT * FROM baramad';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get baramad by customer ID
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM baramad WHERE bCustomer_id = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;