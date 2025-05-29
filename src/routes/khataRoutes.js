const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all khata
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM khata';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get khata by customer ID
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM khata WHERE kCustomer_id = ?';
  try {
    const [results] = await db.query(query, [customerId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;