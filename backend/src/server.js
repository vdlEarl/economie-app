const express = require("express");
const db = require("../database/database"); // Import SQLite
const jwt = require("jsonwebtoken"); // 🔹
const cors = require('cors');

const app = express();
app.use(express.json()); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");
const calendrierRoutes = require('./routes/calendrier');

app.use("/messages", messageRoutes);
app.use("/users", userRoutes);
app.use("/", calendrierRoutes);
const allowedOrigin = 'https://economie-app-1.onrender.com';
app.use(cors({
  origin: allowedOrigin,
}));
const SECRET_KEY = "monsecret"; 

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ? AND mdp = ?", [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign({ id: user.id, email: user.username }, SECRET_KEY, { expiresIn: "24h" });

    res.json({ token, id: user.id });
  });
});

