const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all stocks
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM stock';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stock by customer ID (existing)
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM stock WHERE sCustomer_id = ?';
  try {
    const [results] = await db.query(query, [customerId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stock summary by customer ID (NEW, matches Java logic)
router.get('/summary/:customerId', async (req, res) => {
  const { customerId } = req.params;

  const query1 = `
    SELECT rashan, SUM(rashan_quantity) AS totalRashan_quantity
    FROM daramad
    WHERE dCustomer_id = ?
    GROUP BY rashan
    UNION ALL
    SELECT 'Total' AS rashan, SUM(rashan_quantity) AS totalRashan_quantity
    FROM daramad
    WHERE dCustomer_id = ?;
  `;

  const query2 = `
    SELECT beej, SUM(beej_quantity) AS totalBeej_quantity
    FROM daramad
    WHERE dCustomer_id = ? AND beej IS NOT NULL
    GROUP BY beej
    UNION ALL
    SELECT 'Total' AS beej, SUM(beej_quantity) AS totalBeej_quantity
    FROM daramad
    WHERE dCustomer_id = ? AND beej IS NOT NULL;
  `;

  try {
    const [rashanResults] = await db.query(query1, [customerId, customerId]);
    const [beejResults] = await db.query(query2, [customerId, customerId]);

    const stockMap = {};
    let totalRashanQuantity = 0;
    let totalBeejQuantity = 0;

    // Process rashan results
    rashanResults.forEach(row => {
      if (row.rashan === 'Total') {
        totalRashanQuantity = row.totalRashan_quantity || 0;
      } else {
        stockMap[row.rashan] = {
          name: row.rashan,
          rashanQuantity: row.totalRashan_quantity || 0,
          beejQuantity: 0
        };
      }
    });

    // Process beej results
    beejResults.forEach(row => {
      if (row.beej === 'Total') {
        totalBeejQuantity = row.totalBeej_quantity || 0;
      } else {
        if (!stockMap[row.beej]) {
          stockMap[row.beej] = {
            name: row.beej,
            rashanQuantity: 0,
            beejQuantity: row.totalBeej_quantity || 0
          };
        } else {
          stockMap[row.beej].beejQuantity = row.totalBeej_quantity || 0;
        }
      }
    });

    // Add totals
    stockMap['Total'] = {
      name: 'Total',
      rashanQuantity: totalRashanQuantity,
      beejQuantity: totalBeejQuantity
    };

    res.json(stockMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
