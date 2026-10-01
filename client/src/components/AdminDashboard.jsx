import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarCheck, Package, MessageSquare, Settings, 
  LogOut, Plus, Trash2, Edit3, CheckCircle, AlertCircle, X,
  Search, ExternalLink, RefreshCw, DollarSign, Shield, Server,
  ChevronRight, Eye, MapPin
} from 'lucide-react';

export default function AdminDashboard({ onLogout, onSwitchToSite, apiUrl = 'http://localhost:5000' }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, tours, messages, env
  
  // Data stores
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  
  const [tourCategoryFilter, setTourCategoryFilter] = useState('All');
  const [tourSearch, setTourSearch] = useState('');

  // Modals inside Admin
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);

  // New Tour Form State
  const [tourForm, setTourForm] = useState({
    title: '',
    category: 'Pilgrimage',
    destination: '',
    duration: '7 Days / 6 Nights',
    price: 1500,
    badge: 'Exclusive',
    description: '',
    image: '',
    highlightsText: ''
  });

  const adminToken = localStorage.getItem('dk_admin_token');
  const adminEmail = localStorage.getItem('dk_admin_email') || 'admin@drkhantravel.com';

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const headers = { 'Authorization': `Bearer ${adminToken}` };

      const [statsRes, bookingsRes, toursRes, msgsRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/stats`, { headers }),
        fetch(`${apiUrl}/api/admin/bookings`, { headers }),
        fetch(`${apiUrl}/api/tours`),
        fetch(`${apiUrl}/api/admin/messages`, { headers })
      ]);

      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      const toursData = await toursRes.json();
      const msgsData = await msgsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (toursData.success) setTours(toursData.tours);
      if (msgsData.success) setMessages(msgsData.messages);

    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Could not connect to backend server. Make sure node server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [apiUrl, adminToken]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ================= BOOKING ACTIONS =================
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.bookingId === bookingId ? data.booking : b));
        showNotification(`Booking ${bookingId} status changed to ${newStatus}`);
      } else {
        alert(data.message || 'Update failed.');
      }
    } catch (err) {
      alert('Error updating booking status.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to delete booking ${bookingId}?`)) return;

    try {
      const res = await fetch(`${apiUrl}/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
        if (viewingBooking?.bookingId === bookingId) setViewingBooking(null);
        showNotification(`Booking ${bookingId} deleted successfully.`);
      }
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  // ================= TOUR ACTIONS =================
  const handleCreateOrUpdateTour = async (e) => {
    e.preventDefault();
    try {
      const highlights = tourForm.highlightsText
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const payload = {
        title: tourForm.title,
        category: tourForm.category,
        destination: tourForm.destination,
        duration: tourForm.duration,
        price: Number(tourForm.price),
        badge: tourForm.badge,
        description: tourForm.description,
        image: tourForm.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        highlights: highlights.length > 0 ? highlights : undefined
      };

      const isEdit = !!editingTour;
      const url = isEdit ? `${apiUrl}/api/admin/tours/${editingTour.id}` : `${apiUrl}/api/admin/tours`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        if (isEdit) {
          setTours(prev => prev.map(t => t.id === editingTour.id ? data.tour : t));
          showNotification(`Tour package "${data.tour.title}" updated.`);
        } else {
          setTours(prev => [data.tour, ...prev]);
          showNotification(`New tour package created!`);
        }
        setShowAddTourModal(false);
        setEditingTour(null);
        setTourForm({
          title: '', category: 'Pilgrimage', destination: '', duration: '7 Days / 6 Nights',
          price: 1500, badge: 'Exclusive', description: '', image: '', highlightsText: ''
        });
      } else {
        alert(data.message || 'Failed to save tour package.');
      }
    } catch (err) {
      alert('Server error saving tour package.');
    }
  };

  const handleEditTourClick = (tour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title,
      category: tour.category,
      destination: tour.destination,
      duration: tour.duration,
      price: tour.price,
      badge: tour.badge || 'Featured',
      description: tour.description || '',
      image: tour.image || '',
      highlightsText: (tour.highlights || []).join('\n')
    });
    setShowAddTourModal(true);
  };

  const handleDeleteTour = async (tourId, tourTitle) => {
    if (!window.confirm(`Delete tour "${tourTitle}" permanently?`)) return;

    try {
      const res = await fetch(`${apiUrl}/api/admin/tours/${tourId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setTours(prev => prev.filter(t => t.id !== tourId));
        showNotification(`Tour package deleted.`);
      }
    } catch (err) {
      alert('Failed to delete tour.');
    }
  };

  // ================= MESSAGE ACTIONS =================
  const handleToggleMessageStatus = async (msgId, currentStatus) => {
    const nextStatus = currentStatus === 'Replied' ? 'Unread' : 'Replied';
    try {
      const res = await fetch(`${apiUrl}/api/admin/messages/${msgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: nextStatus } : m));
        showNotification(`Message status updated to ${nextStatus}.`);
      }
    } catch (err) {
      alert('Error updating message status.');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete message?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/admin/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
        showNotification(`Message deleted.`);
      }
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
    const q = bookingSearch.toLowerCase();
    const matchesSearch = !q || (
      b.bookingId.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.tourTitle.toLowerCase().includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  // Filtered Tours
  const filteredTours = tours.filter(t => {
    const matchesCategory = tourCategoryFilter === 'All' || t.category.toLowerCase().includes(tourCategoryFilter.toLowerCase());
    const q = tourSearch.toLowerCase();
    const matchesSearch = !q || (
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q)
    );
    return matchesCategory && matchesSearch;
  });

  const totalRevenueCalc = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="admin-container">
      {/* Top Notification Toast */}
      {successMsg && (
        <div className="admin-toast">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Header Navbar */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="brand-badge-square">DK</div>
          <div>
            <h1 className="admin-title">Dr. Khan Travel — Admin Portal</h1>
            <span className="admin-subtitle">Executive Operations & Management Dashboard</span>
          </div>
        </div>

        <div className="admin-header-actions">
          {/* Admin Email Pill */}
          <div className="admin-user-pill">
            <Shield size={16} className="pill-shield-icon" />
            <span className="admin-email-text">{adminEmail}</span>
            <span className="env-tag">SERVER .ENV</span>
          </div>

          <button onClick={onSwitchToSite} className="admin-nav-btn secondary-btn">
            <ExternalLink size={16} /> View Website
          </button>

          <button onClick={onLogout} className="admin-nav-btn danger-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Grid: Sidebar + Content Area */}
      <div className="admin-body-grid">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button
              onClick={() => setActiveTab('overview')}
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <CalendarCheck size={20} />
              <span>Bookings</span>
              <span className="nav-count-badge">{bookings.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`sidebar-link ${activeTab === 'tours' ? 'active' : ''}`}
            >
              <Package size={20} />
              <span>Tour Packages</span>
              <span className="nav-count-badge">{tours.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`sidebar-link ${activeTab === 'messages' ? 'active' : ''}`}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
              {messages.filter(m => m.status === 'Unread').length > 0 && (
                <span className="nav-count-badge badge-unread">
                  {messages.filter(m => m.status === 'Unread').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('env')}
              className={`sidebar-link ${activeTab === 'env' ? 'active' : ''}`}
            >
              <Server size={20} />
              <span>Server & Env</span>
            </button>
          </nav>

          <div className="sidebar-footer-card">
            <div className="server-status-dot-wrap">
              <span className="online-dot"></span>
              <span>Express Server Active</span>
            </div>
            <p className="server-info-sub">Port 5000 • CORS Authorized</p>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="admin-content-area">
          {loading ? (
            <div className="admin-loading-state">
              <RefreshCw className="spinning-icon" size={32} />
              <p>Fetching live dataset from Dr. Khan Travel API...</p>
            </div>
          ) : error ? (
            <div className="alert-box error-alert margin-bottom">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={fetchAdminData} className="reload-btn"><RefreshCw size={14} /> Retry</button>
            </div>
          ) : (
            <>
              {/* ================= 1. OVERVIEW TAB ================= */}
              {activeTab === 'overview' && (
                <div className="tab-view animate-fade-in">
                  <div className="view-header">
                    <div>
                      <h2>Dashboard Executive Summary</h2>
                      <p className="section-desc">Real-time metrics, booking pipeline, and tour status.</p>
                    </div>
                    <button onClick={fetchAdminData} className="refresh-icon-btn" title="Refresh data">
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  {/* 4 Key KPI Cards */}
                  <div className="stats-kpi-grid">
                    <div className="kpi-card accent-blue">
                      <div className="kpi-icon-wrap"><CalendarCheck size={24} /></div>
                      <div className="kpi-info">
                        <span className="kpi-lbl">Total Bookings</span>
                        <span className="kpi-val">{bookings.length}</span>
                        <span className="kpi-sub">{bookings.filter(b => b.status === 'Confirmed').length} Confirmed</span>
                      </div>
                    </div>

                    <div className="kpi-card accent-emerald">
                      <div className="kpi-icon-wrap"><DollarSign size={24} /></div>
                      <div className="kpi-info">
                        <span className="kpi-lbl">Confirmed Revenue</span>
                        <span className="kpi-val">${totalRevenueCalc.toLocaleString()}</span>
                        <span className="kpi-sub">From active reservations</span>
                      </div>
                    </div>

                    <div className="kpi-card accent-purple">
                      <div className="kpi-icon-wrap"><Package size={24} /></div>
                      <div className="kpi-info">
                        <span className="kpi-lbl">Active Tour Packages</span>
                        <span className="kpi-val">{tours.length}</span>
                        <span className="kpi-sub">Across 6 Global Destinations</span>
                      </div>
                    </div>

                    <div className="kpi-card accent-amber">
                      <div className="kpi-icon-wrap"><MessageSquare size={24} /></div>
                      <div className="kpi-info">
                        <span className="kpi-lbl">Contact Inquiries</span>
                        <span className="kpi-val">{messages.length}</span>
                        <span className="kpi-sub">{messages.filter(m => m.status === 'Unread').length} New Unread</span>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Section */}
                  <div className="dashboard-columns">
                    {/* Recent Bookings Feed */}
                    <div className="admin-card">
                      <div className="card-header-bar">
                        <h3>Recent Bookings Stream</h3>
                        <button onClick={() => setActiveTab('bookings')} className="text-link-btn">
                          View All ({bookings.length}) <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="recent-list">
                        {bookings.slice(0, 5).map(b => (
                          <div key={b.bookingId} className="recent-item">
                            <div className="recent-left">
                              <span className="ref-tag">{b.bookingId}</span>
                              <div>
                                <h4 className="recent-title">{b.fullName}</h4>
                                <span className="recent-sub">{b.tourTitle} • {b.travelersCount} Traveler(s)</span>
                              </div>
                            </div>
                            <div className="recent-right">
                              <span className={`status-pill ${b.status.toLowerCase()}`}>
                                {b.status}
                              </span>
                              <span className="recent-amount">${b.totalAmount?.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Packages Preview */}
                    <div className="admin-card">
                      <div className="card-header-bar">
                        <h3>Top Tour Packages</h3>
                        <button onClick={() => setActiveTab('tours')} className="text-link-btn">
                          Manage Packages ({tours.length}) <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="tours-mini-list">
                        {tours.slice(0, 4).map(t => (
                          <div key={t.id} className="tour-mini-item">
                            <img src={t.image} alt={t.title} className="tour-thumb-img" />
                            <div className="tour-mini-info">
                              <h4 className="tour-mini-title">{t.title}</h4>
                              <span className="tour-mini-meta">{t.destination} • {t.duration}</span>
                            </div>
                            <span className="tour-price-badge">${t.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 2. BOOKINGS TAB ================= */}
              {activeTab === 'bookings' && (
                <div className="tab-view animate-fade-in">
                  <div className="view-header">
                    <div>
                      <h2>Customer Travel Bookings</h2>
                      <p className="section-desc">Manage, confirm, update, or delete customer travel reservations.</p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="filter-controls-bar">
                    <div className="search-input-wrap">
                      <Search size={18} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search by ID, customer name, email, or package..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>

                    <div className="filter-pills-wrap">
                      {['All', 'Confirmed', 'Pending', 'Cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setBookingFilterStatus(st)}
                          className={`filter-pill-btn ${bookingFilterStatus === st ? 'active' : ''}`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Customer Details</th>
                          <th>Tour Package</th>
                          <th>Travel Date</th>
                          <th>Travelers</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="empty-table-cell">
                              No travel bookings match current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map(b => (
                            <tr key={b.bookingId}>
                              <td>
                                <span className="ref-tag-badge">{b.bookingId}</span>
                              </td>
                              <td>
                                <div className="user-detail-cell">
                                  <strong>{b.fullName}</strong>
                                  <span className="cell-sub">{b.email}</span>
                                  <span className="cell-sub">{b.phone}</span>
                                </div>
                              </td>
                              <td>
                                <span className="tour-title-cell">{b.tourTitle}</span>
                              </td>
                              <td>{b.travelDate}</td>
                              <td>{b.travelersCount} Person(s)</td>
                              <td>
                                <strong className="amount-text">${b.totalAmount?.toLocaleString()}</strong>
                              </td>
                              <td>
                                <span className={`status-pill ${b.status.toLowerCase()}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons-group">
                                  {/* Quick Status Dropdown */}
                                  <select
                                    value={b.status}
                                    onChange={(e) => handleUpdateBookingStatus(b.bookingId, e.target.value)}
                                    className="small-status-select"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                  </select>

                                  <button
                                    onClick={() => setViewingBooking(b)}
                                    className="icon-action-btn view-btn"
                                    title="View Full Details"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteBooking(b.bookingId)}
                                    className="icon-action-btn delete-btn"
                                    title="Delete Booking"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= 3. TOURS TAB ================= */}
              {activeTab === 'tours' && (
                <div className="tab-view animate-fade-in">
                  <div className="view-header">
                    <div>
                      <h2>Tour Packages Catalog</h2>
                      <p className="section-desc">Create new travel itineraries or modify existing offerings.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTour(null);
                        setTourForm({
                          title: '', category: 'Pilgrimage', destination: '', duration: '7 Days / 6 Nights',
                          price: 1500, badge: 'Exclusive', description: '', image: '', highlightsText: ''
                        });
                        setShowAddTourModal(true);
                      }}
                      className="submit-primary-btn"
                    >
                      <Plus size={18} /> Add New Tour Package
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="filter-controls-bar">
                    <div className="search-input-wrap">
                      <Search size={18} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search tour package by title or destination..."
                        value={tourSearch}
                        onChange={(e) => setTourSearch(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>

                    <div className="filter-pills-wrap">
                      {['All', 'Pilgrimage', 'Europe', 'Culture', 'Luxury', 'Adventure', 'Honeymoon'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setTourCategoryFilter(cat)}
                          className={`filter-pill-btn ${tourCategoryFilter === cat ? 'active' : ''}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tours Cards Grid */}
                  <div className="tours-admin-grid">
                    {filteredTours.map(t => (
                      <div key={t.id} className="tour-admin-card">
                        <div className="tour-card-image-wrap">
                          <img src={t.image} alt={t.title} className="tour-card-img" />
                          <span className="tour-card-badge">{t.badge || t.category}</span>
                          <span className="tour-card-price">${t.price.toLocaleString()}</span>
                        </div>

                        <div className="tour-card-content">
                          <span className="tour-cat-tag">{t.category}</span>
                          <h3 className="tour-card-title">{t.title}</h3>
                          <p className="tour-card-dest"><MapPin size={14} /> {t.destination} ({t.duration})</p>
                          <p className="tour-card-desc">{t.description}</p>

                          <div className="tour-card-footer">
                            <button
                              onClick={() => handleEditTourClick(t)}
                              className="edit-tour-btn"
                            >
                              <Edit3 size={15} /> Edit Details
                            </button>

                            <button
                              onClick={() => handleDeleteTour(t.id, t.title)}
                              className="delete-tour-btn"
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 4. MESSAGES TAB ================= */}
              {activeTab === 'messages' && (
                <div className="tab-view animate-fade-in">
                  <div className="view-header">
                    <div>
                      <h2>Customer Inquiries & Messages</h2>
                      <p className="section-desc">Review messages submitted via the website contact form.</p>
                    </div>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sender Info</th>
                          <th>Subject</th>
                          <th>Message Content</th>
                          <th>Received At</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="empty-table-cell">No customer messages found.</td>
                          </tr>
                        ) : (
                          messages.map(m => (
                            <tr key={m.id}>
                              <td>
                                <div className="user-detail-cell">
                                  <strong>{m.name}</strong>
                                  <span className="cell-sub">{m.email}</span>
                                  <span className="cell-sub">{m.phone}</span>
                                </div>
                              </td>
                              <td><strong>{m.subject}</strong></td>
                              <td>
                                <p className="msg-text-clamp">{m.message}</p>
                              </td>
                              <td>{new Date(m.receivedAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`status-pill ${m.status.toLowerCase()}`}>
                                  {m.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons-group">
                                  <button
                                    onClick={() => handleToggleMessageStatus(m.id, m.status)}
                                    className="icon-action-btn view-btn"
                                    title="Toggle Replied / Unread"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(m.id)}
                                    className="icon-action-btn delete-btn"
                                    title="Delete Message"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= 5. SERVER ENV TAB ================= */}
              {activeTab === 'env' && (
                <div className="tab-view animate-fade-in">
                  <div className="view-header">
                    <div>
                      <h2>Server Environment Configuration</h2>
                      <p className="section-desc">Verification of backend environment variables and server health.</p>
                    </div>
                  </div>

                  <div className="env-details-card">
                    <div className="env-status-banner">
                      <Shield size={32} className="env-shield-icon" />
                      <div>
                        <h3>Server Environment Authentication System</h3>
                        <p>
                          Admin credentials are authenticated on server boot directly from <code className="env-code">server/.env</code> file.
                        </p>
                      </div>
                    </div>

                    <div className="env-grid">
                      <div className="env-field-box">
                        <span className="env-lbl">ADMIN_EMAIL Variable</span>
                        <code className="env-val">{adminEmail}</code>
                        <span className="env-sub">Configured in server/.env</span>
                      </div>

                      <div className="env-field-box">
                        <span className="env-lbl">AWS RDS MySQL Database</span>
                        <code className="env-val">{stats?.database?.host || 'dr-khan-travel-db...rds.amazonaws.com'}</code>
                        <span className="env-sub">Port {stats?.database?.port || 3306} • Provider: AWS RDS MySQL</span>
                      </div>

                      <div className="env-field-box">
                        <span className="env-lbl">Cloudinary Cloud Name</span>
                        <code className="env-val">{stats?.serverConfig?.cloudinaryCloudName || 'drkhantravel'}</code>
                        <span className="env-sub">Media Storage & Asset CDN</span>
                      </div>

                      <div className="env-field-box">
                        <span className="env-lbl">CLIENT_URL Variable</span>
                        <code className="env-val">http://localhost:5173</code>
                        <span className="env-sub">CORS Origin Allowed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ================= ADD / EDIT TOUR MODAL ================= */}
      {showAddTourModal && (
        <div className="modal-backdrop">
          <div className="modal-card glass-modal booking-modal-wide">
            <button onClick={() => setShowAddTourModal(false)} className="modal-close-btn">
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="admin-badge-icon">
                <Package size={26} />
              </div>
              <h2 className="modal-title">{editingTour ? 'Edit Tour Package' : 'Create New Tour Package'}</h2>
              <p className="modal-subtitle">Add luxurious travel itineraries to Dr. Khan Travel catalog.</p>
            </div>

            <form onSubmit={handleCreateOrUpdateTour} className="modal-form booking-form-grid">
              <div className="form-group full-grid-col">
                <label className="form-label">Package Title</label>
                <input
                  type="text"
                  required
                  value={tourForm.title}
                  onChange={e => setTourForm({ ...tourForm, title: e.target.value })}
                  placeholder="e.g. VIP Executive Umrah Package"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={tourForm.category}
                  onChange={e => setTourForm({ ...tourForm, category: e.target.value })}
                  className="form-input form-select"
                >
                  <option value="Pilgrimage">Pilgrimage</option>
                  <option value="Europe">Europe</option>
                  <option value="Culture & History">Culture & History</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Honeymoon & Relaxation">Honeymoon & Relaxation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  required
                  value={tourForm.destination}
                  onChange={e => setTourForm({ ...tourForm, destination: e.target.value })}
                  placeholder="e.g. Makkah & Madinah, Saudi Arabia"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  required
                  value={tourForm.duration}
                  onChange={e => setTourForm({ ...tourForm, duration: e.target.value })}
                  placeholder="e.g. 15 Days / 14 Nights"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price per Traveler ($ USD)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={tourForm.price}
                  onChange={e => setTourForm({ ...tourForm, price: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group full-grid-col">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  value={tourForm.image}
                  onChange={e => setTourForm({ ...tourForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-input"
                />
              </div>

              <div className="form-group full-grid-col">
                <label className="form-label">Badge Label (Optional)</label>
                <input
                  type="text"
                  value={tourForm.badge}
                  onChange={e => setTourForm({ ...tourForm, badge: e.target.value })}
                  placeholder="e.g. Most Popular, Best Seller"
                  className="form-input"
                />
              </div>

              <div className="form-group full-grid-col">
                <label className="form-label">Package Description</label>
                <textarea
                  rows={3}
                  value={tourForm.description}
                  onChange={e => setTourForm({ ...tourForm, description: e.target.value })}
                  placeholder="Comprehensive description of the tour..."
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group full-grid-col">
                <label className="form-label">Package Key Highlights (One per line)</label>
                <textarea
                  rows={3}
                  value={tourForm.highlightsText}
                  onChange={e => setTourForm({ ...tourForm, highlightsText: e.target.value })}
                  placeholder="5-Star Hotel near Haram&#10;Private VIP transfers&#10;Guided Ziyarat tours"
                  className="form-input form-textarea"
                />
              </div>

              <button type="submit" className="submit-primary-btn full-grid-col">
                {editingTour ? 'Save Tour Changes' : 'Publish Tour Package'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW BOOKING DETAILS MODAL ================= */}
      {viewingBooking && (
        <div className="modal-backdrop">
          <div className="modal-card glass-modal">
            <button onClick={() => setViewingBooking(null)} className="modal-close-btn">
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="admin-badge-icon">
                <CalendarCheck size={26} />
              </div>
              <h2 className="modal-title">Booking Details</h2>
              <span className="ref-tag-badge">{viewingBooking.bookingId}</span>
            </div>

            <div className="booking-receipt-card margin-bottom">
              <div className="receipt-row">
                <span className="receipt-label">Customer Name:</span>
                <span className="receipt-value">{viewingBooking.fullName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Email:</span>
                <span className="receipt-value">{viewingBooking.email}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Phone:</span>
                <span className="receipt-value">{viewingBooking.phone}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Tour Package:</span>
                <span className="receipt-value">{viewingBooking.tourTitle}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Travel Date:</span>
                <span className="receipt-value">{viewingBooking.travelDate}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Travelers Count:</span>
                <span className="receipt-value">{viewingBooking.travelersCount} Person(s)</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Special Requests:</span>
                <span className="receipt-value">{viewingBooking.specialRequests || 'None'}</span>
              </div>
              <div className="receipt-row total-row">
                <span className="receipt-label">Total Payment Amount:</span>
                <span className="receipt-value price-highlight">${viewingBooking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => setViewingBooking(null)} className="submit-primary-btn full-width-btn">
              Close Details Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
