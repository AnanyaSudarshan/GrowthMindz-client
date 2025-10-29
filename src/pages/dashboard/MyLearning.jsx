import React, { useState } from "react";
import "./Courses.css";

function MyLearning() {
  const [filter, setFilter] = useState("all");
  
  const courses = [
    { id: 1, title: "Technical Analysis for Forex", category: "Forex", progress: 65, thumbnail: "📈", timeSpent: "4h 30m" },
    { id: 2, title: "Stock Market Basics", category: "Stock", progress: 100, thumbnail: "📊", timeSpent: "8h 15m" },
    { id: 3, title: "NISM Series V-A", category: "NISM", progress: 30, thumbnail: "📘", timeSpent: "2h 20m" },
  ];

  const filteredCourses = filter === "all" 
    ? courses 
    : filter === "completed" 
    ? courses.filter(c => c.progress === 100)
    : courses.filter(c => c.progress < 100);

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
        {filteredCourses.map((course) => (
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
              <button className="btn btn-primary">Continue Learning →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyLearning;
