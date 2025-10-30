import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Courses.css";
import axios from "axios";

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(
    /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w\-]+)/
  );
  return match ? match[1] : "";
}

const Courses = ({ category }) => {
  const { category: urlCategory } = useParams();
  const currentCategory = category || urlCategory || "all";
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    // Fetch courses from backend only for current category
    const fetchCourses = async () => {
      try {
        let apiCategory = currentCategory;
        if (apiCategory === "all") apiCategory = undefined;
        const res = await axios.get(
          `http://localhost:5000/api/courses${
            apiCategory ? `?category=${apiCategory.toUpperCase()}` : ""
          }`
        );
        setCourses(res.data || []);
        setFilteredCourses(res.data || []);
      } catch (err) {
        setCourses([]);
        setFilteredCourses([]);
      }
    };
    fetchCourses();
  }, [currentCategory]);

  useEffect(() => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          (course.title || course.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (course.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    if (filter !== "all") {
      filtered = filtered.filter(
        (course) => (course.difficulty || "").toLowerCase() === filter
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || a.name).localeCompare(b.title || b.name);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "enrolled":
          return (b.enrolled || 0) - (a.enrolled || 0);
        case "duration":
          // parseInt handles '40 hours' (returns 40)
          return parseInt(a.duration || "0") - parseInt(b.duration || "0");
        default:
          return 0;
      }
    });
    setFilteredCourses(filtered);
  }, [courses, searchTerm, filter, sortBy]);

  const getCategoryTitle = () => {
    switch (currentCategory) {
      case "nism":
      case "NISM":
        return "NISM Series Courses";
      case "forex":
      case "FOREX":
        return "Forex Market Courses";
      case "stock":
      case "STOCK":
        return "Stock Market Courses";
      default:
        return "All Courses";
    }
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-thumbnail">
        <span className="thumbnail-icon">{course.thumbnail}</span>
        <div className="course-badge">{course.price}</div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title || course.name}</h3>
        <p className="course-description">{course.description}</p>
        {/* Video player for NISM series (and only if course.courses_vedio exists) */}
        {currentCategory.toLowerCase() === "nism" &&
          course.courses_vedio &&
          (course.courses_vedio.includes("youtu") ? (
            <div className="course-video">
              <iframe
                width="350"
                height="200"
                src={`https://www.youtube.com/embed/${extractYouTubeId(
                  course.courses_vedio
                )}`}
                title={course.title || course.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="course-video">
              <video width="350" controls>
                <source src={course.courses_vedio} />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        <div className="course-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">{course.duration}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📊</span>
            <span className="meta-text">{course.difficulty}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⭐</span>
            <span className="meta-text">{course.rating}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span className="meta-text">
              {course.enrolled ? course.enrolled.toLocaleString() : ""}
            </span>
          </div>
        </div>
        <div className="course-actions">
          <button className="btn btn-primary">Enroll Now</button>
          <button className="btn btn-secondary">View Details</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>{getCategoryTitle()}</h1>
        <p>
          Discover and enroll in our comprehensive financial education courses
        </p>
      </div>

      {/* Filters and Search */}
      <div className="courses-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="enrolled">Sort by Enrollments</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
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
          </div>
        )}
      </div>

      {/* Course Stats */}
      <div className="course-stats">
        <div className="stat-item">
          <div className="stat-number">{courses.length}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {courses
              .reduce((sum, course) => sum + (course.enrolled || 0), 0)
              .toLocaleString()}
          </div>
          <div className="stat-label">Total Enrollments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {(
              courses.reduce((sum, course) => sum + (course.rating || 0), 0) /
              courses.length
            ).toFixed(1)}
          </div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
