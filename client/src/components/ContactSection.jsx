import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactSection({ apiUrl = 'http://localhost:5000' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-grid-container">
          {/* Left Info Column */}
          <div className="contact-info-col">
            <span className="about-pill-badge">Get In Touch</span>
            <h2 className="contact-heading">Plan Your Next Voyage With Us</h2>
            <p className="contact-subtext">
              Have questions about Umrah packages, custom itineraries, or luxury group bookings? Our senior travel consultants are ready to assist.
            </p>

            <div className="contact-methods-list">
              <div className="contact-method-item">
                <div className="method-icon-wrap"><Phone size={20} /></div>
                <div>
                  <h4 className="method-title">Direct Helpline</h4>
                  <p className="method-val">+92 (0) 51 111 222 333 / +92 300 9998877</p>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon-wrap"><Mail size={20} /></div>
                <div>
                  <h4 className="method-title">Email Inquiries</h4>
                  <p className="method-val">info@drkhantravel.com / support@drkhantravel.com</p>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon-wrap"><MapPin size={20} /></div>
                <div>
                  <h4 className="method-title">Headquarters</h4>
                  <p className="method-val">Dr. Khan Tower, Blue Area, F-6/1, Islamabad, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="contact-form-col glass-card">
            <h3 className="form-card-title">Send Us a Direct Message</h3>

            {success && (
              <div className="alert-box success-alert">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="alert-box error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ayesha Siddiqui"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ayesha@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Custom Umrah & Europe Tour Package"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your travel dates, number of guests, budget, and specific destination preferences..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input form-textarea"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-primary-btn full-width-btn">
                {loading ? 'Sending Message...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
