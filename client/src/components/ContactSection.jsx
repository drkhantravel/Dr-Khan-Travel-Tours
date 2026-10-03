import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Plus, Trash2, Video } from 'lucide-react';

export default function ContactSection({ apiUrl = 'http://localhost:5000' }) {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [workingSkills, setWorkingSkills] = useState('');
  const [phone, setPhone] = useState('');
  
  // Dynamic TikTok Video Links Array
  const [tiktokLinks, setTiktokLinks] = useState(['']);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAddTiktokLink = () => {
    setTiktokLinks(prev => [...prev, '']);
  };

  const handleRemoveTiktokLink = (index) => {
    if (tiktokLinks.length === 1) {
      setTiktokLinks(['']);
    } else {
      setTiktokLinks(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTiktokLinkChange = (index, value) => {
    setTiktokLinks(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          fatherName, 
          cnic, 
          passportNumber, 
          workingSkills, 
          tiktokLinks, 
          phone
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message);
        setName('');
        setFatherName('');
        setCnic('');
        setPassportNumber('');
        setWorkingSkills('');
        setPhone('');
        setTiktokLinks(['']);
      } else {
        setError(data.message || 'Failed to submit form.');
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
        <div className="contact-single-card-container">
          <div className="contact-form-col glass-card">
            <h3 className="form-card-title">Candidate Application Form</h3>

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
              {/* Name & Father Name */}
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M. Arif Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Father Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ghulam Muhammad Khan"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* CNIC & Passport Number */}
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">CNIC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35202-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passport Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PK12345678"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Working Skills & Phone Number */}
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Working Skills *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Driver, Chef, Construction, Sales, Tour Guide"
                    value={workingSkills}
                    onChange={(e) => setWorkingSkills(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Dynamic TikTok Video Links */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Video size={16} style={{ color: '#00f2fe' }} /> TikTok Video Links
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAddTiktokLink}
                    className="add-tiktok-link-btn"
                  >
                    <Plus size={14} /> Add Another Video Link
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {tiktokLinks.map((link, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="url"
                        placeholder={`https://www.tiktok.com/@user/video/... (Link ${idx + 1})`}
                        value={link}
                        onChange={(e) => handleTiktokLinkChange(idx, e.target.value)}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      {tiktokLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTiktokLink(idx)}
                          className="remove-tiktok-link-btn"
                          title="Remove this video link"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-primary-btn full-width-btn">
                {loading ? 'Submitting Application...' : <><Send size={18} /> Submit Candidate Form</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
