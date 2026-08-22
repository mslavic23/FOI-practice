require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,   
  database: 'foi_practice'
});

db.connect((err) => {
  if (err) {
    console.error('Greška pri spajanju na bazu:', err);
    return;
  }
  console.log('Uspješno spojeno na MySQL bazu.');
});

app.get('/', (req, res) => {
  res.send('Server uspješno radi:)');
});

app.get('/api/pitanja/:kategorija/:razina', (req, res) => {
  const { kategorija, razina } = req.params;

  const query = 'SELECT * FROM pitanja WHERE kategorija = ? AND razina = ?';
  db.query(query, [kategorija, razina], (err, results) => {
    if (err) {
      console.error('Greška pri dohvaćanju pitanja:', err);
      res.status(500).json({ error: 'Greška na serveru' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/results', (req, res) => {
  const { type, category, level, correct_answers, total_questions, time_seconds } = req.body;

  const query = 'INSERT INTO results (type, category, level, correct_answers, total_questions, time_seconds) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [type, category, level, correct_answers, total_questions, time_seconds], (err, result) => {
    if (err) {
      console.error('Greška pri spremanju rezultata:', err);
      res.status(500).json({ error: 'Greška na serveru' });
      return;
    }
    res.json({ success: true, id: result.insertId });
  });
});

app.get('/api/results/summary', (req, res) => {
  const query = `
    SELECT
      COUNT(*) AS total_solved,
      AVG(time_seconds) AS avg_time,
      AVG(correct_answers / total_questions * 100) AS avg_accuracy
    FROM results
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Greška pri dohvaćanju sažetka:', err);
      res.status(500).json({ error: 'Greška na serveru' });
      return;
    }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server sluša na http://localhost:${PORT}`);
});

app.get('/api/results/breakdown', (req, res) => {
  const query = `
    SELECT type, category, level,
      AVG(correct_answers / total_questions * 100) AS avg_accuracy,
      COUNT(*) AS broj_pokusaja
    FROM results
    GROUP BY type, category, level
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Greška pri dohvaćanju breakdown-a:', err);
      res.status(500).json({ error: 'Greška na serveru' });
      return;
    }
    res.json(results);
  });
});
