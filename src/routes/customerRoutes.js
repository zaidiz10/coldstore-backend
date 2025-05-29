const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all customer
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM customer';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customer by shopID
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM customer WHERE cIdShop = ?';
  try {
    const [results] = await db.query(query, [customerId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;