import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import CartoonDetailPage from './pages/CartoonDetailPage';
import NetworksPage from './pages/NetworksPage';
import NetworkDetailPage from './pages/NetworkDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cartoon/:id" element={<CartoonDetailPage />} />
              <Route path="/networks" element={<NetworksPage />} />
              <Route path="/network/:networkId" element={<NetworkDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
