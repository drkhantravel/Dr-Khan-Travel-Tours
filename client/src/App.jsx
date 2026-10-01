import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';

import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);

  // Sync state when browser back/forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Load server config
  const fetchPublicData = async () => {
    try {
      const configRes = await fetch(`${API_URL}/api/config`);
      const configData = await configRes.json();
      if (configData.success) setServerConfig(configData);
    } catch (err) {
      console.error('API connection error:', err);
    }
  };

  // Check saved admin session token on mount
  useEffect(() => {
    fetchPublicData();

    const savedToken = localStorage.getItem('dk_admin_token');
    if (savedToken) {
      fetch(`${API_URL}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.valid) {
          setIsAdminLoggedIn(true);
        } else {
          localStorage.removeItem('dk_admin_token');
          setIsAdminLoggedIn(false);
        }
      })
      .catch(() => {});
    }
  }, []);

  const handleLoginSuccess = (loginData) => {
    setIsAdminLoggedIn(true);
    navigateTo('/admin');
  };

  const handleLogout = () => {
    const token = localStorage.getItem('dk_admin_token');
    if (token) {
      fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }

    localStorage.removeItem('dk_admin_token');
    localStorage.removeItem('dk_admin_email');
    setIsAdminLoggedIn(false);
    navigateTo('/admin/login');
  };

  // Dedicated Route 1: /admin/login or /login
  if (currentPath === '/admin/login' || currentPath === '/login') {
    if (isAdminLoggedIn) {
      navigateTo('/admin');
      return null;
    }
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSite={() => navigateTo('/')}
        apiUrl={API_URL}
      />
    );
  }

  // Dedicated Route 2: /admin or /admin/dashboard
  if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSite={() => navigateTo('/')}
          apiUrl={API_URL}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onSwitchToSite={() => navigateTo('/')}
        apiUrl={API_URL}
      />
    );
  }

  // Dedicated Route 3: Main Website Home Page (/)
  return (
    <div className="app-container">
      {/* Hero Section with Navbar */}
      <Hero
        onOpenLoginModal={() => navigateTo('/admin/login')}
        isAdmin={isAdminLoggedIn}
        onOpenAdminView={() => navigateTo('/admin')}
        onLogout={handleLogout}
        serverConfig={serverConfig}
      />

      {/* About Section */}
      <AboutSection />

      {/* Travel Gallery Section */}
      <GallerySection />

      {/* Footer */}
      <Footer
        onOpenLoginModal={() => navigateTo('/admin/login')}
        isAdmin={isAdminLoggedIn}
        onOpenAdminView={() => navigateTo('/admin')}
        serverConfig={serverConfig}
      />
    </div>
  );
}
