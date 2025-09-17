import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'Moppie Admin',
    language: 'english',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });
  
  const { showNotification } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = (section) => {
    // Simulate API call
    setTimeout(() => {
      showNotification(`${section} settings updated successfully!`, 'success');
    }, 500);
  };

  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    
    if (settings.newPassword.length < 8) {
      showNotification('Password must be at least 8 characters', 'error');
      return;
    }
    
    showNotification('Password changed successfully!', 'success');
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const toggleTwoFactor = () => {
    const newValue = !settings.twoFactorEnabled;
    setSettings(prev => ({
      ...prev,
      twoFactorEnabled: newValue
    }));
    
    showNotification(
      `Two-factor authentication ${newValue ? 'enabled' : 'disabled'}`,
      'success'
    );
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="settings-group">
        <h3 className="settings-group-title">🏢 Application Settings</h3>
        
        <div className="form-group">
          <label className="form-label">App Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.appName}
            onChange={(e) => handleInputChange('appName', e.target.value)}
            placeholder="Enter application name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            className="form-select"
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
          >
            <option value="english">English</option>
            <option value="dutch">Dutch</option>
            <option value="german">German</option>
            <option value="french">French</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Theme</label>
          <div className="theme-toggle">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              ☀️ Light
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleSaveSettings('General')}
        >
          💾 Save General Settings
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="settings-group">
        <h3 className="settings-group-title">🔔 Notification Preferences</h3>
        
        <div className="toggle-group">
          <div className="toggle-item">
            <div className="toggle-content">
              <h4 className="toggle-label">Email Notifications</h4>
              <p className="toggle-description">Receive notifications via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-content">
              <h4 className="toggle-label">Push Notifications</h4>
              <p className="toggle-description">Receive browser push notifications</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-types">
          <h4 className="notification-types-title">Notification Types</h4>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-label">New bookings</span>
            </label>
            <label className="checkbox-item">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-label">Payment updates</span>
            </label>
            <label className="checkbox-item">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-label">Staff updates</span>
            </label>
            <label className="checkbox-item">
              <input type="checkbox" />
              <span className="checkbox-label">System maintenance</span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleSaveSettings('Notification')}
        >
          💾 Save Notification Settings
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="settings-group">
        <h3 className="settings-group-title">🔒 Security Settings</h3>
        
        <div className="password-section">
          <h4 className="password-title">Change Password</h4>
          <div className="password-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={settings.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={settings.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={settings.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handlePasswordChange}
            >
              🔑 Change Password
            </button>
          </div>
        </div>

        <div className="two-factor-section">
          <div className="two-factor-item">
            <div className="two-factor-content">
              <h4 className="two-factor-label">Two-Factor Authentication</h4>
              <p className="two-factor-description">
                Add an extra layer of security to your account
              </p>
              <div className="two-factor-status">
                Status: <span className={`status-badge ${settings.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                  {settings.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}
                </span>
              </div>
            </div>
            <button
              className={`btn ${settings.twoFactorEnabled ? 'btn-danger' : 'btn-success'}`}
              onClick={toggleTwoFactor}
            >
              {settings.twoFactorEnabled ? '🔓 Disable 2FA' : '🔒 Enable 2FA'}
            </button>
          </div>
        </div>

        <div className="security-info">
          <h4 className="security-info-title">🛡️ Security Information</h4>
          <div className="security-stats">
            <div className="security-stat">
              <span className="stat-label">Last Login:</span>
              <span className="stat-value">Today, 2:30 PM</span>
            </div>
            <div className="security-stat">
              <span className="stat-label">Login Location:</span>
              <span className="stat-value">Amsterdam, Netherlands</span>
            </div>
            <div className="security-stat">
              <span className="stat-label">Account Created:</span>
              <span className="stat-value">January 15, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleSaveSettings('Security')}
        >
          💾 Save Security Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-description">Manage your account settings, preferences, and system configuration</p>
      </div>

      <div className="settings-container">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          <div className="settings-card">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;