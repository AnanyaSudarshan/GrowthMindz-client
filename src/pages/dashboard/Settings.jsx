import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    profileVisibility: "public",
    showProgress: true,
    language: "english",
    theme: theme, // Use theme from context
    timezone: "UTC",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSelect = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    
    // Handle theme change specially
    if (setting === 'theme') {
      if (value === 'dark' && theme === 'light') {
        toggleTheme();
      } else if (value === 'light' && theme === 'dark') {
        toggleTheme();
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }
    
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-toast';
      successMessage.textContent = 'Password changed successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
      // Reset form and close modal
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("User not found. Redirecting to login.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userData);
    try {
      const response = await axios.delete("http://localhost:5000/api/delete-profile", {
        data: { id: user.id },
      });
      if (response.data.message === "Profile deleted successfully") {
        localStorage.removeItem("user");
        alert("Account deleted successfully.");
        navigate("/login");
      } else {
        alert(response.data.message || "Failed to delete account.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting account. Please try again.");
    }
  };

  const closePasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setShowPasswordModal(false);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      {/* Account Settings */}
      <div className="settings-section">
        <h2 className="section-title">Account Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm1-4h-2V7h2v6zm2-8H9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/>
              </svg>
              Change Password
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Email Notifications</h3>
              <p>Receive course updates and notifications via email</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>SMS Notifications</h3>
              <p>Receive important updates via SMS</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="settings-section">
        <h2 className="section-title">Privacy Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Profile Visibility</h3>
              <p>Control who can see your profile</p>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSelect("profileVisibility", e.target.value)}
              className="select-input"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Show Progress to Others</h3>
              <p>Allow others to see your learning progress</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.showProgress}
                onChange={() => handleToggle("showProgress")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="settings-section">
        <h2 className="section-title">Preferences</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Select your preferred language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSelect("language", e.target.value)}
              className="select-input"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Theme</h3>
              <p>Choose your preferred theme</p>
            </div>
            <div className="theme-selector">
              <select
                value={theme}
                onChange={(e) => handleSelect("theme", e.target.value)}
                className="select-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div className="theme-preview">
                <div className={`theme-icon ${isDark ? 'dark' : 'light'}`}>
                  {isDark ? (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Timezone</h3>
              <p>Set your timezone for accurate schedules</p>
            </div>
            <select
              value={settings.timezone}
              onChange={(e) => handleSelect("timezone", e.target.value)}
              className="select-input"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="IST">IST (Indian Standard Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section">
        <h2 className="section-title danger-zone">Danger Zone</h2>
        <div className="settings-card danger-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button className="modal-close" onClick={closePasswordModal}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.currentPassword ? "error" : ""}
                  placeholder="Enter your current password"
                  disabled={isChangingPassword}
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">{passwordErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.newPassword ? "error" : ""}
                  placeholder="Enter your new password"
                  disabled={isChangingPassword}
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword}</span>
                )}
                <div className="password-hint">
                  Password must be at least 8 characters long
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your new password"
                  disabled={isChangingPassword}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-message">{passwordErrors.confirmPassword}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <div className="btn-spinner"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <svg className="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
