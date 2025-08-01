import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportContext } from '../ReportContext';
import '../components/Profile.css';
import { FaSignOutAlt, FaTrash, FaFileMedical, FaCalendarAlt, FaDownload, FaTrashAlt, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { reports, deleteReport } = useContext(ReportContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalHistory: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Get user data from localStorage or use defaults
  // Set default form data and check if we should show the welcome message
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (!savedUser) {
      // If no saved user, show the welcome message and start in edit mode
      setShowWelcomeModal(true);
      setIsEditing(true);

      // Set empty form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        bloodGroup: '',
        emergencyContact: '',
        medicalHistory: ''
      });
    } else {
      // Load saved user data
      setFormData(savedUser);
    }
  }, []);

  // Sort reports by date (newest first)
  const sortedReports = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSaving(true);

    try {
      // Here you would typically make an API call to save the data
      // For now, we'll just save to localStorage
      localStorage.setItem('user', JSON.stringify(formData));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setIsEditing(false);
      setShowWelcomeModal(false); // Close welcome modal after first save

      // Show success message
      alert('Profile saved successfully!');
      console.log('Profile updated:', formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || formData;
    setFormData(savedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Here you would typically call your API to delete the account
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear reports from context
    if (deleteReport) {
      reports.forEach(report => deleteReport(report.id));
    }
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Welcome Modal Component
  const WelcomeModal = () => (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <h2>👋 Welcome to Health Analyzer!</h2>
        <p>Please complete your profile to get started. This information will help us provide better healthcare insights.</p>
        <p>Fields marked with <span className="required">*</span> are required.</p>
        <button
          onClick={() => setShowWelcomeModal(false)}
          className="primary-btn"
        >
          Let's Get Started
        </button>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      {showWelcomeModal && <WelcomeModal />}
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              <FaEdit /> {Object.keys(formData).some(key => formData[key]) ? 'Edit Profile' : 'Complete Profile'}
            </button>
          ) : (
            <button
              onClick={handleCancelEdit}
              className="cancel-btn"
              disabled={isSaving}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={isSaving}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          My Reports ({reports.length})
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' ? (
          <>
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              {isEditing && (
                <button className="change-photo-btn">
                  Change Photo
                </button>
              )}
            </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name *</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="form-control"
              />
            ) : (
              <p className="form-value">{formData.name || 'Not provided'}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email *</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="form-control"
              />
            ) : (
              <p className="form-value">{formData.email || 'Not provided'}</p>
            )}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
                className="form-control"
              />
            ) : (
              <p className="form-value">{formData.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={formData.dob || ''}
                onChange={handleInputChange}
                className="form-control"
                max={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <p className="form-value">{formData.dob ? new Date(formData.dob).toLocaleDateString() : 'Not provided'}</p>
            )}
          </div>

          <div className="form-group">
            <label>Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <p className="form-value">{formData.gender || 'Not provided'}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>Blood Group</label>
            {isEditing ? (
              <select
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="form-value">{formData.bloodGroup || 'Not provided'}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleTextareaChange}
                placeholder="Enter your address"
                rows="3"
                className="form-control"
              />
            ) : (
              <p className="form-value">{formData.address || 'Not provided'}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>Emergency Contact</label>
            {isEditing ? (
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact || ''}
                onChange={handleInputChange}
                placeholder="Name and phone number"
                className="form-control"
              />
            ) : (
              <p className="form-value">{formData.emergencyContact || 'Not provided'}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>Medical History</label>
            {isEditing ? (
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory || ''}
                onChange={handleTextareaChange}
                placeholder="Any known allergies, conditions, or medical history"
                rows="4"
                className="form-control"
              />
            ) : (
              <p className="form-value">
                {formData.medicalHistory || 'No medical history provided'}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          )}
            </form>
            
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Delete your account and all associated data. This action cannot be undone.</p>
              <button 
                className="delete-account-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FaTrashAlt /> Delete My Account
              </button>
              
              {showDeleteConfirm && (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                  <div className="confirm-buttons">
                    <button 
                      className="cancel-btn"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-delete-btn"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="reports-list">
            {sortedReports.length > 0 ? (
              <div className="reports-grid">
                {sortedReports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className="report-icon">
                      <FaFileMedical />
                    </div>
                    <div className="report-details">
                      <h4>{report.title || 'Medical Report'}</h4>
                      <p className="report-date">
                        <FaCalendarAlt /> {formatDate(report.date)}
                      </p>
                      {report.summary && (
                        <p className="report-summary">
                          {report.summary.length > 150 
                            ? `${report.summary.substring(0, 150)}...` 
                            : report.summary}
                        </p>
                      )}
                    </div>
                    <div className="report-actions">
                      <button 
                        className="view-report-btn"
                        onClick={() => navigate(`/analysis/${report.id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="delete-report-btn"
                        onClick={() => deleteReport(report.id)}
                        title="Delete Report"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reports">
                <p>You don't have any reports yet.</p>
                <button 
                  className="primary-btn"
                  onClick={() => navigate('/analyse')}
                >
                  Analyze a New Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;