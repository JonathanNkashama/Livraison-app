import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerSession();
  }, []);

  const chargerSession = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {}
    setLoading(false);
  };

  const login = async (email, mot_de_passe) => {
    const res = await api.post('/auth/client/login', { email, mot_de_passe });
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/client/register', data);
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (e) {}
  setUser(null);
  setToken(null);
  window.location.href = '/';
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);