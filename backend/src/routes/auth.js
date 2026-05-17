const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { genererCode, envoyerCodeConfirmation, envoyerConfirmationPartenaire } = require('../config/mailer');

// ===== ÉTAPE 1 : Envoyer le code de confirmation =====
router.post('/client/send-code', async (req, res) => {
  const { email, nom } = req.body;
  try {
    const existe = await pool.query('SELECT id FROM clients WHERE email=$1', [email]);
    if (existe.rows.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

    const code = genererCode();
    await pool.query('DELETE FROM codes_confirmation WHERE email=$1', [email]);
    await pool.query(
      'INSERT INTO codes_confirmation (email, code, type) VALUES ($1, $2, $3)',
      [email, code, 'client']
    );
    await envoyerCodeConfirmation(email, nom, code);
    res.json({ success: true, message: 'Code envoyé à votre email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ÉTAPE 2 : Vérifier le code et créer le compte =====
router.post('/client/register', async (req, res) => {
  const { nom, email, mot_de_passe, telephone, pays, devise, code } = req.body;
  try {
    // Vérifier le code
    const codeResult = await pool.query(
      'SELECT * FROM codes_confirmation WHERE email=$1 AND code=$2 AND type=$3 AND est_utilise=FALSE AND expire_at > NOW()',
      [email, code, 'client']
    );
    if (codeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Code invalide ou expiré' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      'INSERT INTO clients (nom, email, mot_de_passe, telephone, pays, devise) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, nom, email, telephone, pays, devise',
      [nom, email, hash, telephone, pays, devise]
    );

    await pool.query('UPDATE codes_confirmation SET est_utilise=TRUE WHERE email=$1', [email]);

    const client = result.rows[0];
    const token = jwt.sign({ id: client.id, role: 'client', nom: client.nom }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Connexion Client =====
router.post('/client/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clients WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    const client = result.rows[0];
    const valide = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
    if (!valide) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ id: client.id, role: 'client', nom: client.nom }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const { mot_de_passe: _, ...userSafe } = client;
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ÉTAPE 1 : Envoyer le code partenaire =====
router.post('/partenaire/send-code', async (req, res) => {
  const { email, nom_etablissement } = req.body;
  try {
    const existe = await pool.query('SELECT id FROM partenaires WHERE email=$1', [email]);
    if (existe.rows.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

    const code = genererCode();
    await pool.query('DELETE FROM codes_confirmation WHERE email=$1', [email]);
    await pool.query(
      'INSERT INTO codes_confirmation (email, code, type) VALUES ($1, $2, $3)',
      [email, code, 'partenaire']
    );
    await envoyerCodeConfirmation(email, nom_etablissement, code);
    res.json({ success: true, message: 'Code envoyé à votre email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ÉTAPE 2 : Inscription Partenaire =====
router.post('/partenaire/register', async (req, res) => {
  const { nom_etablissement, email, mot_de_passe, telephone, adresse, categorie,
    description, latitude, longitude, pays, devise, code } = req.body;
  try {
    // Vérifier le code
    const codeResult = await pool.query(
      'SELECT * FROM codes_confirmation WHERE email=$1 AND code=$2 AND type=$3 AND est_utilise=FALSE AND expire_at > NOW()',
      [email, code, 'partenaire']
    );
    if (codeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Code invalide ou expiré' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      `INSERT INTO partenaires (nom_etablissement, email, mot_de_passe, telephone, adresse,
        categorie, description, latitude, longitude, pays, devise)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, nom_etablissement, email, est_valide`,
      [nom_etablissement, email, hash, telephone, adresse, categorie || 'restaurant',
       description, latitude, longitude, pays, devise]
    );

    await pool.query('UPDATE codes_confirmation SET est_utilise=TRUE WHERE email=$1', [email]);
    await envoyerConfirmationPartenaire(email, nom_etablissement);

    const partenaire = result.rows[0];
    const token = jwt.sign(
      { id: partenaire.id, role: 'partenaire', nom: partenaire.nom_etablissement },
      process.env.JWT_SECRET, { expiresIn: '30d' }
    );
    res.status(201).json({ token, user: partenaire, message: 'Inscription en attente de validation' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Connexion Partenaire =====
router.post('/partenaire/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM partenaires WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    const partenaire = result.rows[0];
    const valide = await bcrypt.compare(mot_de_passe, partenaire.mot_de_passe);
    if (!valide) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    if (!partenaire.est_valide) return res.status(403).json({ error: 'Compte en attente de validation' });

    const token = jwt.sign(
      { id: partenaire.id, role: 'partenaire', nom: partenaire.nom_etablissement },
      process.env.JWT_SECRET, { expiresIn: '30d' }
    );
    const { mot_de_passe: _, ...safe } = partenaire;
    res.json({ token, user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Connexion Admin =====
router.post('/admin/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    if (email !== process.env.ADMIN_EMAIL || mot_de_passe !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ id: 1, role: 'admin', nom: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, nom: 'Admin', role: 'admin' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const { verifyToken } = require('../middleware/auth');

router.put('/client/change-password', verifyToken, async (req, res) => {
  const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clients WHERE id=$1', [req.user.id]);
    const client = result.rows[0];
    const valide = await bcrypt.compare(ancien_mot_de_passe, client.mot_de_passe);
    if (!valide) return res.status(400).json({ error: 'Ancien mot de passe incorrect' });
    const hash = await bcrypt.hash(nouveau_mot_de_passe, 10);
    await pool.query('UPDATE clients SET mot_de_passe=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ success: true, message: 'Mot de passe modifié !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;