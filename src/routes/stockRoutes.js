const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all stocks
router.get('/', (req, res) => {
  const query = 'SELECT * FROM stock';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get stock by customer ID (existing)
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM stock WHERE sCustomer_id = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get stock summary by customer ID (NEW, matches Java logic)
router.get('/summary/:customerId', (req, res) => {
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

  db.query(query1, [customerId, customerId], (err1, rashanResults) => {
    if (err1) {
      return res.status(500).json({ error: err1.message });
    }

    db.query(query2, [customerId, customerId], (err2, beejResults) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

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
    });
  });
});

module.exports = router;
