import React, { useState, useEffect } from "react";
import "./Progress.css";

const Progress = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [progressData, setProgressData] = useState({
    overallProgress: 68,
    totalHours: 156,
    streak: 12,
    certificates: 3,
    coursesCompleted: 3,
    coursesInProgress: 4,
  });

  const [learningData, setLearningData] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Simulate data based on timeframe
    const generateLearningData = (timeframe) => {
      const data = [];
      const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365;

      for (let i = 0; i < days; i++) {
        data.push({
          date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000),
          hours: Math.floor(Math.random() * 4) + 1,
          lessons: Math.floor(Math.random() * 5) + 1,
        });
      }
      return data;
    };

    setLearningData(generateLearningData(timeframe));

    // Course progress data
    setCourseProgress([
      { name: "Stock Market Basics", progress: 75, hours: 18, totalHours: 25 },
      { name: "Technical Analysis", progress: 45, hours: 12, totalHours: 40 },
      { name: "NISM Series I", progress: 100, hours: 40, totalHours: 40 },
      { name: "Forex Trading", progress: 30, hours: 6, totalHours: 20 },
      { name: "Fundamental Analysis", progress: 60, hours: 21, totalHours: 35 },
    ]);

    // Achievements data
    setAchievements([
      {
        id: 1,
        title: "First Course Completed",
        description: "Completed your first course",
        icon: "🎓",
        earned: true,
        date: "2024-01-15",
      },
      {
        id: 2,
        title: "Week Warrior",
        description: "Studied for 7 consecutive days",
        icon: "🔥",
        earned: true,
        date: "2024-01-20",
      },
      {
        id: 3,
        title: "NISM Certified",
        description: "Completed NISM Series I certification",
        icon: "🏆",
        earned: true,
        date: "2024-01-25",
      },
      {
        id: 4,
        title: "100 Hours",
        description: "Reached 100 study hours",
        icon: "⏰",
        earned: true,
        date: "2024-02-01",
      },
      {
        id: 5,
        title: "Perfect Week",
        description: "Study every day for a week",
        icon: "⭐",
        earned: false,
        date: null,
      },
      {
        id: 6,
        title: "Course Master",
        description: "Complete 10 courses",
        icon: "🎯",
        earned: false,
        date: null,
      },
    ]);
  }, [timeframe]);

  const getTotalHours = () => {
    return learningData.reduce((sum, day) => sum + day.hours, 0);
  };

  const getAverageHours = () => {
    return learningData.length > 0
      ? (getTotalHours() / learningData.length).toFixed(1)
      : 0;
  };

  const getStreakDays = () => {
    let streak = 0;
    for (let i = learningData.length - 1; i >= 0; i--) {
      if (learningData[i].hours > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const ProgressChart = () => {
    const maxHours = Math.max(...learningData.map((d) => d.hours));

    return (
      <div className="progress-chart">
        <div className="chart-header">
          <h3>Learning Activity</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#667eea" }}
              ></div>
              <span>Study Hours</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-bars">
            {learningData.map((day, index) => (
              <div key={index} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(day.hours / maxHours) * 100}%`,
                    backgroundColor: "#667eea",
                  }}
                ></div>
                <div className="chart-label">
                  {timeframe === "week"
                    ? day.date.toLocaleDateString("en-US", { weekday: "short" })
                    : timeframe === "month"
                    ? day.date.getDate()
                    : day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                </div>
                <div className="chart-value">{day.hours}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CourseProgressChart = () => (
    <div className="course-progress-chart">
      <h3>Course Progress</h3>
      <div className="course-progress-list">
        {courseProgress.map((course, index) => (
          <div key={index} className="course-progress-item">
            <div className="course-info">
              <div className="course-name">{course.name}</div>
              <div className="course-hours">
                {course.hours}h / {course.totalHours}h
              </div>
            </div>
            <div className="course-progress-bar">
              <div
                className="course-progress-fill"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="course-percentage">{course.progress}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const AchievementsSection = () => (
    <div className="achievements-section">
      <h3>Achievements & Badges</h3>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${
              achievement.earned ? "earned" : "locked"
            }`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {achievement.earned && (
                <div className="achievement-date">
                  Earned {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Learning Progress</h1>
        <p>Track your learning journey and achievements</p>
      </div>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        <button
          className={`timeframe-btn ${timeframe === "week" ? "active" : ""}`}
          onClick={() => setTimeframe("week")}
        >
          This Week
        </button>
        <button
          className={`timeframe-btn ${timeframe === "month" ? "active" : ""}`}
          onClick={() => setTimeframe("month")}
        >
          This Month
        </button>
        <button
          className={`timeframe-btn ${timeframe === "year" ? "active" : ""}`}
          onClick={() => setTimeframe("year")}
        >
          This Year
        </button>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <div className="overview-value">
              {progressData.overallProgress}%
            </div>
            <div className="overview-label">Overall Progress</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">⏰</div>
          <div className="overview-content">
            <div className="overview-value">{getTotalHours()}</div>
            <div className="overview-label">Total Hours ({timeframe})</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">🔥</div>
          <div className="overview-content">
            <div className="overview-value">{getStreakDays()}</div>
            <div className="overview-label">Day Streak</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">🏆</div>
          <div className="overview-content">
            <div className="overview-value">{progressData.certificates}</div>
            <div className="overview-label">Certificates</div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="progress-charts">
        <div className="chart-section">
          <ProgressChart />
        </div>
        <div className="chart-section">
          <CourseProgressChart />
        </div>
      </div>

      {/* Learning Statistics */}
      <div className="learning-stats">
        <div className="stats-card">
          <h3>Learning Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Average Daily Hours</div>
              <div className="stat-value">{getAverageHours()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Courses Completed</div>
              <div className="stat-value">{progressData.coursesCompleted}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Courses In Progress</div>
              <div className="stat-value">{progressData.coursesInProgress}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Study Hours</div>
              <div className="stat-value">{progressData.totalHours}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <AchievementsSection />

      {/* Upcoming Milestones */}
      <div className="milestones-section">
        <h3>Upcoming Milestones</h3>
        <div className="milestones-list">
          <div className="milestone-item">
            <div className="milestone-icon">🎯</div>
            <div className="milestone-content">
              <h4>Complete 5 Courses</h4>
              <p>2 more courses to go!</p>
              <div className="milestone-progress">
                <div className="milestone-bar">
                  <div
                    className="milestone-fill"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span>3/5</span>
              </div>
            </div>
          </div>
          <div className="milestone-item">
            <div className="milestone-icon">⏰</div>
            <div className="milestone-content">
              <h4>200 Study Hours</h4>
              <p>Keep up the great work!</p>
              <div className="milestone-progress">
                <div className="milestone-bar">
                  <div
                    className="milestone-fill"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span>156/200</span>
              </div>
            </div>
          </div>
          <div className="milestone-item">
            <div className="milestone-icon">🔥</div>
            <div className="milestone-content">
              <h4>30-Day Streak</h4>
              <p>You're on fire!</p>
              <div className="milestone-progress">
                <div className="milestone-bar">
                  <div
                    className="milestone-fill"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <span>12/30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
