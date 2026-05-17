const { envoyerValidationPartenaire } = require('../config/mailer');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM clients) as total_clients,
        (SELECT COUNT(*) FROM partenaires WHERE est_valide=TRUE) as total_partenaires,
        (SELECT COUNT(*) FROM partenaires WHERE est_valide=FALSE) as partenaires_en_attente,
        (SELECT COUNT(*) FROM commandes) as total_commandes,
        (SELECT COALESCE(SUM(montant_total),0) FROM commandes WHERE statut_paiement='payee') as chiffre_affaires,
        (SELECT COALESCE(SUM(commission_plateforme),0) FROM commandes WHERE statut_paiement='payee') as mes_revenus,
        (SELECT COALESCE(SUM(solde_wallet),0) FROM partenaires) as a_reverser
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/partenaires', verifyAdmin, async (req, res) => {
  try {
    const { valide } = req.query;
    let query = 'SELECT id, nom_etablissement, email, telephone, categorie, adresse, est_valide, est_ouvert, solde_wallet, created_at FROM partenaires';
    if (valide !== undefined) query += ` WHERE est_valide=${valide === 'true'}`;
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/partenaires/:id/valider', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE partenaires SET est_valide=TRUE WHERE id=$1 RETURNING nom_etablissement, email',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Partenaire non trouvé' });
    await envoyerValidationPartenaire(result.rows[0].email, result.rows[0].nom_etablissement);
    res.json({ success: true, message: `${result.rows[0].nom_etablissement} validé !` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/partenaires/:id/suspendre', verifyAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE partenaires SET est_valide=FALSE WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Partenaire suspendu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/commandes', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, p.nom_etablissement, cl.nom as nom_client
      FROM commandes c
      JOIN partenaires p ON c.partenaire_id = p.id
      JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/commandes/:id/annuler', verifyAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE commandes SET statut=\'annulee\' WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Commande annulée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/finance/partenaires', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nom_etablissement, email, telephone, solde_wallet FROM partenaires WHERE est_valide=TRUE ORDER BY solde_wallet DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/finance/reverser', verifyAdmin, async (req, res) => {
  const { partenaire_id, montant } = req.body;
  try {
    const partenaire = await pool.query('SELECT * FROM partenaires WHERE id=$1', [partenaire_id]);
    if (partenaire.rows.length === 0) return res.status(404).json({ error: 'Partenaire non trouvé' });
    if (parseFloat(partenaire.rows[0].solde_wallet) < parseFloat(montant)) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }
    await pool.query('UPDATE partenaires SET solde_wallet = solde_wallet - $1 WHERE id=$2', [montant, partenaire_id]);
    await pool.query(
      'INSERT INTO transactions (partenaire_id, type, montant, statut, reference) VALUES ($1,$2,$3,$4,$5)',
      [partenaire_id, 'reversement', montant, 'confirmee', `REV-${Date.now()}`]
    );
    res.json({ success: true, message: 'Reversement enregistré !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;