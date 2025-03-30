const sqlite3 = require("sqlite3").verbose();

const path = require("path");

const dbPath = path.join(__dirname, "../database/db.db");

const db = new sqlite3.Database(dbPath, (err) => {

  if (err) {
    console.error("Erreur de connexion à SQLite:", err.message);
  } else {
    console.log("Connecté à SQLite");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      mdp TEXT NOT NULL,
      humeur INTEGER DEFAULT 2,
      disponibilite TEXT DEFAULT 'vert', -- Disponibilité : vert, jaune, rouge
      note TEXT DEFAULT ''              -- Note personnelle
    )`,
    (err) => {
      if (err) {
        console.error("Erreur création table 'users':", err.message);
      } else {
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender INTEGER NOT NULL,
      receiver INTEGER NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender) REFERENCES users(id),
      FOREIGN KEY (receiver) REFERENCES users(id)
    )`,
    (err) => {
      if (err) {
        console.error("Erreur création table 'messages':", err.message);
      } else {
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('expense', 'income')),
    date TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    description TEXT,
    store TEXT,
    expense_type TEXT CHECK(expense_type IN ('Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Vêtements', 'Abonnements', 'Autre')),
    recurring INTEGER NOT NULL DEFAULT 0 CHECK(recurring IN (0,1))
    )`,
    (err) => {
      if (err) {
        console.error("Erreur création table 'transaction':", err.message);
      } else {
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS savings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL
    )
    `,
    (err) => {
      if (err) {
        console.error("Erreur création table 'savings':", err.message);
      } else {
      }
    }
  );
});

module.exports = db;
