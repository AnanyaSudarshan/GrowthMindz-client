import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

function MyLearning() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState([]);

  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem('gm:progress')) || { courses: {} }; } catch { return { courses: {} }; }
  };
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  useEffect(() => {
    const progress = loadProgress();
    const nism = progress.courses?.nism || {};
    const list = Object.values(nism);
    const seconds = list.reduce((s, v) => s + (v.seconds || 0), 0);
    const duration = list.reduce((s, v) => s + (v.duration || 0), 0);
    const percent = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : 0;

    const items = [];
    if (list.length > 0) {
      items.push({
        id: "nism",
        title: "NISM Series",
        category: "NISM",
        progress: percent,
        thumbnail: "📘",
        timeSpent: formatTime(seconds),
      });
    }
    setCourses(items);
  }, []);

  const filteredCourses = useMemo(() => {
    if (filter === "all") return courses;
    if (filter === "completed") return courses.filter(c => c.progress === 100);
    if (filter === "in-progress") return courses.filter(c => c.progress < 100);
    return courses;
  }, [courses, filter]);

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1 className="page-title">My Learning</h1>
        <p className="page-subtitle">Continue your enrolled courses</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Courses
        </button>
        <button 
          className={`filter-btn ${filter === "in-progress" ? "active" : ""}`}
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </button>
        <button 
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Course Grid */}
      <div className="courses-grid">
        {filteredCourses.length ? filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-thumbnail">{course.thumbnail}</div>
            <div className="course-content">
              <span className="course-category">{course.category}</span>
              <h3 className="course-title">{course.title}</h3>
              <div className="course-progress">
                <div className="progress-info">
                  <span>Progress: {course.progress}%</span>
                  <span>{course.timeSpent}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${course.progress}%`}}></div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/courses/nism')}>Continue Learning →</button>
            </div>
          </div>
        )) : (
          <div className="no-courses">
            <div className="no-courses-icon">📚</div>
            <h3>No learning yet</h3>
            <p>Start by enrolling in a course</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearning;
