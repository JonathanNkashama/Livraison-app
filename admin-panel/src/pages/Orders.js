import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [commandes, setCommandes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    const res = await axios.get('https://livraison-app-production-be7f.up.railway.app/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCommandes(res.data);
  };

  const annuler = async (id) => {
    if (window.confirm('Annuler cette commande ?')) {
      await axios.put(`https://livraison-app-production-be7f.up.railway.app//${id}/annuler`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Commande annulée !');
      charger();
    }
  };

  const couleurStatut = (statut) => {
    const couleurs = {
      en_attente: '#f39c12', acceptee: '#3498db',
      en_preparation: '#9b59b6', en_livraison: '#1abc9c',
      livree: '#2ecc71', annulee: '#e74c3c', refusee: '#e74c3c'
    };
    return couleurs[statut] || '#999';
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
        <h1 style={styles.titre}>📦 Commandes</h1>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Restaurant</th>
              <th style={styles.th}>Montant</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map(c => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>#{c.id}</td>
                <td style={styles.td}>{c.nom_client}</td>
                <td style={styles.td}>{c.nom_etablissement}</td>
                <td style={styles.td}>{Number(c.montant_total).toLocaleString()} $</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, backgroundColor: couleurStatut(c.statut) + '20', color: couleurStatut(c.statut)}}>
                    {c.statut}
                  </span>
                </td>
                <td style={styles.td}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  {c.statut !== 'annulee' && c.statut !== 'livree' && (
                    <button style={styles.btnAnnuler} onClick={() => annuler(c.id)}>Annuler</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {commandes.length === 0 && <p style={styles.vide}>Aucune commande</p>}
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
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14, color: '#1a1a2e' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: '600' },
  btnAnnuler: { padding: '6px 14px', backgroundColor: '#fce4e4', color: '#e74c3c', border: 'none', borderRadius: 6, cursor: 'pointer' },
  vide: { textAlign: 'center', color: '#999', marginTop: 40 }
};