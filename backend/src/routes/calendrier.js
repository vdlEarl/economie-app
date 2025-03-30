const express = require("express");
const router = express.Router();
const db = require("../../database/database");

// Récupérer toutes les transactions
router.get("/transactions", (req, res) => {
  const query = "SELECT * FROM transactions ORDER BY date DESC";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ transactions: rows });
  });
});

// Insérer une nouvelle transaction
router.post("/transactions", (req, res) => {
  const { type, date, amount, description, store, expense_type, recurring } = req.body;

  const query = `
    INSERT INTO transactions (type, date, amount, description, store, expense_type, recurring)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      type,
      date,
      amount,
      description || null,
      store || null,
      expense_type || null,
      recurring ? 1 : 0,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.get("/savings/latest", (req, res) => {
    db.get("SELECT * FROM savings ORDER BY id DESC LIMIT 1", [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
  
router.post("/savings", (req, res) => {
const { amount } = req.body;

db.run(
    "INSERT INTO savings (amount) VALUES (?)",
    [amount],
    function (err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, amount });
    }
);
});
  

module.exports = router;