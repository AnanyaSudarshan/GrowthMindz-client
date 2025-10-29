import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Clock, Star, BookOpen, Loader2 } from "lucide-react";
import "./ProductPage.css";

const API_BASE_URL = "http://localhost:5000/api"; // Easily changeable endpoint

function ProductPage() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [courseData, setCourseData] = useState({
    videoUrl: "",
    courseImage: "",
    courseTitle: "Flexible Course Name",
    description: "A comprehensive course description that highlights the value and learning outcomes of this course.",
    duration: "40h",
    difficulty: "Intermediate",
    rating: 4.5,
    price: "Free", // or "₹999"
  });

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // Fetch course data from backend - developer can change this endpoint
      const response = await axios.get(`${API_BASE_URL}/course/product`);
      
      if (response.data) {
        setCourseData({
          videoUrl: response.data.videoUrl || "",
          courseImage: response.data.courseImage || "",
          courseTitle: response.data.courseTitle || courseData.courseTitle,
          description: response.data.description || courseData.description,
          duration: response.data.duration || courseData.duration,
          difficulty: response.data.difficulty || courseData.difficulty,
          rating: response.data.rating || courseData.rating,
          price: response.data.price !== undefined ? response.data.price : courseData.price,
        });
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      // On error, keep default values (already set in state)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !courseData.videoUrl) return;

    const handleLoadedMetadata = () => {
      setVideoLoading(false);
      // Autoplay when video is ready (muted for browser compatibility)
      video.play().catch((err) => {
        console.log("Autoplay prevented:", err);
      });
    };

    const handleError = () => {
      setVideoLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    // Update video source when URL changes
    if (courseData.videoUrl) {
      video.load();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, [courseData.videoUrl]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="pp-stars">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="pp-star pp-star--full" size={16} fill="#f59e0b" />
        ))}
        {hasHalfStar && (
          <Star key="half" className="pp-star pp-star--half" size={16} fill="#f59e0b" style={{ opacity: 0.5 }} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="pp-star pp-star--empty" size={16} />
        ))}
        <span className="pp-star-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getDifficultyClass = (difficulty) => {
    const lower = difficulty.toLowerCase();
    if (lower.includes("beginner")) return "beginner";
    if (lower.includes("advanced")) return "advanced";
    return "intermediate";
  };

  return (
    <div className="product-page">
      {/* Video Section */}
      {courseData.videoUrl && (
        <section className="pp-video-section">
          <div className="pp-video-wrapper">
            {videoLoading && (
              <div className="pp-video-loading">
                <Loader2 className="pp-spinner" size={32} />
              </div>
            )}
            <video
              ref={videoRef}
              className="pp-video"
              controls
              playsInline
              preload="metadata"
              muted
              style={{ display: !videoLoading ? "block" : "none" }}
            >
              <source src={courseData.videoUrl} type="video/mp4" />
              <source src={courseData.videoUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      )}

      {/* Course Information Card */}
      <section className="pp-info-section">
        <div className="pp-info-card">
          {/* Course Image/Thumbnail */}
          <div className="pp-image-container">
            {courseData.courseImage ? (
              <img
                src={courseData.courseImage}
                alt={courseData.courseTitle}
                className="pp-course-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="pp-image-placeholder"
              style={{ display: courseData.courseImage ? "none" : "flex" }}
            >
              <BookOpen size={48} className="pp-book-icon" />
            </div>
          </div>

          {/* GOAT Text */}
          <div className="pp-series">GOAT</div>

          {/* Course Title */}
          <h1 className="pp-title">{courseData.courseTitle}</h1>

          {/* Course Description */}
          <p className="pp-description">{courseData.description}</p>

          {/* Meta Information Row */}
          <div className="pp-meta-row">
            <div className="pp-meta-item">
              <Clock size={18} className="pp-meta-icon" />
              <span className="pp-meta-text">{courseData.duration}</span>
            </div>
            <div className={`pp-difficulty-badge pp-difficulty--${getDifficultyClass(courseData.difficulty)}`}>
              {courseData.difficulty}
            </div>
            <div className="pp-rating-container">{renderStars(courseData.rating)}</div>
          </div>

          {/* Divider */}
          <div className="pp-divider"></div>

          {/* Price and Buttons Row */}
          <div className="pp-action-row">
            <div className="pp-price">{courseData.price}</div>
            <div className="pp-buttons">
              <button className="pp-btn pp-btn--enroll">Enroll Now</button>
              <button className="pp-btn pp-btn--buy">Buy</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;

