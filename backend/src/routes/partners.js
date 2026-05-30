router.put('/mon-profil', verifyPartner, async (req, res) => {
  const { nom_etablissement, telephone, adresse, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE partenaires SET nom_etablissement=$1, telephone=$2, adresse=$3, description=$4 
       WHERE id=$5 RETURNING id, nom_etablissement, email, telephone, adresse, description, categorie, pays, devise, est_valide`,
      [nom_etablissement, telephone, adresse, description, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});