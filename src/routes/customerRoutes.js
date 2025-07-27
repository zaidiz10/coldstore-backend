const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST new customer
router.post('/', async (req, res) => {
  const { name, phone, company_name, address } = req.body;

  if (!phone || phone.length !== 11) {
    return res.status(400).json({ error: "Phone number must be exactly 11 digits." });
  }

  const query = 'INSERT INTO customer (name, phone, company_name, address) VALUES (?, ?, ?, ?)';

  try {
    const [result] = await db.query(query, [name, phone, company_name, address]);
    res.status(201).json({ message: 'Customer inserted', insertedId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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