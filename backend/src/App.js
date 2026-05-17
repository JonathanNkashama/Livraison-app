import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Orders from './pages/Orders';
import Finance from './pages/Finance';

function App() {
  const token = localStorage.getItem('adminToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/partners" element={token ? <Partners /> : <Navigate to="/login" />} />
        <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/finance" element={token ? <Finance /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;