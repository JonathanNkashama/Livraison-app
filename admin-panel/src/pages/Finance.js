import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Finance() {
  const [partenaires, setPartenaires] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    const res = await axios.get('https://livraison-app-production-be7f.up.railway.app/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPartenaires(res.data);
  };

  const reverser = async (id, montant, nom) => {
    if (montant <= 0) return alert('Solde insuffisant');
    if (window.confirm(`Reverser ${Number(montant).toLocaleString()} FCFA à ${nom} ?`)) {
      await axios.post('http://localhost:5000/api/admin/finance/reverser',
        { partenaire_id: id, montant },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reversement effectué !');
      charger();
    }
  };

  const totalAReverser = partenaires.reduce((sum, p) => sum + parseFloat(p.solde_wallet || 0), 0);

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
        <h1 style={styles.titre}>💰 Finance</h1>

        <div style={styles.totalCard}>
          <p style={styles.totalLabel}>Total à reverser aux partenaires</p>
          <p style={styles.totalValeur}>{totalAReverser.toLocaleString()} $</p>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Établissement</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Solde à reverser</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {partenaires.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.nom_etablissement}</td>
                <td style={styles.td}>{p.email}</td>
                <td style={styles.td}>{p.telephone}</td>
                <td style={styles.td}>
                  <span style={{fontWeight: 'bold', color: parseFloat(p.solde_wallet) > 0 ? '#2ecc71' : '#999'}}>
                    {Number(p.solde_wallet).toLocaleString()} FCFA
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    style={{...styles.btnReverser, opacity: parseFloat(p.solde_wallet) > 0 ? 1 : 0.4}}
                    onClick={() => reverser(p.id, p.solde_wallet, p.nom_etablissement)}
                    disabled={parseFloat(p.solde_wallet) <= 0}
                  >
                    💸 Reverser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partenaires.length === 0 && <p style={styles.vide}>Aucun partenaire</p>}
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
  totalCard: { backgroundColor: '#FF6B35', padding: 24, borderRadius: 12, marginBottom: 24, display: 'inline-block' },
  totalLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 4 },
  totalValeur: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: 13 },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14, color: '#1a1a2e' },
  btnReverser: { padding: '8px 16px', backgroundColor: '#e8f5e9', color: '#2ecc71', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  vide: { textAlign: 'center', color: '#999', marginTop: 40 }
};