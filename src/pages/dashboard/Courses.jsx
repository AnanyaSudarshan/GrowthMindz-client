import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Courses.css";

function Courses() {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const courseData = {
    nism: [
      { id: 1, title: "NISM Series I: Currency Derivatives", desc: "Learn currency derivatives trading", duration: "40h", difficulty: "Intermediate", price: "Free", rating: 4.5 },
      { id: 2, title: "NISM Series V-A: Mutual Fund Distributors", desc: "Complete guide to mutual funds", duration: "35h", difficulty: "Beginner", price: "Free", rating: 4.7 },
      { id: 3, title: "NISM Series VIII: Equity Derivatives", desc: "Master equity derivatives", duration: "45h", difficulty: "Advanced", price: "Free", rating: 4.6 },
      { id: 4, title: "NISM Series X-A: Investment Adviser (Level 1)", desc: "Investment advisory fundamentals", duration: "50h", difficulty: "Intermediate", price: "Free", rating: 4.8 },
      { id: 5, title: "NISM Series X-B: Investment Adviser (Level 2)", desc: "Advanced investment strategies", duration: "55h", difficulty: "Advanced", price: "Free", rating: 4.9 },
    ],
    forex: [
      { id: 1, title: "Introduction to Forex Trading", desc: "Get started with forex basics", duration: "20h", difficulty: "Beginner", price: "Free", rating: 4.5 },
      { id: 2, title: "Technical Analysis for Forex", desc: "Master chart patterns and indicators", duration: "30h", difficulty: "Intermediate", price: "Free", rating: 4.7 },
      { id: 3, title: "Forex Trading Strategies", desc: "Learn proven trading strategies", duration: "35h", difficulty: "Intermediate", price: "Free", rating: 4.6 },
      { id: 4, title: "Risk Management in Forex", desc: "Protect your capital", duration: "25h", difficulty: "Intermediate", price: "Free", rating: 4.8 },
      { id: 5, title: "Advanced Forex Trading", desc: "Take your trading to the next level", duration: "40h", difficulty: "Advanced", price: "Free", rating: 4.9 },
    ],
    stock: [
      { id: 1, title: "Stock Market Basics for Beginners", desc: "Start your stock market journey", duration: "30h", difficulty: "Beginner", price: "Free", rating: 4.6 },
      { id: 2, title: "Fundamental Analysis", desc: "Learn to analyze companies", duration: "40h", difficulty: "Intermediate", price: "Free", rating: 4.7 },
      { id: 3, title: "Technical Analysis Masterclass", desc: "Comprehensive technical analysis", duration: "50h", difficulty: "Intermediate", price: "Free", rating: 4.8 },
      { id: 4, title: "Options Trading", desc: "Master options strategies", duration: "45h", difficulty: "Advanced", price: "Free", rating: 4.9 },
      { id: 5, title: "Intraday Trading Strategies", desc: "Trade the markets daily", duration: "35h", difficulty: "Advanced", price: "Free", rating: 4.7 },
    ],
  };

  const courses = courseData[category] || [];
  const categoryName = category === "nism" ? "NISM Series" : category === "forex" ? "Forex Market" : "Stock Market";

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "⭐" : "");
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1 className="page-title">{categoryName}</h1>
        <p className="page-subtitle">Explore our comprehensive {categoryName.toLowerCase()} courses</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Course Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-thumbnail">
              {category === "nism" ? "📘" : category === "forex" ? "💰" : "📊"}
            </div>
            <div className="course-content">
              <span className="course-category">{categoryName}</span>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.desc}</p>
              
              <div className="course-meta">
                <span className="course-duration">⏱️ {course.duration}</span>
                <span className={`course-difficulty ${course.difficulty.toLowerCase()}`}>
                  {course.difficulty}
                </span>
              </div>

              <div className="course-rating">
                <span className="stars">{renderStars(course.rating)}</span>
                <span className="rating-value">({course.rating})</span>
              </div>

              <div className="course-footer">
                <span className="course-price">{course.price}</span>
                <button className="btn btn-primary">Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-results">
          <p>No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default Courses;
