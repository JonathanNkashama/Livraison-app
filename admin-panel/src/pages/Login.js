import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://livraison-app-production-be7f.up.railway.app/', {
        email, mot_de_passe: password
      });
      localStorage.setItem('adminToken', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setErreur('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titre}>🛵 Admin Panel</h1>
        <p style={styles.sous}>Connexion administrateur</p>
        {erreur && <p style={styles.erreur}>{erreur}</p>}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button style={styles.btn} onClick={handleLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 40, borderRadius: 16, width: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  titre: { textAlign: 'center', color: '#1a1a2e', marginBottom: 4 },
  sous: { textAlign: 'center', color: '#999', marginBottom: 24 },
  erreur: { color: 'red', textAlign: 'center', marginBottom: 12 },
  input: { width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 14, backgroundColor: '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }
};