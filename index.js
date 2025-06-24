const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET all posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM post ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new post
app.post('/posts', async (req, res) => {
  const { titulo, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO post (titulo, descripcion) VALUES ($1, $2) RETURNING *',
      [titulo, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
