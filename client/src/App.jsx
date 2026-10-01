import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TourPackagesSection from './components/TourPackagesSection';
import DestinationsSection from './components/DestinationsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import LoginModal from './components/LoginModal';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'admin'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [serverConfig, setServerConfig] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

  // Load server config and initial dataset
  const fetchPublicData = async () => {
    try {
      const [configRes, toursRes, destsRes, testimsRes] = await Promise.all([
        fetch(`${API_URL}/api/config`),
        fetch(`${API_URL}/api/tours`),
        fetch(`${API_URL}/api/destinations`),
        fetch(`${API_URL}/api/testimonials`)
      ]);

      const configData = await configRes.json();
      const toursData = await toursRes.json();
      const destsData = await destsRes.json();
      const testimsData = await testimsRes.json();

      if (configData.success) setServerConfig(configData);
      if (toursData.success) setTours(toursData.tours);
      if (destsData.success) setDestinations(destsData.destinations);
      if (testimsData.success) setTestimonials(testimsData.testimonials);
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
      .catch(() => {
        // If server offline, keep saved status
      });
    }
  }, []);

  const handleLoginSuccess = (loginData) => {
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setCurrentView('admin');
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
    setCurrentView('home');
  };

  const handleOpenBookingForTour = (tourObj) => {
    setSelectedTour(tourObj);
    setIsBookingModalOpen(true);
  };

  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onSwitchToSite={() => setCurrentView('home')}
        apiUrl={API_URL}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Hero Section with Navbar */}
      <Hero
        onOpenBookingModal={() => {
          setSelectedTour(null);
          setIsBookingModalOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isAdmin={isAdminLoggedIn}
        onOpenAdminView={() => setCurrentView('admin')}
        onLogout={handleLogout}
        serverConfig={serverConfig}
      />

      {/* About Section */}
      <AboutSection />

      {/* Featured Tour Packages */}
      <TourPackagesSection
        tours={tours}
        onSelectTourForBooking={handleOpenBookingForTour}
      />

      {/* Global Destinations */}
      <DestinationsSection
        destinations={destinations}
      />

      {/* Customer Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
      />

      {/* Contact Section */}
      <ContactSection
        apiUrl={API_URL}
      />

      {/* Footer */}
      <Footer
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isAdmin={isAdminLoggedIn}
        onOpenAdminView={() => setCurrentView('admin')}
        serverConfig={serverConfig}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        apiUrl={API_URL}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedTour={selectedTour}
        toursList={tours}
        apiUrl={API_URL}
      />
    </div>
  );
}
