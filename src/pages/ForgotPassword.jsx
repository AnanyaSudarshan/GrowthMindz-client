import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, simulate successful email send
      setIsEmailSent(true)
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Reset email sent again!')
    } catch (error) {
      setErrors({ general: 'Failed to resend email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon">🧠</div>
              <h1>MindsetMovez</h1>
            </div>
            <div className="success-icon">✅</div>
            <h2>Check your email</h2>
            <p>
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="auth-form">
            <div className="email-sent-info">
              <p>
                If you don't see the email in your inbox, check your spam folder.
                The link will expire in 1 hour for security reasons.
              </p>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn--ghost btn--full"
                onClick={handleResendEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Resend email'
                )}
              </button>

              <Link to="/login" className="btn btn--primary btn--full">
                Back to sign in
              </Link>
            </div>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">🧠</div>
            <h1>MindsetMovez</h1>
          </div>
          <h2>Forgot your password?</h2>
          <p>No worries! Enter your email and we'll send you a reset link.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </button>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
