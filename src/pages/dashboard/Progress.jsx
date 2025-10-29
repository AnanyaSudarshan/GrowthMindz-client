import React from "react";
import "./Progress.css";

function Progress() {
  return (
    <div className="progress-page">
      <div className="page-header">
        <h1 className="page-title">My Progress</h1>
        <p className="page-subtitle">Track your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">15</div>
            <div className="stat-title">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">42h</div>
            <div className="stat-title">Total Time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">5</div>
            <div className="stat-title">Certificates</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-value">72%</div>
            <div className="stat-title">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Learning Progress</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[65, 80, 45, 90, 70, 85, 95].map((height, i) => (
                <div key={i} className="bar" style={{height: `${height}%`}}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {[1,2,3,4,5,6].map((a) => (
            <div key={a} className="achievement-card">
              <div className="achievement-icon">🏅</div>
              <h4>Achievement {a}</h4>
              <p>Completed 5 courses</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div className="course-progress-section">
        <h2>Course Progress</h2>
        <div className="course-list">
          <div className="course-progress-item">
            <span className="course-name">Technical Analysis for Forex</span>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: "65%"}}></div>
              </div>
              <span className="progress-percent">65%</span>
            </div>
          </div>
          <div className="course-progress-item">
            <span className="course-name">Stock Market Basics</span>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: "100%"}}></div>
              </div>
              <span className="progress-percent">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
