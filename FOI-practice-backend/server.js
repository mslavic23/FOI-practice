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

app.listen(PORT, () => {
  console.log(`Server sluša na http://localhost:${PORT}`);
});