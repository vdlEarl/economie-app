const express = require("express");
const router = express.Router();
const db = require("../../database/database");

// Création d'un utilisateur
router.post("/", (req, res) => {
  const { username, mdp, humeur } = req.body;

  if (!username || !mdp) {
    return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont obligatoires" });
  }

  const query = `INSERT INTO users (username, mdp, humeur) VALUES (?, ?, ?)`;

  db.run(query, [username, mdp, humeur || 2], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, username, humeur: humeur || 2 });
  });
});

// Récupérer tous les utilisateurs
router.get("/", (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Récupérer l'humeur d'un utilisateur
router.get("/humeur/:id", (req, res) => {
  const userId = req.params.id;
  db.get("SELECT humeur FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (!row) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ humeur: row.humeur });
  });
});

// Mettre à jour l'humeur
router.post("/humeur", (req, res) => {
  const { userId, humeur } = req.body;

  if (!userId || humeur === undefined) {
    return res.status(400).json({ error: "userId et humeur sont requis" });
  }

  db.run("UPDATE users SET humeur = ? WHERE id = ?", [humeur, userId], function (err) {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (this.changes === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ success: true, message: "Humeur mise à jour" });
  });
});

// Récupérer la disponibilité
router.get("/disponibilite/:id", (req, res) => {
  const userId = req.params.id;

  db.get("SELECT disponibilite FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (!row) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ disponibilite: row.disponibilite });
  });
});

// Mettre à jour la disponibilité
router.post("/disponibilite", (req, res) => {
  const { userId, disponibilite } = req.body;

  if (!userId || !["vert", "jaune", "rouge"].includes(disponibilite)) {
    return res.status(400).json({ error: "userId et disponibilite valide sont requis" });
  }

  db.run("UPDATE users SET disponibilite = ? WHERE id = ?", [disponibilite, userId], function (err) {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (this.changes === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ success: true, message: "Disponibilité mise à jour" });
  });
});

// Récupérer la note
router.get("/note/:id", (req, res) => {
  const userId = req.params.id;

  db.get("SELECT note FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (!row) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ note: row.note });
  });
});

// Mettre à jour la note
router.post("/note", (req, res) => {
  const { userId, note } = req.body;

  if (!userId || typeof note !== "string") {
    return res.status(400).json({ error: "userId et note sont requis" });
  }

  db.run("UPDATE users SET note = ? WHERE id = ?", [note, userId], function (err) {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });
    if (this.changes === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ success: true, message: "Note mise à jour" });
  });
});

module.exports = router;

