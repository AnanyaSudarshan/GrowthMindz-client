import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState([
    { title: "Total Courses", value: "-", icon: "📚", color: "#3b82f6" },
    { title: "Learning Progress", value: "-", icon: "📊", color: "#10b981" },
    { title: "Study Hours", value: "-", icon: "⏰", color: "#8b5cf6" },
  ]);

  const [recentActivity, setRecentActivity] = useState([]);

  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem('gm:progress')) || { courses: {} }; } catch { return { courses: {} }; }
  };
  const loadEnrollments = () => {
    try { return JSON.parse(localStorage.getItem('gm:enrollments')) || {}; } catch { return {}; }
  };
  const timeAgo = (ts) => {
    if (!ts) return "just now";
    const diff = Date.now() - ts;
    const s = Math.max(1, Math.floor(diff / 1000));
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  useEffect(() => {
    const compute = async () => {
      // Total Courses from backend
      let totalCourses = '-';
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        totalCourses = Array.isArray(res.data) ? String(res.data.length) : String((res.data?.length)||0);
      } catch {}

      // Progress and Study Hours from local progress store
      const progress = loadProgress();
      const allCourseMaps = Object.values(progress.courses || {});
      const allVideos = allCourseMaps.flatMap(m => Object.values(m || {}));
      const totalSeconds = allVideos.reduce((s, v) => s + (v.seconds || 0), 0);
      const totalDuration = allVideos.reduce((s, v) => s + (v.duration || 0), 0);
      const percent = totalDuration > 0 ? Math.min(100, Math.round((totalSeconds / totalDuration) * 100)) : 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const studyLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      setStats([
        { title: "Total Courses", value: totalCourses, icon: "📚", color: "#3b82f6" },
        { title: "Learning Progress", value: `${percent}%`, icon: "📊", color: "#10b981" },
        { title: "Study Hours", value: studyLabel, icon: "⏰", color: "#8b5cf6" },
      ]);

      // Recent Activity from progress updates and enrollments
      const enrollments = loadEnrollments();
      const enrollActivities = Object.keys(enrollments).map((key, i) => ({
        id: `enroll-${i}`,
        type: 'enroll',
        message: `Enrolled in ${key.replace('cat:','').replace(/:id:/,' #')}`,
        time: timeAgo(enrollments[key]?.updatedAt || null),
        ts: enrollments[key]?.updatedAt || null,
      }));
      const progressActivities = allVideos
        .map((v, i) => ({
          id: `prog-${i}`,
          type: v.completed ? 'completed' : 'progress',
          message: v.completed ? `Completed: ${v.title || 'Lesson'}` : `Watched: ${v.title || 'Lesson'} (${v.percent||0}%)`,
          time: timeAgo(v.updatedAt),
          ts: v.updatedAt || 0,
        }));
      const all = [...enrollActivities, ...progressActivities]
        .filter(a => a.ts)
        .sort((a,b) => b.ts - a.ts)
        .slice(0, 10)
        .map(({ts, ...rest}) => rest);
      setRecentActivity(all);
    };
    compute();
  }, []);

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

      {/* Continue Learning section removed as requested */}

      {/* Recent Activity */}
      <div className="section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length ? recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === "completed" ? "✅" : activity.type === "progress" ? "📖" : "📝"}
              </div>
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          )) : (
            <div className="activity-item"><div className="activity-content"><p className="activity-message">No recent activity</p></div></div>
          )}
        </div>
      </div>

      {/* Quick Actions removed as requested */}
    </div>
  );
}

export default Dashboard;
