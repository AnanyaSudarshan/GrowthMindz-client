import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bio: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.first_name || "",
        lastName: parsedUser.last_name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        dateOfBirth: parsedUser.date_of_birth || "",
        bio: parsedUser.bio || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API call
      const updateData = {
        id: user.id,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        dob: formData.dateOfBirth,
        bio: formData.bio,
      };

      // Make API call to update profile
      const response = await axios.put(
        "http://localhost:5000/api/edit-profile",
        updateData
      );

      if (response.data.message === "Profile updated successfully") {
        // Update user data in state and localStorage
        const updatedUser = {
          ...user,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          bio: formData.bio,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);

        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.date_of_birth || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would typically upload the image to a server
      // For now, we'll just show a success message
      alert("Profile picture updated successfully!");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-picture">
            <div className="avatar">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </div>
            <div className="upload-overlay">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
                id="profile-picture-upload"
              />
              <label htmlFor="profile-picture-upload" className="upload-btn">
                📷 Upload Photo
              </label>
            </div>
          </div>
          <div className="profile-info">
            <h2>
              {user.first_name} {user.last_name}
            </h2>
            <p className="email">{user.email}</p>
            <p className="member-since">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Bio / About</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="account-stats">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">12</div>
                <div className="stat-label">Courses Enrolled</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-value">3</div>
                <div className="stat-label">Certificates</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <div className="stat-value">156</div>
                <div className="stat-label">Study Hours</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">68%</div>
                <div className="stat-label">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
