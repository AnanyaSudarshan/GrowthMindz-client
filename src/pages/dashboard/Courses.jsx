import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const ytPlayerRef = useRef(null);
  const ytIntervalRef = useRef(null);
  const html5VideoRef = useRef(null);
  const [quizReady, setQuizReady] = useState(false);
  const [apiCourseTitle, setApiCourseTitle] = useState("");
  const [apiVideos, setApiVideos] = useState([]);
  const [searchNoMatch, setSearchNoMatch] = useState(false);

  const [enrolledMap, setEnrolledMap] = useState({});
  const loadEnrolled = () => {
    try { return JSON.parse(localStorage.getItem('gm:enrollments')) || {}; } catch { return {}; }
  };
  const saveEnrolled = (data) => {
    try { localStorage.setItem('gm:enrollments', JSON.stringify(data)); } catch {}
  };
  useEffect(() => { setEnrolledMap(loadEnrolled()); }, []);
  const enrollmentKey = (course) => `cat:${category}:id:${course?.id}`;
  const isCourseEnrolled = (course) => !!enrolledMap[enrollmentKey(course)];
  const handleEnrollOrLearn = (course) => {
    if (!course || !course.id) return;
    const key = enrollmentKey(course);
    if (!enrolledMap[key]) {
      const next = { ...enrolledMap, [key]: { updatedAt: Date.now() } };
      setEnrolledMap(next);
      saveEnrolled(next);
    }
    if (category === 'nism') {
      setShowPlayer(true);
    } else {
      navigate('/dashboard/learning');
    }
  };

  const courseData = {
    nism: [],
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
  const categoryName = category === "nism" ? (apiCourseTitle || "NISM Series") : category === "forex" ? "Forex Market" : "Stock Market";

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "⭐" : "");
  };

  const handleSearch = () => {
    const q = (searchQuery || '').trim().toLowerCase();
    setSearchNoMatch(false);
    if (!q) return;
    if (category === 'nism') {
      const idx = (nismVideos || []).findIndex(v => String(v.title || '').toLowerCase().includes(q));
      if (idx >= 0) {
        setSelectedVideoIndex(idx);
        setIsEnrolled(true);
      } else {
        setSearchNoMatch(true);
      }
    }
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

  // Persist NISM enrollment across visits
  useEffect(() => {
    try {
      const enrolled = localStorage.getItem('gm:nism:enrolled');
      if (enrolled === 'true') {
        // User enrolled previously; show card with "Learn" by default
        setIsEnrolled(true);
        setShowPlayer(false);
      }
    } catch {}
  }, []);

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

  // Derive current video for NISM; prefer API data if available
  const nismCourse = courseData.nism?.[0] || {};
  const nismVideos = (Array.isArray(apiVideos) && apiVideos.length)
    ? apiVideos
    : (Array.isArray(nismCourse.videos) && nismCourse.videos.length
      ? nismCourse.videos
      : (nismCourse.videoUrl ? [{ id: "ch1", title: nismCourse.title || "Chapter 1", url: nismCourse.videoUrl }] : []));
  const currentVideo = nismVideos[selectedVideoIndex] || null;

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/course-videos`);
        const data = await res.json();
        if (abort) return;
        if (Array.isArray(data) && data.length) {
          // Try to pick the NISM course rows if present, otherwise use all
          const nismRows = data.filter(r => String(r.course_title || '').toLowerCase().includes('nism'));
          const rows = nismRows.length ? nismRows : data;
          setApiCourseTitle(rows[0].course_title || "");
          const vids = rows.map((row, idx) => ({ id: `ch${idx+1}`, title: row.course_vedio_title || "", url: row.vedio_url || "" }));
          setApiVideos(vids);
          setSelectedVideoIndex(0);
        } else {
          setApiCourseTitle("");
          setApiVideos([]);
        }
      } catch (e) {
        setApiCourseTitle("");
        setApiVideos([]);
      }
    })();
    return () => { abort = true; };
  }, []);

  // If coming back from quiz with a requested video index, honor it
  useEffect(() => {
    const idx = location?.state?.selectVideoIndex;
    if (category === 'nism' && Array.isArray(apiVideos) && apiVideos.length && typeof idx === 'number' && idx >= 0 && idx < apiVideos.length) {
      setSelectedVideoIndex(idx);
      setIsEnrolled(true);
    }
  }, [location?.state, apiVideos, category]);

  // Setup YouTube player tracking when enrolled
  useEffect(() => {
    if (!isEnrolled || !showPlayer || !currentVideo?.url || !/youtu/.test(currentVideo.url)) return;
    let playerElId = isExpanded ? 'nismPlayerModal' : 'nismPlayer';
    let mounted = true;
    loadYouTubeAPI().then((YT) => {
      if (!mounted) return;
      try {
        const player = new YT.Player(playerElId, {
          events: {
            onReady: (e) => {
              try {
                const dur = e.target.getDuration ? e.target.getDuration() : 0;
                updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: 0, duration: dur });
              } catch {}
            },
            onStateChange: (ev) => {
              if (ev.data === 0) {
                try {
                  const dur = ev.target.getDuration ? ev.target.getDuration() : 0;
                  updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: dur, duration: dur });
                } catch {}
                setQuizReady(true);
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
  }, [isEnrolled, showPlayer, isExpanded, currentVideo?.url]);

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
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          className="search-input"
        />
        <button className="btn btn-primary" style={{ marginLeft: 8 }} onClick={handleSearch}>Search</button>
      </div>
      {(category === 'nism' && searchQuery.trim() && searchNoMatch) && (
        <div className="no-results"><p>No courses found matching your search.</p></div>
      )}
      {(category !== 'nism' && searchQuery.trim() && filteredCourses.length === 0) && (
        <div className="no-results"><p>No courses found matching your search.</p></div>
      )}

      <div className="courses-grid">
        {category === "nism" ? (
          <div className="course-card">
            {(isEnrolled && showPlayer) ? (
              <div className="course-content">
                <h3 className="course-title">{currentVideo?.title || apiCourseTitle || "NISM Series: Chapter 1"}</h3>
                <div className="course-video" style={{ marginTop: 12 }}>
                  {currentVideo?.url && /youtu/.test(currentVideo.url) ? (
                    <iframe
                      id="nismPlayer"
                      width="100%"
                      height="420"
                      src={`https://www.youtube.com/embed/${extractYouTubeId(currentVideo.url)}?enablejsapi=1&origin=${window.location.origin}`}
                      title={currentVideo?.title || apiCourseTitle || "NISM Series: Chapter 1"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsExpanded(true)}
                    />
                  ) : currentVideo?.url ? (
                    <video ref={html5VideoRef} width="100%" height="420" controls style={{ cursor: "pointer" }} onClick={() => setIsExpanded(true)} onTimeUpdate={(e)=>{
                      try{
                        const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime, duration: v.duration });
                      }catch{}
                    }} onLoadedMetadata={(e)=>{
                      try{ const v=e.currentTarget; updateVideoProgress({ courseKey:'nism', videoId: currentVideo.id||'ch1', title: currentVideo.title, url: currentVideo.url, seconds: v.currentTime||0, duration: v.duration||0 }); }catch{}
                    }} onEnded={() => setQuizReady(true)}>
                      <source src={currentVideo?.url} />
                    </video>
                  ) : (
                    <div className="no-video" style={{ padding: 12, background: "#fafafa", border: "1px solid #eee", borderRadius: 6 }}>
                      <p style={{ margin: 0 }}>Video will be available soon.</p>
                    </div>
                  )}
                </div>
                {quizReady && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => navigate('/quiz', { state: { fromCategory: category, videoIndex: selectedVideoIndex, totalVideos: nismVideos.length, videoTitle: currentVideo?.title || '' } })}
                      className="btn btn--purple"
                    >
                      Take the Quiz
                    </button>
                  </div>
                )}
                {nismVideos.length > 1 && (
                  <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                    {nismVideos.map((v, i) => (
                      <button
                        key={v.id || i}
                        onClick={() => setSelectedVideoIndex(i)}
                        style={{
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: 6,
                          border: i === selectedVideoIndex ? '1px solid #6c5ce7' : '1px solid #e5e7eb',
                          background: i === selectedVideoIndex ? '#f5f3ff' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        {v.title || `Chapter ${i+1}`}
                      </button>
                    ))}
                  </div>
                )}
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
                          title={currentVideo?.title || apiCourseTitle || "NISM Series: Chapter 1"}
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
                        }} onEnded={() => setQuizReady(true)}>
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
                  <h3 className="course-title">{apiCourseTitle || "NISM Series: Chapter 1"}</h3>
                  <p className="course-desc">Explore our comprehensive nism series courses</p>

                  <div className="course-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span className="course-price">Free</span>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (!isEnrolled) {
                          try { localStorage.setItem('gm:nism:enrolled', 'true'); } catch {}
                          setIsEnrolled(true);
                          setShowPlayer(true); // first time, go straight to player
                        } else {
                          setShowPlayer(true); // subsequent times, "Learn" opens the player
                        }
                      }}
                    >
                      {isEnrolled ? 'Learn' : 'Enroll Now'}
                    </button>
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
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnrollOrLearn(course)}
                  >
                    {isCourseEnrolled(course) ? 'Learn' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
