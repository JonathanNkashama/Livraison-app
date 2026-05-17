const { convertirEnUSD } = require('../config/currency');
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, verifyPartner } = require('../middleware/auth');
const socketIO = require('../socket/index');

router.post('/create', verifyToken, async (req, res) => {
  const { partenaire_id, items, adresse_livraison, reference_paiement, frais_livraison = 0, devise = 'USD' } = req.body;
  const client_id = req.user.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let montant_total = parseFloat(frais_livraison);
    const itemsAvecPrix = [];
    for (const item of items) {
      const produit = await client.query(
        'SELECT * FROM produits WHERE id=$1 AND partenaire_id=$2 AND est_disponible=TRUE',
        [item.produit_id, partenaire_id]
      );
      if (produit.rows.length === 0) throw new Error(`Produit ${item.produit_id} indisponible`);
      const p = produit.rows[0];
      const sous_total = parseFloat(p.prix) * item.quantite;
      montant_total += sous_total;
      itemsAvecPrix.push({ ...item, prix_unitaire: p.prix, sous_total, nom_produit: p.nom });
    }
    const commission = parseFloat((montant_total * 0.15).toFixed(2));
    const montant_partenaire = parseFloat((montant_total * 0.85).toFixed(2));
    const montant_usd = convertirEnUSD(montant_total, devise);

    const cmdResult = await client.query(`
      INSERT INTO commandes (client_id, partenaire_id, adresse_livraison, montant_total,
        frais_livraison, commission_plateforme, montant_partenaire, reference_paiement,
        statut_paiement, devise_locale, montant_usd)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'payee',$9,$10) RETURNING *
    `, [client_id, partenaire_id, adresse_livraison, montant_total, frais_livraison,
        commission, montant_partenaire, reference_paiement, devise, montant_usd]);

    const commande = cmdResult.rows[0];
    for (const item of itemsAvecPrix) {
      await client.query(
        'INSERT INTO commande_items (commande_id, produit_id, nom_produit, quantite, prix_unitaire, sous_total) VALUES ($1,$2,$3,$4,$5,$6)',
        [commande.id, item.produit_id, item.nom_produit, item.quantite, item.prix_unitaire, item.sous_total]
      );
    }
    await client.query(
      'INSERT INTO transactions (commande_id, partenaire_id, type, montant, statut, reference) VALUES ($1,$2,$3,$4,$5,$6)',
      [commande.id, partenaire_id, 'vente', montant_partenaire, 'en_attente', reference_paiement]
    );
    await client.query('COMMIT');

    const io = socketIO.getIO();
    io.to(`partenaire_${partenaire_id}`).emit('nouvelle_commande', {
      commande_id: commande.id,
      montant: montant_total,
      devise,
      adresse: adresse_livraison,
      items: itemsAvecPrix
    });
    res.status(201).json({ success: true, commande: { ...commande, items: itemsAvecPrix } });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.get('/mes-commandes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, p.nom_etablissement, p.logo_url,
        json_agg(json_build_object('nom', ci.nom_produit, 'quantite', ci.quantite, 'prix', ci.prix_unitaire)) as items
      FROM commandes c
      JOIN partenaires p ON c.partenaire_id = p.id
      JOIN commande_items ci ON ci.commande_id = c.id
      WHERE c.client_id=$1
      GROUP BY c.id, p.nom_etablissement, p.logo_url
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/partenaire/recues', verifyPartner, async (req, res) => {
  try {
    const { statut } = req.query;
    let query = `
      SELECT c.*, cl.nom as nom_client, cl.telephone as tel_client,
        json_agg(json_build_object('nom', ci.nom_produit, 'quantite', ci.quantite, 'prix', ci.prix_unitaire)) as items
      FROM commandes c
      JOIN clients cl ON c.client_id = cl.id
      JOIN commande_items ci ON ci.commande_id = c.id
      WHERE c.partenaire_id=$1
    `;
    const params = [req.user.id];
    if (statut) { params.push(statut); query += ` AND c.statut=$${params.length}`; }
    query += ' GROUP BY c.id, cl.nom, cl.telephone ORDER BY c.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/statut', verifyPartner, async (req, res) => {
  const { statut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE commandes SET statut=$1, updated_at=NOW() WHERE id=$2 AND partenaire_id=$3 RETURNING *',
      [statut, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Commande non trouvée' });
    const commande = result.rows[0];
    if (statut === 'livree') {
      await pool.query(
        'UPDATE partenaires SET solde_wallet = solde_wallet + $1 WHERE id=$2',
        [commande.montant_partenaire, req.user.id]
      );
      await pool.query('UPDATE transactions SET statut=\'confirmee\' WHERE commande_id=$1', [commande.id]);
    }
    const io = socketIO.getIO();
    io.to(`client_${commande.client_id}`).emit('statut_commande', {
      commande_id: commande.id, statut
    });
    res.json({ success: true, commande });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;