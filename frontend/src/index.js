// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Import
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
// import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. Bọc toàn bộ App */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter> {/* <-- 3. Đóng bọc */}
  </React.StrictMode>
);