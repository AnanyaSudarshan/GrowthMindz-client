import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const stats = [
    {
      title: "Total Courses",
      value: "12",
      icon: "📚",
      color: "#3b82f6",
    },
    {
      title: "Learning Progress",
      value: "68%",
      icon: "📊",
      color: "#10b981",
    },
    {
      title: "Certificates",
      value: "3",
      icon: "🏆",
      color: "#f59e0b",
    },
    {
      title: "Study Hours",
      value: "24h",
      icon: "⏰",
      color: "#8b5cf6",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "course",
      message: "Completed lesson in Technical Analysis for Forex",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "certificate",
      message: "Earned certificate in Stock Market Basics",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "course",
      message: "Started NISM Series V-A: Mutual Fund Distributors",
      time: "2 days ago",
    },
  ];

  const continueLearning = {
    title: "Technical Analysis for Forex",
    category: "Forex Market",
    progress: 65,
    duration: "2h 15m",
    thumbnail: "📈",
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user.firstname || "Student"}! 👋
        </h1>
        <p className="page-subtitle">
          Continue your learning journey and achieve your goals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="section">
        <h2 className="section-title">Continue Learning</h2>
        <div className="continue-learning-card">
          <div className="course-thumbnail-large">
            {continueLearning.thumbnail}
          </div>
          <div className="course-info">
            <div className="course-category">{continueLearning.category}</div>
            <h3 className="course-title">{continueLearning.title}</h3>
            <div className="progress-container">
              <div className="progress-info">
                <span>Progress: {continueLearning.progress}%</span>
                <span>{continueLearning.duration} remaining</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${continueLearning.progress}%` }}
                ></div>
              </div>
            </div>
            <Link to="/dashboard/learning" className="btn btn-primary">
              Continue Learning →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === "course" ? "📖" : "🏆"}
              </div>
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/dashboard/courses/nism" className="quick-action-card">
            <div className="quick-action-icon">📘</div>
            <div className="quick-action-text">Explore NISM Courses</div>
          </Link>
          <Link to="/dashboard/progress" className="quick-action-card">
            <div className="quick-action-icon">📊</div>
            <div className="quick-action-text">View Progress</div>
          </Link>
          <Link to="/dashboard/profile" className="quick-action-card">
            <div className="quick-action-icon">👤</div>
            <div className="quick-action-text">Edit Profile</div>
          </Link>
          <Link to="/dashboard/learning" className="quick-action-card">
            <div className="quick-action-icon">📚</div>
            <div className="quick-action-text">My Courses</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
