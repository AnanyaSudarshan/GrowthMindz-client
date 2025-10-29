import React, { useState, useRef } from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.first_name || user.firstname || "",
    lastName: user.last_name || user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    dob: user.dob || "",
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Update localStorage with new data
      const updatedUser = {
        ...user,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        dob: profileData.dob,
        bio: profileData.bio,
        profilePicture: profileData.profilePicture,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      
      // Show success message with better UX
      const successMessage = document.createElement('div');
      successMessage.className = 'success-toast';
      successMessage.textContent = 'Profile updated successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      firstName: user.first_name || user.firstname || "",
      lastName: user.last_name || user.lastname || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: user.dob || "",
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: event.target.result,
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setIsUploading(false);
    }
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and preferences</p>
      </div>

      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-section">
          <div className="profile-picture-container">
            <div 
              className={`profile-picture ${isEditing ? 'editable' : ''}`}
              onClick={handlePhotoClick}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="profile-image"
                />
              ) : (
                <span className="profile-initial">
                  {profileData.firstName?.[0]?.toUpperCase() || profileData.lastName?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              {isUploading && (
                <div className="upload-overlay">
                  <div className="upload-spinner"></div>
                </div>
              )}
              {isEditing && !isUploading && (
                <div className="upload-overlay">
                  <svg className="camera-icon" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            {isEditing && (
              <button 
                className="change-picture-btn"
                onClick={handlePhotoClick}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`${isEditing ? "" : "disabled-input"} ${errors.firstName ? "error" : ""}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`${isEditing ? "" : "disabled-input"} ${errors.lastName ? "error" : ""}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`${isEditing ? "" : "disabled-input"} ${errors.email ? "error" : ""}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "" : "disabled-input"}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={profileData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "" : "disabled-input"}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio / About</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className={isEditing ? "" : "disabled-input"}
              rows="4"
              placeholder="Tell us about yourself, your interests, and what you're learning..."
            ></textarea>
          </div>

          <div className="account-info">
            <div className="info-item">
              <label>Account Created</label>
              <p>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>Active Learner</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="btn btn-primary btn-large"
                onClick={() => setIsEditing(true)}
              >
                <svg className="btn-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <svg className="btn-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
