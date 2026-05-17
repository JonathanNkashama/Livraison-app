import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [partenaire, setPartenaire] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('partnerUser');
      if (savedUser) setPartenaire(JSON.parse(savedUser));
    } catch (e) {}
    setLoading(false);
  }, []);

  const login = async (email, mot_de_passe) => {
    const res = await api.post('/auth/partenaire/login', { email, mot_de_passe });
    localStorage.setItem('partnerToken', res.data.token);
    localStorage.setItem('partnerUser', JSON.stringify(res.data.user));
    setPartenaire(res.data.user);
    return res.data;
  };

  const logout = async () => {
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partnerUser');
    setPartenaire(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ partenaire, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);