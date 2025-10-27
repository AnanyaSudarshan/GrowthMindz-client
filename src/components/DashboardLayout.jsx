import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/profile", icon: "👤", label: "Profile" },
    { path: "/settings", icon: "⚙", label: "Settings" },
    { path: "/my-learning", icon: "📚", label: "My Learning" },
    { path: "/progress", icon: "📊", label: "Progress" },
  ];

  const courseCategories = [
    { path: "/courses/nism", label: "NISM Series" },
    { path: "/courses/forex", label: "Forex Market" },
    { path: "/courses/stock", label: "Stock Market" },
  ];

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">GrowthMindz</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}

            {/* Courses Dropdown */}
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle">
                <span className="nav-icon">📖</span>
                {isSidebarOpen && <span className="nav-label">Courses</span>}
                {isSidebarOpen && <span className="dropdown-arrow">▼</span>}
              </div>
              {isSidebarOpen && (
                <ul className="dropdown-menu">
                  {courseCategories.map((category) => (
                    <li key={category.path}>
                      <Link
                        to={category.path}
                        className={`dropdown-link ${
                          location.pathname === category.path ? "active" : ""
                        }`}
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </div>
            {isSidebarOpen && (
              <div className="user-details">
                <div className="user-name">
                  {user.first_name} {user.last_name}
                </div>
                <div className="user-email">{user.email}</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <h1 className="page-title">
              {location.pathname
                .split("/")
                .pop()
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-greeting">
              Welcome back, {user.first_name}!
            </div>
          </div>
        </header>

        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
