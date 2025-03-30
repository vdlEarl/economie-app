const express = require("express");
const router = express.Router();
const db = require("../../database/database");

router.get("/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  const query = `
    SELECT * FROM messages 
    WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
    ORDER BY timestamp ASC
  `;

  db.all(query, [user1, user2, user2, user1], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { sender, receiver, content } = req.body;
  const userIdSession = parseInt(req.headers["user-id"], 10); // Vérification de la session utilisateur

  console.log(`📩 Nouvelle requête pour envoyer un message`);
  console.log(`👤 Expéditeur: ${sender}, 🎯 Destinataire: ${receiver}, 💬 Message: "${content}"`);
  console.log(`🔍 ID utilisateur de la session: ${userIdSession}`);

  if (!sender || !receiver || !content) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  // Vérifier que l'utilisateur connecté correspond bien à l'expéditeur
  if (userIdSession !== sender) {
    console.warn(`❌ Tentative d'envoi avec un sender non valide : ${sender}`);
    return res.status(403).json({ error: "Accès refusé. L'expéditeur ne correspond pas à la session." });
  }

  const query = `INSERT INTO messages (sender, receiver, content) VALUES (?, ?, ?)`;

  db.run(query, [sender, receiver, content], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Message inséré avec ID : ${this.lastID}`);

    res.status(201).json({
      id: this.lastID,
      sender,
      receiver,
      content,
      timestamp: new Date(),
    });
  });
});

module.exports = router;
