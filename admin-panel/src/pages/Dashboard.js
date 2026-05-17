import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data))
      .catch(() => navigate('/login'));
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🛵 Admin</h2>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
        <button style={styles.navBtn} onClick={() => navigate('/partners')}>🏪 Partenaires</button>
        <button style={styles.navBtn} onClick={() => navigate('/orders')}>📦 Commandes</button>
        <button style={styles.navBtn} onClick={() => navigate('/finance')}>💰 Finance</button>
        <button style={{...styles.navBtn, marginTop: 'auto', color: '#e74c3c'}} onClick={logout}>🚪 Déconnexion</button>
      </div>

      <div style={styles.main}>
        <h1 style={styles.titre}>Tableau de bord</h1>
        <div style={styles.grid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Clients</p>
            <p style={styles.cardValue}>{stats.total_clients || 0}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Partenaires actifs</p>
            <p style={styles.cardValue}>{stats.total_partenaires || 0}</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #e74c3c'}}>
            <p style={styles.cardLabel}>En attente validation</p>
            <p style={styles.cardValue}>{stats.partenaires_en_attente || 0}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Commandes</p>
            <p style={styles.cardValue}>{stats.total_commandes || 0}</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #2ecc71'}}>
            <p style={styles.cardLabel}>Chiffre d'affaires</p>
            <p style={styles.cardValue}>{Number(stats.chiffre_affaires || 0).toLocaleString()} $</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #FF6B35'}}>
            <p style={styles.cardLabel}>Mes revenus (15%)</p>
            <p style={styles.cardValue}>{Number(stats.mes_revenus || 0).toLocaleString()} $</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #f39c12'}}>
            <p style={styles.cardLabel}>À reverser aux partenaires</p>
            <p style={styles.cardValue}>{Number(stats.a_reverser || 0).toLocaleString()} $</p>
          </div>
        </div>
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
  titre: { fontSize: 24, color: '#1a1a2e', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, borderLeft: '4px solid #FF6B35', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardLabel: { color: '#999', fontSize: 13, marginBottom: 8 },
  cardValue: { color: '#1a1a2e', fontSize: 24, fontWeight: 'bold' }
};