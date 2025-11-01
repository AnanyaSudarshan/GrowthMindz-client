import React, { useEffect, useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import "./ProductPage.css";

function GOAT() {
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Google Drive video embed URL
  // IMPORTANT: Make sure the video is shared as "Anyone with the link can view" in Google Drive
  const fileId = "1lFLJouhuehfGwm2J_QbC-XkD1Mg7BshD";
  const videoUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  useEffect(() => {
    // Auto-hide overlay after a moment to allow video to load
    const timer = setTimeout(() => {
      setShowPlayOverlay(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayClick = () => {
    setShowPlayOverlay(false);
    // Reload iframe with autoplay attempt
    if (iframeRef.current) {
      iframeRef.current.src = `${videoUrl}?autoplay=1`;
    }
  };

  return (
    <div className="product-page product-page--center">
      {/* Video Player Section - Above GOAT Card */}
      <div className="video-container" ref={containerRef}>
        <iframe
          ref={iframeRef}
          src={videoUrl}
          className="product-video-iframe"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          title="GOAT Product Video"
        ></iframe>
        {showPlayOverlay && (
          <div className="video-play-overlay" onClick={handlePlayClick}>
            <div className="play-button-large">▶</div>
            <p className="play-text">Click to Play Video</p>
          </div>
        )}
      </div>

      {/* GOAT Card */}
      <div className="product-card product-card--premium">
        <div className="product-card__banner-gradient">
          <div className="product-card__icon-container">
            <BookOpen className="product-card__icon-cyan" />
          </div>
        </div>
        <div className="product-card__content">
          <div className="product-card__tag">GOAT</div>
          <h2 className="product-card__title">GOAT</h2>
          <p className="product-card__subtitle product-card__subtitle--bronze">
            Accelerate your Investments the GOAT way
          </p>
        </div>
        <div className="product-card__footer">
          <button className="buy-btn buy-btn--purple">Buy</button>
          <button className="explore-btn">Explore More</button>
        </div>
      </div>
    </div>
  );
}

export default GOAT;
