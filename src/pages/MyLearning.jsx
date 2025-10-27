import React, { useState, useEffect } from "react";
import "./MyLearning.css";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate enrolled courses data
    const enrolledCourses = [
      {
        id: 1,
        title: "Stock Market Basics for Beginners",
        category: "Stock Market",
        progress: 75,
        timeSpent: "18 hours",
        totalDuration: "25 hours",
        lastAccessed: "2 hours ago",
        thumbnail: "📈",
        difficulty: "Beginner",
        nextLesson: "Understanding Market Trends",
        enrolledDate: "2024-01-15",
      },
      {
        id: 2,
        title: "Technical Analysis Masterclass",
        category: "Stock Market",
        progress: 45,
        timeSpent: "12 hours",
        totalDuration: "40 hours",
        lastAccessed: "1 day ago",
        thumbnail: "📊",
        difficulty: "Intermediate",
        nextLesson: "Support and Resistance Levels",
        enrolledDate: "2024-01-20",
      },
      {
        id: 3,
        title: "NISM Series I: Currency Derivatives",
        category: "NISM Series",
        progress: 100,
        timeSpent: "40 hours",
        totalDuration: "40 hours",
        lastAccessed: "3 days ago",
        thumbnail: "💱",
        difficulty: "Intermediate",
        nextLesson: "Course Completed",
        enrolledDate: "2024-01-10",
      },
      {
        id: 4,
        title: "Introduction to Forex Trading",
        category: "Forex Market",
        progress: 30,
        timeSpent: "6 hours",
        totalDuration: "20 hours",
        lastAccessed: "5 days ago",
        thumbnail: "🌍",
        difficulty: "Beginner",
        nextLesson: "Currency Pairs and Exchange Rates",
        enrolledDate: "2024-01-25",
      },
      {
        id: 5,
        title: "Fundamental Analysis",
        category: "Stock Market",
        progress: 60,
        timeSpent: "21 hours",
        totalDuration: "35 hours",
        lastAccessed: "1 week ago",
        thumbnail: "📊",
        difficulty: "Intermediate",
        nextLesson: "Financial Statement Analysis",
        enrolledDate: "2024-01-18",
      },
      {
        id: 6,
        title: "Risk Management in Forex",
        category: "Forex Market",
        progress: 0,
        timeSpent: "0 hours",
        totalDuration: "25 hours",
        lastAccessed: "Never",
        thumbnail: "🛡️",
        difficulty: "Intermediate",
        nextLesson: "Introduction to Risk Management",
        enrolledDate: "2024-02-01",
      },
    ];
    setCourses(enrolledCourses);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "in-progress" &&
        course.progress > 0 &&
        course.progress < 100) ||
      (filter === "completed" && course.progress === 100) ||
      (filter === "not-started" && course.progress === 0);

    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getProgressColor = (progress) => {
    if (progress === 100) return "#10b981";
    if (progress >= 50) return "#3b82f6";
    if (progress > 0) return "#f59e0b";
    return "#6b7280";
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-header">
        <div className="course-thumbnail">
          <span className="thumbnail-icon">{course.thumbnail}</span>
        </div>
        <div className="course-info">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-category">{course.category}</p>
          <div className="course-meta">
            <span className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span className="meta-text">
                {course.timeSpent} / {course.totalDuration}
              </span>
            </span>
            <span className="meta-item">
              <span className="meta-icon">📊</span>
              <span className="meta-text">{course.difficulty}</span>
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">
                Enrolled {new Date(course.enrolledDate).toLocaleDateString()}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="course-progress">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{course.progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${course.progress}%`,
              backgroundColor: getProgressColor(course.progress),
            }}
          ></div>
        </div>
      </div>

      <div className="course-content">
        <div className="next-lesson">
          <strong>Next:</strong> {course.nextLesson}
        </div>
        <div className="last-accessed">
          <span className="meta-icon">🕒</span>
          <span className="meta-text">Last accessed {course.lastAccessed}</span>
        </div>
      </div>

      <div className="course-actions">
        {course.progress === 100 ? (
          <button className="btn btn-success">
            <span className="btn-icon">🏆</span>
            View Certificate
          </button>
        ) : (
          <button className="btn btn-primary">
            <span className="btn-icon">▶️</span>
            Continue Learning
          </button>
        )}
        <button className="btn btn-secondary">
          <span className="btn-icon">📖</span>
          Course Details
        </button>
      </div>
    </div>
  );

  const getFilterStats = () => {
    const total = courses.length;
    const inProgress = courses.filter(
      (c) => c.progress > 0 && c.progress < 100
    ).length;
    const completed = courses.filter((c) => c.progress === 100).length;
    const notStarted = courses.filter((c) => c.progress === 0).length;

    return { total, inProgress, completed, notStarted };
  };

  const stats = getFilterStats();

  return (
    <div className="my-learning-page">
      <div className="learning-header">
        <h1>My Learning</h1>
        <p>Track your progress and continue your learning journey</p>
      </div>

      {/* Learning Stats */}
      <div className="learning-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">
              {courses.reduce(
                (sum, course) => sum + parseInt(course.timeSpent),
                0
              )}
            </div>
            <div className="stat-label">Total Hours</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="learning-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </button>
          <button
            className={`filter-tab ${filter === "in-progress" ? "active" : ""}`}
            onClick={() => setFilter("in-progress")}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            className={`filter-tab ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({stats.completed})
          </button>
          <button
            className={`filter-tab ${filter === "not-started" ? "active" : ""}`}
            onClick={() => setFilter("not-started")}
          >
            Not Started ({stats.notStarted})
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="no-courses">
            <div className="no-courses-icon">📚</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="btn btn-primary">Browse Courses</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
