const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "fatima",
  password: "root",
  database: "logements_etudiants"
});




app.get("/logements/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM logement WHERE id_logement = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});


app.post("/logements", (req, res) => {
  const { titre, adresse, ville, type, prix, image, description } = req.body;

  // ✅ Validation juste après extraction
  if (!titre || !ville || !prix) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  db.query(
    "INSERT INTO logement (titre, adresse, ville, type, prix, image, description, date_ajout) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
    [titre, adresse, ville, type, prix, image, description],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.status(500).json({ error: "Erreur SQL", details: err });
      }

      console.log("Résultat SQL :", result);

      res.json({
        id_logement: result.insertId,
        titre,
        adresse,
        ville,
        type,
        prix,
        image,
        description,
        date_ajout: new Date().toISOString().split("T")[0],
      });
    }
  );
});


app.delete("/logements/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM logement WHERE id_logement = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Logement supprimé avec succès" });
  });
});
app.put("/logements/:id", (req, res) => {
  const id = req.params.id;
  const { titre, adresse, ville, type, prix, image, description } = req.body;
  db.query(
    "UPDATE logement SET titre = ?, adresse = ?, ville = ?, type = ?, prix = ?, image = ?, description = ? WHERE id_logement = ?",
    [titre, adresse, ville, type, prix, image, description, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Logement mis à jour avec succès" });
    }
  );
});
app.get("/logements/recherche", (req, res) => {
  const { ville, type } = req.query;
  db.query(
    "SELECT * FROM logement WHERE ville LIKE ? AND type LIKE ?",
    [`%${ville}%`, `%${type}%`],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});
app.get("/logements/filtre", (req, res) => {
  const { ville, type, minPrix, maxPrix } = req.query;
  db.query(
    "SELECT * FROM logement WHERE ville LIKE ? AND type LIKE ? AND prix BETWEEN ? AND ?",
    [`%${ville}%`, `%${type}%`, minPrix || 0, maxPrix || 9999],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/logements", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  // insérer imagePath dans la base
});
app.get("/stats", (req, res) => {
  db.query("SELECT COUNT(*) AS total, AVG(prix) AS moyenne FROM logement", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});
if (!titre || !ville || !prix) {
  return res.status(400).json({ error: "Champs obligatoires manquants" });
}
app.get("/logements/page/:num", (req, res) => {
  const page = parseInt(req.params.num);
  const limit = 10;
  const offset = (page - 1) * limit;
  db.query("SELECT * FROM logement LIMIT ? OFFSET ?", [limit, offset], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


app.listen(3001, () => console.log("✅ API Node.js lancée sur le port 3001"));
