const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyPartner } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/partenaire/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produits WHERE partenaire_id=$1 ORDER BY categorie, nom',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mes-produits', verifyPartner, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produits WHERE partenaire_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(`
      SELECT p.*, pa.nom_etablissement, pa.logo_url
      FROM produits p
      JOIN partenaires pa ON p.partenaire_id = pa.id
      WHERE p.nom ILIKE $1 AND p.est_disponible = TRUE AND pa.est_valide = TRUE
      LIMIT 30
    `, [`%${q}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyPartner, upload.single('photo'), async (req, res) => {
  const { nom, description, prix, categorie } = req.body;
  const photo_url = req.file ? req.file.path : null;
  try {
    const result = await pool.query(
      'INSERT INTO produits (partenaire_id, nom, description, prix, photo_url, categorie) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, nom, description, prix, photo_url, categorie]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/toggle', verifyPartner, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE produits SET est_disponible = NOT est_disponible WHERE id=$1 AND partenaire_id=$2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyPartner, async (req, res) => {
  try {
    await pool.query('DELETE FROM produits WHERE id=$1 AND partenaire_id=$2', [req.params.id, req.user.id]);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;