import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Courses.css";

function extractYouTubeId(url) {
  if (!url) return "";
  const u = String(url);
  const patterns = [
    /(?:youtu.be\/)\s*([\w\-]+)/,
    /youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)([\w\-]+)/,
    /youtube\.com\/shorts\/([\w\-]+)/,
    /m\.youtube\.com\/(?:watch\?v=|shorts\/)([\w\-]+)/,
  ];
  for (const p of patterns) {
    const m = u.match(p);
    if (m && m[1]) return m[1];
  }
  return "";
}

function Courses() {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const ytPlayerRef = useRef(null);
  const ytIntervalRef = useRef(null);
  const html5VideoRef = useRef(null);

  const courseData = {
    nism: [
      { id: 1, title: "NISM Series: Chapter 1", desc: "Start your NISM learning with Chapter 1", duration: "", difficulty: "", price: "Free", rating: 0, videoUrl: "https://youtu.be/2ClP539pTzA", videos: [
        { id: "ch1", title: "NISM Series: Chapter 1", url: "https://youtu.be/2ClP539pTzA" },
      ] },
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

  // LocalStorage progress helpers
  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem('gm:progress')) || { courses: {} }; } catch { return { courses: {} }; }
  };
  const saveProgress = (next) => {
    localStorage.setItem('gm:progress', JSON.stringify(next));
  };
  const updateVideoProgress = ({ courseKey = 'nism', videoId = 'ch1', title, url, seconds, duration }) => {
    const data = loadProgress();
    data.courses[courseKey] = data.courses[courseKey] || {};
    const prev = data.courses[courseKey][videoId] || {};
    const percent = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : (prev.percent || 0);
    const completed = percent >= 95 || prev.completed || false;
    data.courses[courseKey][videoId] = {
      title: title || prev.title || '',
      url: url || prev.url || '',
      seconds: Math.max(seconds || 0, prev.seconds || 0),
      duration: duration || prev.duration || 0,
      percent,
      completed,
      updatedAt: Date.now(),
    };
    saveProgress(data);
  };

  // YouTube Iframe API loader (singleton)
  const loadYouTubeAPI = () => new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const prev = document.getElementById('yt-iframe-api');
    if (!prev) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const check = setInterval(() => {
      if (window.YT && window.YT.Player) { clearInterval(check); resolve(window.YT); }
    }, 200);
  });

  // Derive current video for NISM; fallback to single videoUrl if videos array not provided
  const nismCourse = courseData.nism?.[0] || {};
  const nismVideos = Array.isArray(nismCourse.videos) && nismCourse.videos.length
    ? nismCourse.videos
    : (nismCourse.videoUrl ? [{ id: "ch1", title: nismCourse.title || "Chapter 1", url: nismCourse.videoUrl }] : []);
  const currentVideo = nismVideos[selectedVideoIndex] || null;


  // Setup YouTube player tracking when enrolled
  useEffect(() => {
    if (!isEnrolled || !currentVideo?.url || !/youtu/.test(currentVideo.url)) return;
    let playerElId = isExpanded ? 'nismPlayerModal' : 'nismPlayer';
    let mounted = true;
    loadYouTubeAPI().then((YT) => {
      if (!mounted) return;
      try {
        const player = new YT.Player(playerElId, {
          events: {
            onReady: (e) => {
              // initialize duration if possible
              try {
                const dur = e.target.getDuration ? e.target.getDuration() : 0;
                updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: 0, duration: dur });
              } catch {}
            },
            onStateChange: (ev) => {
              // 0=ENDED,1=PLAYING,2=PAUSED
              if (ev.data === 0) {
                try {
                  const dur = ev.target.getDuration ? ev.target.getDuration() : 0;
                  updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: dur, duration: dur });
                } catch {}
              }
            }
          }
        });
        ytPlayerRef.current = player;
        // polling currentTime periodically
        ytIntervalRef.current && clearInterval(ytIntervalRef.current);
        ytIntervalRef.current = setInterval(() => {
          try {
            if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== 'function') return;
            const sec = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration ? ytPlayerRef.current.getDuration() : 0;
            updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: sec, duration: dur });
          } catch {}
        }, 1000);
      } catch {}
    });
    return () => {
      mounted = false;
      if (ytIntervalRef.current) { clearInterval(ytIntervalRef.current); ytIntervalRef.current = null; }
      // do not destroy player explicitly; it will be recreated next render
    };
  }, [isEnrolled, isExpanded, currentVideo?.url]);

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

      <div className="courses-grid">
        {category === "nism" ? (
          <div className="course-card">
            {isEnrolled ? (
              <div className="course-content">
                <h3 className="course-title">{currentVideo?.title || "NISM Series: Chapter 1"}</h3>
                <div className="course-video" style={{ marginTop: 12 }}>
                  {currentVideo?.url && /youtu/.test(currentVideo.url) ? (
                    <iframe
                      id="nismPlayer"
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${extractYouTubeId(currentVideo.url)}?enablejsapi=1&origin=${window.location.origin}`}
                      title={currentVideo?.title || "NISM Series: Chapter 1"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsExpanded(true)}
                    />
                  ) : currentVideo?.url ? (
                    <video ref={html5VideoRef} width="100%" height="315" controls style={{ cursor: "pointer" }} onClick={() => setIsExpanded(true)} onTimeUpdate={(e)=>{
                      try{
                        const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime, duration: v.duration });
                      }catch{}
                    }} onLoadedMetadata={(e)=>{
                      try{ const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime||0, duration: v.duration||0 }); }catch{}
                    }}>
                      <source src={currentVideo?.url} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="no-video" style={{ padding: 12, background: "#fafafa", border: "1px solid #eee", borderRadius: 6 }}>
                      <p style={{ margin: 0 }}>Video will be available soon.</p>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                      padding: 16,
                    }}
                    onClick={() => setIsExpanded(false)}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "min(100%, 1000px)",
                        aspectRatio: "16 / 9",
                        background: "#000",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setIsExpanded(false)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "rgba(0,0,0,0.6)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "6px 10px",
                          cursor: "pointer",
                          zIndex: 1001,
                        }}
                        aria-label="Close video"
                      >
                        ✕
                      </button>

                      {currentVideo?.url && /youtu/.test(currentVideo.url) ? (
                        <iframe
                          id="nismPlayerModal"
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${extractYouTubeId(currentVideo.url)}?enablejsapi=1&origin=${window.location.origin}`}
                          title={currentVideo?.title || "NISM Series: Chapter 1"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <video ref={html5VideoRef} controls style={{ width: "100%", height: "100%" }} onTimeUpdate={(e)=>{
                          try{ const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime, duration: v.duration }); }catch{}
                        }} onLoadedMetadata={(e)=>{
                          try{ const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime||0, duration: v.duration||0 }); }catch{}
                        }}>
                          <source src={currentVideo?.url} />
                        </video>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="course-thumbnail">📘</div>
                <div className="course-content">
                  <span className="course-category">NISM Series</span>
                  <h3 className="course-title">NISM Series: Chapter 1</h3>
                  <p className="course-desc">Watch Chapter 1 directly on this page.</p>

                  <div className="course-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span className="course-price">Free</span>
                    <button className="btn btn-primary" onClick={() => setIsEnrolled(true)}>Enroll Now</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
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
          ))
        )}
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
