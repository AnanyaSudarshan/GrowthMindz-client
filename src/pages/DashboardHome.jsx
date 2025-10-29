import React, { useState, useEffect } from "react";
import "./DashboardHome.css";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    progressPercentage: 0,
    certificatesEarned: 0,
    studyHours: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    // Simulate data fetching
    setStats({
      totalCourses: 12,
      progressPercentage: 68,
      certificatesEarned: 3,
      studyHours: 24,
    });

    setRecentActivity([
      {
        id: 1,
        action: "Completed lesson",
        course: "Stock Market Basics",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Started course",
        course: "Technical Analysis",
        time: "1 day ago",
      },
      {
        id: 3,
        action: "Earned certificate",
        course: "NISM Series I",
        time: "3 days ago",
      },
      {
        id: 4,
        action: "Quiz completed",
        course: "Forex Trading",
        time: "5 days ago",
      },
    ]);

    setCurrentCourse({
      id: 1,
      title: "Technical Analysis Masterclass",
      progress: 45,
      nextLesson: "Support and Resistance Levels",
      thumbnail: "📈",
    });
  }, []);

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-subtitle">{subtitle}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back!</h1>
        <p>Continue your financial learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          icon="📚"
          title="Total Courses"
          value={stats.totalCourses}
          subtitle="Enrolled"
          color="#3b82f6"
        />
        <StatCard
          icon="📊"
          title="Learning Progress"
          value={`${stats.progressPercentage}%`}
          subtitle="Overall completion"
          color="#10b981"
        />
        <StatCard
          icon="🏆"
          title="Certificates"
          value={stats.certificatesEarned}
          subtitle="Earned"
          color="#f59e0b"
        />
        <StatCard
          icon="⏰"
          title="Study Hours"
          value={stats.studyHours}
          subtitle="This week"
          color="#8b5cf6"
        />
      </div>

      <div className="dashboard-content">
        {/* Continue Learning Section */}
        <div className="continue-learning">
          <h2>Continue Learning</h2>
          {currentCourse ? (
            <div className="course-card">
              <div className="course-thumbnail">{currentCourse.thumbnail}</div>
              <div className="course-info">
                <h3>{currentCourse.title}</h3>
                <p>Next: {currentCourse.nextLesson}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${currentCourse.progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {currentCourse.progress}% Complete
                </div>
                <button className="btn btn-primary">Continue Learning</button>
              </div>
            </div>
          ) : (
            <div className="no-course">
              <p>No active courses. Start learning today!</p>
              <button className="btn btn-primary">Browse Courses</button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.action}</strong> in {activity.course}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">📖</span>
            <span className="action-text">Browse Courses</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-text">View Progress</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🏆</span>
            <span className="action-text">My Certificates</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span className="action-text">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
