const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, verifyPartner } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/nearby', async (req, res) => {
  const { lat, lng, categorie } = req.query;
  try {
    let query = `
      SELECT *,
        ROUND((6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        ))::NUMERIC, 2) as distance_km
      FROM partenaires
      WHERE est_valide = TRUE AND est_ouvert = TRUE
      ${categorie ? 'AND categorie = $3' : ''}
      ORDER BY distance_km ASC
      LIMIT 50
    `;
    const params = categorie ? [lat, lng, categorie] : [lat, lng];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { categorie, search } = req.query;
    let query = 'SELECT id, nom_etablissement, logo_url, categorie, adresse, note_moyenne, est_ouvert, description FROM partenaires WHERE est_valide = TRUE';
    const params = [];
    if (categorie) { params.push(categorie); query += ` AND categorie = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND nom_etablissement ILIKE $${params.length}`; }
    query += ' ORDER BY note_moyenne DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/wallet/stats', verifyPartner, async (req, res) => {
  try {
    const wallet = await pool.query('SELECT solde_wallet FROM partenaires WHERE id=$1', [req.user.id]);
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_commandes,
        COALESCE(SUM(montant_partenaire), 0) as total_gains,
        COALESCE(SUM(CASE WHEN created_at >= date_trunc('month', NOW()) THEN montant_partenaire ELSE 0 END), 0) as gains_ce_mois
      FROM commandes WHERE partenaire_id=$1 AND statut_paiement='payee'
    `, [req.user.id]);
    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE partenaire_id=$1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ solde: wallet.rows[0].solde_wallet, ...stats.rows[0], transactions: transactions.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const partenaire = await pool.query(
      'SELECT id, nom_etablissement, logo_url, categorie, adresse, note_moyenne, est_ouvert, description, horaires, telephone FROM partenaires WHERE id=$1 AND est_valide=TRUE',
      [req.params.id]
    );
    if (partenaire.rows.length === 0) return res.status(404).json({ error: 'Établissement non trouvé' });
    const produits = await pool.query('SELECT * FROM produits WHERE partenaire_id=$1 AND est_disponible=TRUE ORDER BY categorie, nom', [req.params.id]);
    res.json({ ...partenaire.rows[0], produits: produits.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', verifyPartner, async (req, res) => {
  const { nom_etablissement, telephone, adresse, description, horaires, latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      `UPDATE partenaires SET nom_etablissement=$1, telephone=$2, adresse=$3, description=$4, horaires=$5, latitude=$6, longitude=$7 WHERE id=$8 RETURNING *`,
      [nom_etablissement, telephone, adresse, description, JSON.stringify(horaires), latitude, longitude, req.user.id]
    );
    const { mot_de_passe: _, ...safe } = result.rows[0];
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/toggle-open', verifyPartner, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE partenaires SET est_ouvert = NOT est_ouvert WHERE id=$1 RETURNING est_ouvert',
      [req.user.id]
    );
    res.json({ est_ouvert: result.rows[0].est_ouvert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;