const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all customer_details
router.get('/', (req, res) => {
  const query = 'SELECT * FROM customer_details';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get customer_details by customer ID
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM customer_details WHERE customer_id = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;