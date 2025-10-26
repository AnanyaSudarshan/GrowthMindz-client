import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleOAuth from "../components/GoogleOAuth";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.message === "Login successful") {
        alert("Login successful!");
        // Store user data in localStorage or context
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Redirect to dashboard or home page
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    setIsGoogleLoading(false);
    alert(`Welcome back, ${user.name}!`);
    // In real app, redirect to dashboard
  };

  const handleGoogleError = (error) => {
    setIsGoogleLoading(false);
    setErrors({ general: "Google sign-in failed. Please try again." });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div
            className="auth-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-icon">🧠</div>
            <h1>GrowthMindz</h1>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue learning</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <GoogleOAuth
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            isLoading={isGoogleLoading}
            disabled={isLoading}
          >
            Continue with Google
          </GoogleOAuth>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
