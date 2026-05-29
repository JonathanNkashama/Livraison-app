import API from '../api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Partners() {
  const [partenaires, setPartenaires] = useState([]);
  const [filtre, setFiltre] = useState('false');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => { charger(); }, [filtre]);

  const charger = async () => {
  const res = await axios.get(`${API}/api/admin/partenaires?valide=${filtre}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setPartenaires(res.data);
};

  const valider = async (id, email, nom) => {
  await axios.put(`${API}/api/admin/partenaires/${id}/valider`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  alert(`✅ ${nom} validé !`);
  charger();
};

  const suspendre = async (id) => {
  await axios.put(`${API}/api/admin/partenaires/${id}/suspendre`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  alert('Partenaire suspendu !');
  charger();
};

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🛵 Admin</h2>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
        <button style={styles.navBtn} onClick={() => navigate('/partners')}>🏪 Partenaires</button>
        <button style={styles.navBtn} onClick={() => navigate('/orders')}>📦 Commandes</button>
        <button style={styles.navBtn} onClick={() => navigate('/finance')}>💰 Finance</button>
        <button style={{...styles.navBtn, marginTop: 'auto', color: '#e74c3c'}} onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }}>🚪 Déconnexion</button>
      </div>

      <div style={styles.main}>
        <h1 style={styles.titre}>🏪 Partenaires</h1>
        <div style={styles.filtres}>
          <button style={{...styles.filtreBtn, backgroundColor: filtre === 'false' ? '#FF6B35' : '#fff', color: filtre === 'false' ? '#fff' : '#333'}} onClick={() => setFiltre('false')}>
            ⏳ En attente
          </button>
          <button style={{...styles.filtreBtn, backgroundColor: filtre === 'true' ? '#FF6B35' : '#fff', color: filtre === 'true' ? '#fff' : '#333'}} onClick={() => setFiltre('true')}>
            ✅ Validés
          </button>
        </div>

        <div style={styles.cardsContainer}>
          {partenaires.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardHeader}>
                {p.logo_url ? (
                  <img src={p.logo_url} alt="logo" style={styles.logo_img} />
                ) : (
                  <div style={styles.logoPlaceholder}>🏪</div>
                )}
                <div>
                  <h3 style={styles.cardNom}>{p.nom_etablissement}</h3>
                  <p style={styles.cardCategorie}>{p.categorie}</p>
                </div>
              </div>

              <div style={styles.cardInfos}>
                <p style={styles.cardInfo}>📧 {p.email}</p>
                <p style={styles.cardInfo}>📞 {p.telephone}</p>
                <p style={styles.cardInfo}>📍 {p.adresse}</p>
                <p style={styles.cardInfo}>🌍 {p.pays} — {p.devise}</p>
              </div>

              {p.document_url && (
                <a href={p.document_url} target="_blank" rel="noreferrer" style={styles.btnDocument}>
                  📄 Voir le document officiel
                </a>
              )}

              <div style={styles.cardActions}>
                {!p.est_valide && (
                  <button style={styles.btnValider} onClick={() => valider(p.id, p.email, p.nom_etablissement)}>
                    ✅ Valider
                  </button>
                )}
                {p.est_valide && (
                  <button style={styles.btnSuspendre} onClick={() => suspendre(p.id)}>
                    🚫 Suspendre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {partenaires.length === 0 && <p style={styles.vide}>Aucun partenaire trouvé</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  sidebar: { width: 220, backgroundColor: '#1a1a2e', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  logo: { color: '#fff', marginBottom: 24, fontSize: 20 },
  navBtn: { padding: '12px 16px', backgroundColor: 'transparent', color: '#ccc', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 14 },
  main: { flex: 1, padding: 32 },
  titre: { fontSize: 24, color: '#1a1a2e', marginBottom: 16 },
  filtres: { display: 'flex', gap: 8, marginBottom: 20 },
  filtreBtn: { padding: '8px 20px', borderRadius: 20, border: '1.5px solid #e0e0e0', cursor: 'pointer', fontWeight: '600' },
  cardsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  logo_img: { width: 50, height: 50, borderRadius: 25, objectFit: 'cover' },
  logoPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  cardNom: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  cardCategorie: { fontSize: 13, color: '#999', margin: 0, textTransform: 'capitalize' },
  cardInfos: { marginBottom: 12 },
  cardInfo: { fontSize: 13, color: '#666', margin: '4px 0' },
  btnDocument: { display: 'block', backgroundColor: '#e8f4fd', color: '#3498db', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  cardActions: { display: 'flex', gap: 8 },
  btnValider: { flex: 1, padding: '8px 16px', backgroundColor: '#e8f5e9', color: '#2ecc71', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '600' },
  btnSuspendre: { flex: 1, padding: '8px 16px', backgroundColor: '#fce4e4', color: '#e74c3c', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '600' },
  vide: { textAlign: 'center', color: '#999', marginTop: 40 }
};