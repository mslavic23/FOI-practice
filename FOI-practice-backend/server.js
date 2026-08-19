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
  password: 'NeV5z9FT',   
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

app.listen(PORT, () => {
  console.log(`Server sluša na http://localhost:${PORT}`);
});