import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">GrowthMindz</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/dashboard/profile"
            className={`nav-item ${isActive("/dashboard/profile") ? "active" : ""}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>

          <Link
            to="/dashboard/settings"
            className={`nav-item ${isActive("/dashboard/settings") ? "active" : ""}`}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </Link>

          <Link
            to="/dashboard/learning"
            className={`nav-item ${isActive("/dashboard/learning") ? "active" : ""}`}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">My Learning</span>
          </Link>

          <Link
            to="/dashboard/progress"
            className={`nav-item ${isActive("/dashboard/progress") ? "active" : ""}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Progress</span>
          </Link>

          {/* Courses Dropdown */}
          <div className="nav-item-dropdown">
            <div
              className={`nav-item nav-item-toggle ${
                isActive("/dashboard/courses") ? "active" : ""
              }`}
              onClick={() => setCoursesDropdown(!coursesDropdown)}
            >
              <span className="nav-icon">📖</span>
              <span className="nav-text">Courses</span>
              <span className="dropdown-arrow">
                {coursesDropdown ? "▼" : "▶"}
              </span>
            </div>

            {coursesDropdown && (
              <div className="nav-dropdown-menu">
                <Link
                  to="/dashboard/courses/nism"
                  className="nav-dropdown-item"
                  onClick={() => setCoursesDropdown(false)}
                >
                  NISM Series
                </Link>
                <Link
                  to="/dashboard/courses/forex"
                  className="nav-dropdown-item"
                  onClick={() => setCoursesDropdown(false)}
                >
                  Forex Market
                </Link>
                <Link
                  to="/dashboard/courses/stock"
                  className="nav-dropdown-item"
                  onClick={() => setCoursesDropdown(false)}
                >
                  Stock Market
                </Link>
              </div>
            )}
          </div>

          <div className="nav-divider"></div>

          <div className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.firstname?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <div className="user-name">
                {user.firstname} {user.lastname}
              </div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="topbar">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
          <div className="topbar-right">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <div className="logo">
                  <span className="logo-icon">🧠</span>
                  <span className="logo-text">GrowthMindz</span>
                </div>
                <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                  ✕
                </button>
              </div>
              <nav className="mobile-nav">
                <Link
                  to="/dashboard"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Settings
                </Link>
                <Link
                  to="/dashboard/learning"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📚 My Learning
                </Link>
                <Link
                  to="/dashboard/progress"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Progress
                </Link>
                <div className="mobile-nav-divider"></div>
                <Link
                  to="/dashboard/courses/nism"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📖 NISM Series
                </Link>
                <Link
                  to="/dashboard/courses/forex"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📖 Forex Market
                </Link>
                <Link
                  to="/dashboard/courses/stock"
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📖 Stock Market
                </Link>
                <div className="mobile-nav-divider"></div>
                <div
                  className="mobile-nav-item logout-item"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  🚪 Logout
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
