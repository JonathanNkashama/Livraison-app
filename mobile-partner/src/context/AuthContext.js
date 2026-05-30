import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [partenaire, setPartenaire] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('partnerUser');
        if (savedUser) setPartenaire(JSON.parse(savedUser));
      } catch (e) {}
      setLoading(false);
    };
    charger();
  }, []);

  const login = async (email, mot_de_passe) => {
    const res = await api.post('/auth/partenaire/login', { email, mot_de_passe });
    await AsyncStorage.setItem('partnerToken', res.data.token);
    await AsyncStorage.setItem('partnerUser', JSON.stringify(res.data.user));
    setPartenaire(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('partnerToken');
    await AsyncStorage.removeItem('partnerUser');
    setPartenaire(null);
  };

  return (
    <AuthContext.Provider value={{ partenaire, setPartenaire, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);