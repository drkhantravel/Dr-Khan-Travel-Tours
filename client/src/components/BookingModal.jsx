import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, Users, FileText, CheckCircle2, AlertCircle, Plane, DollarSign } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, selectedTour, toursList = [], apiUrl = 'http://localhost:5000' }) {
  const [tourId, setTourId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelDate, setTravelDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (selectedTour) {
      setTourId(selectedTour.id);
    } else if (toursList.length > 0 && !tourId) {
      setTourId(toursList[0].id);
    }
  }, [selectedTour, toursList]);

  // Set default travel date to 30 days in future
  useEffect(() => {
    if (!travelDate) {
      const future = new Date();
      future.setDate(future.getDate() + 30);
      setTravelDate(future.toISOString().split('T')[0]);
    }
  }, []);

  if (!isOpen) return null;

  const currentTourObj = toursList.find(t => t.id === tourId) || selectedTour;
  const tourPrice = currentTourObj ? currentTourObj.price : 1850;
  const totalAmount = tourPrice * Number(travelersCount || 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        tourId: tourId || (toursList[0] ? toursList[0].id : 'tour-1'),
        fullName,
        email,
        phone,
        travelersCount: Number(travelersCount),
        travelDate,
        specialRequests
      };

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingSuccess(data.booking);
      } else {
        setError(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError('Unable to connect to backend server. Please make sure port 5000 is online.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setBookingSuccess(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-modal booking-modal-wide">
        {/* Close Button */}
        <button onClick={handleResetAndClose} className="modal-close-btn" aria-label="Close modal">
          <X size={20} />
        </button>

        {bookingSuccess ? (
          /* SUCCESS SCREEN */
          <div className="booking-success-view">
            <div className="success-icon-badge">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="modal-title text-center">Booking Request Confirmed!</h2>
            <p className="modal-subtitle text-center">
              Thank you, <strong>{bookingSuccess.fullName}</strong>! Your travel reservation has been logged into Dr. Khan Travel & Tours system.
            </p>

            <div className="booking-receipt-card">
              <div className="receipt-row">
                <span className="receipt-label">Booking Reference ID:</span>
                <span className="receipt-value ref-badge">{bookingSuccess.bookingId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Selected Package:</span>
                <span className="receipt-value">{bookingSuccess.tourTitle}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Travel Date:</span>
                <span className="receipt-value">{bookingSuccess.travelDate}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Travelers:</span>
                <span className="receipt-value">{bookingSuccess.travelersCount} Person(s)</span>
              </div>
              <div className="receipt-row total-row">
                <span className="receipt-label">Total Estimated Price:</span>
                <span className="receipt-value price-highlight">${bookingSuccess.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <p className="contact-notice">
              ✈️ A Senior Travel Counselor will call you at <strong>{bookingSuccess.phone}</strong> or send details to <strong>{bookingSuccess.email}</strong> within 2 hours.
            </p>

            <button onClick={handleResetAndClose} className="submit-primary-btn full-width-btn">
              Done & Return to Homepage
            </button>
          </div>
        ) : (
          /* FORM SCREEN */
          <>
            <div className="modal-header">
              <div className="admin-badge-icon booking-icon-badge">
                <Plane size={26} />
              </div>
              <h2 className="modal-title">Book Tour Package</h2>
              <p className="modal-subtitle">
                Reserve your dream destination with Dr. Khan Travel & Tours. Instant booking confirmation & 24/7 dedicated support.
              </p>
            </div>

            {error && (
              <div className="alert-box error-alert">
                <AlertCircle size={18} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form booking-form-grid">
              {/* Tour Package Selection */}
              <div className="form-group full-grid-col">
                <label className="form-label">Select Travel Package</label>
                <div className="input-input-wrap">
                  <Plane className="input-icon" size={18} />
                  <select
                    value={tourId}
                    onChange={(e) => setTourId(e.target.value)}
                    className="form-input form-select"
                    required
                  >
                    {toursList.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} - ${t.price.toLocaleString()} / person ({t.destination})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-input-wrap">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Raza"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-input-wrap">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmad@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number (WhatsApp)</label>
                <div className="input-input-wrap">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="form-group">
                <label className="form-label">Travelers Count</label>
                <div className="input-input-wrap">
                  <Users className="input-icon" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div className="form-group">
                <label className="form-label">Preferred Travel Date</label>
                <div className="input-input-wrap">
                  <Calendar className="input-icon" size={18} />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="form-group full-grid-col">
                <label className="form-label">Special Requests / Preferences (Optional)</label>
                <div className="input-input-wrap">
                  <FileText className="input-icon" size={18} style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }} />
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Wheelchair assistance, dietary preferences, room arrangements, etc."
                    className="form-input form-textarea"
                  />
                </div>
              </div>

              {/* Price Calculation Summary Bar */}
              <div className="price-summary-box full-grid-col">
                <div className="summary-left">
                  <span className="summary-lbl">Price per traveler: <strong>${tourPrice.toLocaleString()}</strong></span>
                  <span className="summary-sub">For {travelersCount || 1} traveler(s)</span>
                </div>
                <div className="summary-right">
                  <span className="total-lbl">Total Estimated:</span>
                  <span className="total-val">${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-primary-btn full-grid-col"
              >
                {loading ? (
                  <span className="btn-spinner-wrap">
                    <span className="spinner-dot"></span> Processing Booking...
                  </span>
                ) : (
                  <>
                    <Plane size={18} /> Confirm Travel Booking
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
