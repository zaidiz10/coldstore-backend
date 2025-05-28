const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all khata
router.get('/', (req, res) => {
  const query = 'SELECT * FROM khata';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get khata by customer ID
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM khata WHERE kCustomer_id = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;