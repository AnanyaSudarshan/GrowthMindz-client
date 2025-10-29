import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCoursesDropdown = () => {
    setCoursesDropdownOpen(!coursesDropdownOpen);
  };

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/dashboard/profile", icon: "👤", label: "Profile" },
    { path: "/dashboard/settings", icon: "⚙️", label: "Settings" },
    { path: "/dashboard/learning", icon: "📚", label: "My Learning" },
    { path: "/dashboard/progress", icon: "📊", label: "Progress" },
  ];

  const courseCategories = [
    { path: "/dashboard/courses/nism", label: "NISM Series" },
    { path: "/dashboard/courses/forex", label: "Forex Market" },
    { path: "/dashboard/courses/stock", label: "Stock Market" },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/learning")) return "My Learning";
    if (path.includes("/progress")) return "Progress";
    if (path.includes("/courses")) {
      if (path.includes("/nism")) return "NISM Series";
      if (path.includes("/forex")) return "Forex Market";
      if (path.includes("/stock")) return "Stock Market";
      return "Courses";
    }
    return "Dashboard";
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"} ${mobileMenuOpen ? "open" : ""}`}>
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
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Courses Dropdown */}
            <li className="nav-item dropdown">
              <div
                className={`nav-link dropdown-toggle ${isActive("/dashboard/courses") ? "active" : ""}`}
                onClick={toggleCoursesDropdown}
              >
                <span className="nav-icon">📖</span>
                <span className="nav-label">Courses</span>
                <span className={`dropdown-arrow ${coursesDropdownOpen ? "open" : ""}`}>
                  ▼
                </span>
              </div>
              {coursesDropdownOpen && (
                <ul className="dropdown-menu">
                  {courseCategories.map((category) => (
                    <li key={category.path}>
                      <Link
                        to={category.path}
                        className={`dropdown-link ${
                          location.pathname === category.path ? "active" : ""
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="nav-divider"></li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.firstname?.[0]?.toUpperCase() || user.first_name?.[0]?.toUpperCase() || "U"}
              {user.lastname?.[0]?.toUpperCase() || user.last_name?.[0]?.toUpperCase() || ""}
            </div>
            <div className="user-details">
              <div className="user-name">
                {user.firstname || user.first_name} {user.lastname || user.last_name}
              </div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay active" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>
            <div className="user-greeting">
              Welcome, {user.firstname || user.first_name}!
            </div>
          </div>
        </header>

        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;