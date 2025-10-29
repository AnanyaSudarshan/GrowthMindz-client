import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Courses.css';

const Courses = ({ category }) => {
  const { category: urlCategory } = useParams();
  const currentCategory = category || urlCategory || 'all';
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const courseData = {
    nism: [
      {
        id: 1,
        title: 'NISM Series I: Currency Derivatives',
        description: 'Learn about currency derivatives trading and risk management.',
        duration: '40 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.8,
        thumbnail: '💱',
        enrolled: 1250
      },
      {
        id: 2,
        title: 'NISM Series V-A: Mutual Fund Distributors',
        description: 'Comprehensive course on mutual fund distribution and regulations.',
        duration: '35 hours',
        difficulty: 'Beginner',
        price: 'Free',
        rating: 4.6,
        thumbnail: '📈',
        enrolled: 2100
      },
      {
        id: 3,
        title: 'NISM Series VIII: Equity Derivatives',
        description: 'Master equity derivatives trading strategies and analysis.',
        duration: '45 hours',
        difficulty: 'Advanced',
        price: 'Free',
        rating: 4.9,
        thumbnail: '📊',
        enrolled: 980
      },
      {
        id: 4,
        title: 'NISM Series X-A: Investment Adviser (Level 1)',
        description: 'Foundation course for investment advisory services.',
        duration: '50 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.7,
        thumbnail: '💼',
        enrolled: 1500
      },
      {
        id: 5,
        title: 'NISM Series X-B: Investment Adviser (Level 2)',
        description: 'Advanced investment advisory and portfolio management.',
        duration: '55 hours',
        difficulty: 'Advanced',
        price: 'Free',
        rating: 4.8,
        thumbnail: '🎯',
        enrolled: 750
      }
    ],
    forex: [
      {
        id: 6,
        title: 'Introduction to Forex Trading',
        description: 'Learn the basics of foreign exchange trading.',
        duration: '20 hours',
        difficulty: 'Beginner',
        price: 'Free',
        rating: 4.5,
        thumbnail: '🌍',
        enrolled: 3200
      },
      {
        id: 7,
        title: 'Technical Analysis for Forex',
        description: 'Master technical analysis techniques for forex markets.',
        duration: '30 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.7,
        thumbnail: '📈',
        enrolled: 1800
      },
      {
        id: 8,
        title: 'Forex Trading Strategies',
        description: 'Learn proven strategies for successful forex trading.',
        duration: '35 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.6,
        thumbnail: '⚡',
        enrolled: 1500
      },
      {
        id: 9,
        title: 'Risk Management in Forex',
        description: 'Essential risk management techniques for forex traders.',
        duration: '25 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.8,
        thumbnail: '🛡️',
        enrolled: 1200
      },
      {
        id: 10,
        title: 'Advanced Forex Trading',
        description: 'Advanced concepts and strategies for experienced traders.',
        duration: '40 hours',
        difficulty: 'Advanced',
        price: 'Free',
        rating: 4.9,
        thumbnail: '🚀',
        enrolled: 800
      }
    ],
    stock: [
      {
        id: 11,
        title: 'Stock Market Basics for Beginners',
        description: 'Complete guide to understanding stock markets.',
        duration: '25 hours',
        difficulty: 'Beginner',
        price: 'Free',
        rating: 4.6,
        thumbnail: '📈',
        enrolled: 4500
      },
      {
        id: 12,
        title: 'Fundamental Analysis',
        description: 'Learn to analyze companies and make informed investment decisions.',
        duration: '35 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.7,
        thumbnail: '📊',
        enrolled: 2200
      },
      {
        id: 13,
        title: 'Technical Analysis Masterclass',
        description: 'Comprehensive technical analysis course for stock trading.',
        duration: '40 hours',
        difficulty: 'Intermediate',
        price: 'Free',
        rating: 4.8,
        thumbnail: '📉',
        enrolled: 1800
      },
      {
        id: 14,
        title: 'Options Trading',
        description: 'Learn options trading strategies and risk management.',
        duration: '30 hours',
        difficulty: 'Advanced',
        price: 'Free',
        rating: 4.9,
        thumbnail: '⚡',
        enrolled: 1200
      },
      {
        id: 15,
        title: 'Intraday Trading Strategies',
        description: 'Master intraday trading techniques and strategies.',
        duration: '25 hours',
        difficulty: 'Advanced',
        price: 'Free',
        rating: 4.7,
        thumbnail: '⚡',
        enrolled: 1600
      }
    ]
  };

  useEffect(() => {
    let allCourses = [];
    if (currentCategory === 'all') {
      allCourses = [...courseData.nism, ...courseData.forex, ...courseData.stock];
    } else {
      allCourses = courseData[currentCategory] || [];
    }
    setCourses(allCourses);
    setFilteredCourses(allCourses);
  }, [currentCategory]);

  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (filter !== 'all') {
      filtered = filtered.filter(course => course.difficulty.toLowerCase() === filter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'enrolled':
          return b.enrolled - a.enrolled;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filter, sortBy]);

  const getCategoryTitle = () => {
    switch (currentCategory) {
      case 'nism': return 'NISM Series Courses';
      case 'forex': return 'Forex Market Courses';
      case 'stock': return 'Stock Market Courses';
      default: return 'All Courses';
    }
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-thumbnail">
        <span className="thumbnail-icon">{course.thumbnail}</span>
        <div className="course-badge">{course.price}</div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
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
            <span className="meta-text">{course.enrolled.toLocaleString()}</span>
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
        <p>Discover and enroll in our comprehensive financial education courses</p>
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
            {courses.reduce((sum, course) => sum + course.enrolled, 0).toLocaleString()}
          </div>
          <div className="stat-label">Total Enrollments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
          </div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
