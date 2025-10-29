import React, { useState } from "react";
import axios from "axios";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    smsNotifications: false,

    // Privacy Settings
    profileVisibility: "public",
    showProgress: true,

    // Preferences
    language: "en",
    theme: "light",
    timezone: "UTC+5:30",

    // Password change
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (settings.newPassword !== settings.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (settings.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (!settings.currentPassword) {
      alert("Please enter your current password");
      return;
    }

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("User not found. Please login again.");
        return;
      }

      const user = JSON.parse(userData);

      // Prepare data for API call
      const passwordData = {
        id: user.id,
        currentPassword: settings.currentPassword,
        newPassword: settings.newPassword,
      };

      // Make API call to change password
      const response = await axios.put(
        "http://localhost:5000/api/change-password",
        passwordData
      );

      if (response.data.message === "Password changed successfully") {
        alert("Password changed successfully!");
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("Password change error:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to change password. Please try again.");
      }
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'This will permanently delete all your data. Type "DELETE" to confirm.'
      );
      if (doubleConfirmed) {
        alert("Account deletion requested. Please contact support.");
      }
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  const SettingItem = ({ title, description, children }) => (
    <div className="setting-item">
      <div className="setting-info">
        <h4 className="setting-title">{title}</h4>
        <p className="setting-description">{description}</p>
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-slider"></span>
    </label>
  );

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="settings-section">
              <h2>Account Settings</h2>

              <SettingItem
                title="Email Notifications"
                description="Receive email updates about your courses and account"
              >
                <ToggleSwitch
                  checked={settings.emailNotifications}
                  onChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </SettingItem>

              <SettingItem
                title="SMS Notifications"
                description="Receive SMS updates for important account activities"
              >
                <ToggleSwitch
                  checked={settings.smsNotifications}
                  onChange={(checked) =>
                    handleSettingChange("smsNotifications", checked)
                  }
                />
              </SettingItem>

              <div className="password-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={settings.currentPassword}
                      onChange={(e) =>
                        handleSettingChange("currentPassword", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={settings.newPassword}
                      onChange={(e) =>
                        handleSettingChange("newPassword", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={(e) =>
                        handleSettingChange("confirmPassword", e.target.value)
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>

              <SettingItem
                title="Profile Visibility"
                description="Control who can see your profile information"
              >
                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    handleSettingChange("profileVisibility", e.target.value)
                  }
                  className="setting-select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </SettingItem>

              <SettingItem
                title="Show Progress to Others"
                description="Allow other users to see your learning progress"
              >
                <ToggleSwitch
                  checked={settings.showProgress}
                  onChange={(checked) =>
                    handleSettingChange("showProgress", checked)
                  }
                />
              </SettingItem>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div className="settings-section">
              <h2>Preferences</h2>

              <SettingItem
                title="Language"
                description="Choose your preferred language"
              >
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="setting-select"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </SettingItem>

              <SettingItem
                title="Theme"
                description="Choose your preferred theme"
              >
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </SettingItem>

              <SettingItem title="Timezone" description="Select your timezone">
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSettingChange("timezone", e.target.value)
                  }
                  className="setting-select"
                >
                  <option value="UTC+5:30">UTC+5:30 (IST)</option>
                  <option value="UTC+0:00">UTC+0:00 (GMT)</option>
                  <option value="UTC-5:00">UTC-5:00 (EST)</option>
                  <option value="UTC-8:00">UTC-8:00 (PST)</option>
                </select>
              </SettingItem>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <div className="settings-section">
              <h2>Danger Zone</h2>

              <div className="danger-item">
                <div className="danger-info">
                  <h4>Delete Account</h4>
                  <p>
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
