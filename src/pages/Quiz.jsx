import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const QUIZ_TIME = 10 * 60; // 10 minutes in seconds

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromCategory = location.state?.fromCategory;
  const videoIndex = Number(location.state?.videoIndex ?? 0);
  const totalVideos = Number(location.state?.totalVideos ?? 1);
  const videoTitle = String(location.state?.videoTitle || '');
  const [currentView, setCurrentView] = useState('quiz'); // 'quiz', 'review'
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverResults, setServerResults] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsQuizActive(false);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuizActive, timeRemaining]);

  // Normalize without using any sample fallback (slice to at most 10)
  const normalizeQuestions = (arr) => {
    const cleaned = (Array.isArray(arr) ? arr : [])
      .filter(q => q && q.id != null && q.question && Array.isArray(q.options) && q.options.length > 0);
    return cleaned.slice(0, 10);
  };

  // Load questions from backend
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch UI-ready questions from backend (defaults to qid=2 if not provided)
        const res = await axios.get('http://localhost:5000/api/quiz/questions', { params: { qid: 2 } });
        if (!cancelled) {
          const list = Array.isArray(res?.data) ? res.data : [];
          const ten = normalizeQuestions(list);
          setQuizData(ten);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load quiz from server.');
          setQuizData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0')
    };
  };

  const handleStartQuiz = () => {
    setCurrentView('instructions');
  };

  const handleBeginQuiz = () => {
    setInstructionsVisible(false);
    setCurrentView('quiz');
    setIsQuizActive(true);
    setHasStarted(true);
  };

  // Auto-start timer when quiz view is shown (when navigating directly from "Take Quiz" button)
  // This ensures timer starts immediately when the quiz page loads
  useEffect(() => {
    if (currentView === 'quiz' && !hasStarted && !isQuizActive) {
      // Start timer immediately when quiz view is first shown
      setIsQuizActive(true);
      setHasStarted(true);
    }
  }, [currentView, hasStarted, isQuizActive]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSave = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[quizData[currentQuestionIndex].id];
      return updated;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishTest = () => {
    finishQuiz();
  };

  const finishQuiz = () => {
    setIsQuizActive(false);
    // Submit to server for evaluation; fallback to local if it fails
    (async () => {
      try {
        // Get user ID from localStorage
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        const userId = user?.id || null;
        
        const res = await axios.post('http://localhost:5000/api/quiz/submit', {
          answers,
          questions: quizData,
          userId: userId,
          qid: 2 // Chapter-1 quiz
        });
        setServerResults(res.data);
      } catch (e) {
        console.error('Quiz submission error:', e);
        setServerResults(null);
      } finally {
        setCurrentView('review');
      }
    })();
  };

  // No auto-redirect: stay on review until user clicks Back to Courses

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;

    quizData.forEach(q => {
      if (answers[q.id]) {
        attempted++;
        if (answers[q.id] === q.answer) {
          correct++;
        }
      }
    });

    return {
      total: quizData.length,
      attempted,
      correct,
      score: correct
    };
  };

  const time = formatTime(timeRemaining);

  // Landing View (card-based, matches dashboard)
  if (currentView === 'landing') {
    return (
      <div className="quiz-page">
        <div className="quiz-card">
          <div className="quiz-card-header">
            <div className="quiz-icon-wrapper">
              <span className="quiz-icon">✓</span>
            </div>
            <h1 className="quiz-card-title">Video Complete!</h1>
            <p className="quiz-card-subtitle">
              Great job finishing the video. Ready to check your understanding?
            </p>
            <button
              onClick={handleStartQuiz}
              className="btn btn--primary"
              style={{ padding: '12px 32px' }}
            >
              Take the Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions View (card-based, matches dashboard)
  if (currentView === 'instructions') {
    return (
      <div className="quiz-page">
        <div className="quiz-card">
          <h2 className="quiz-card-title" style={{ textAlign: 'left', marginBottom: '24px' }}>Quiz Instructions</h2>
          {instructionsVisible && (
            <div className="instructions-content">
              <div className="instructions-summary">
                <p className="instruction-item"><strong>Total Questions:</strong> 10</p>
                <p className="instruction-item"><strong>Time Duration:</strong> 10 minutes</p>
                <p className="instruction-item"><strong>Marks per Question:</strong> 1 mark</p>
                <p className="instruction-item" style={{ marginBottom: 0 }}><strong>Negative Marking:</strong> No</p>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>General Instructions:</h3>
                <ul className="instructions-list">
                  <li>Read each question carefully before selecting your answer</li>
                  <li>You can navigate between questions using the question numbers sidebar</li>
                  <li>Use the <strong>Save</strong> button to save your answer and move to the next question</li>
                  <li>Use the <strong>Reset</strong> button to clear your selected answer</li>
                  <li>You can use <strong>Previous</strong> and <strong>Next</strong> to navigate</li>
                  <li>Click <strong>Finish Test</strong> when you're done, or it will auto-submit when time ends</li>
                  <li>Once you finish, you'll see your score and review your answers</li>
                </ul>
              </div>
              <div className="instructions-note">
                <p>
                  <strong>Note:</strong> The quiz will automatically submit when the timer reaches 00:00:00
                </p>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            {instructionsVisible ? (
              <button onClick={handleBeginQuiz} className="btn btn--primary" style={{ padding: '12px 32px' }}>
                Start Quiz
              </button>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Good luck!</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz View (card-based, matches dashboard)
  if (currentView === 'quiz') {
    if (loading) {
      return (
        <div className="quiz-page">
          <div className="quiz-card">
            <div className="quiz-loading">Loading questions...</div>
          </div>
        </div>
      );
    }
    if (!quizData || quizData.length === 0) {
      return (
        <div className="quiz-page">
          <div className="quiz-card">
            <h2 className="quiz-card-title" style={{ textAlign: 'left', marginBottom: 16 }}>Quiz</h2>
            {error ? (
              <div className="quiz-error">{error}</div>
            ) : (
              <div className="quiz-error">No questions available.</div>
            )}
          </div>
        </div>
      );
    }
    const currentQuestion = quizData[currentQuestionIndex];
    const totalQuestions = quizData.length;

    return (
      <div className="quiz-page">
        {!!videoTitle && (
          <div className="quiz-card" style={{ marginBottom: 16 }}>
            <div className="quiz-card-header">
              <h1 className="quiz-card-title" style={{ marginBottom: 0 }}>Quiz for: {videoTitle}</h1>
              <p className="quiz-card-subtitle" style={{ marginTop: 6 }}>Chapter {videoIndex + 1} of {totalVideos}</p>
            </div>
          </div>
        )}
        {/* Timer Card */}
        <div className="quiz-timer-container">
          <div className="quiz-timer-card">
            <div className="quiz-timer-label">Time Remaining</div>
            <div className="quiz-timer-display">
              {time.hours}:{time.minutes}:{time.seconds}
            </div>
          </div>
          <div className="quiz-timer-progress">
            <div
              className="quiz-timer-progress-fill"
              style={{ width: `${Math.max(0, (timeRemaining / QUIZ_TIME) * 100)}%` }}
            />
          </div>
        </div>

        <div className="quiz-layout">
          {/* Question Sidebar */}
          <div className="question-sidebar">
            <h3 className="question-sidebar-title">Questions</h3>
            <div className="question-grid" role="navigation" aria-label="Question navigation">
              {quizData.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`question-number-btn ${
                    index === currentQuestionIndex
                      ? 'current'
                      : answers[q.id]
                      ? 'answered'
                      : ''
                  }`}
                  aria-current={index === currentQuestionIndex ? 'true' : 'false'}
                  aria-label={`Go to question ${index + 1}${answers[q.id] ? ', answered' : ''}`}
                  tabIndex={0}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="question-legend">
              <div className="legend-item">
                <div className="legend-color current"></div>
                <span>Current</span>
              </div>
              <div className="legend-item">
                <div className="legend-color answered"></div>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-color not-answered"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>

          {/* Main Quiz Area */}
          <div className="quiz-main-area">
            {loading && (
              <div className="quiz-loading">Loading questions...</div>
            )}
            {!!error && (
              <div className="quiz-error">{error}</div>
            )}
            <div className="quiz-question-header">
              <span className="quiz-question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>

            <h2 className="quiz-question-text">
              {currentQuestion.question}
            </h2>

            <div className="quiz-options" role="radiogroup" aria-label="Answer options">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`quiz-option ${
                    answers[currentQuestion.id] === option ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    aria-label={`Option ${index + 1}: ${option}`}
                  />
                  <span className="quiz-option-label">{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="quiz-navigation">
              <div className="quiz-nav-left">
                <button
                  onClick={handleReset}
                  className="btn btn--ghost"
                  aria-label="Reset selected answer"
                >
                  Reset
                </button>
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="btn btn--ghost"
                    aria-label="Go to previous question"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="quiz-nav-right">
                {currentQuestionIndex < totalQuestions - 1 && (
                  <button
                    onClick={handleNext}
                    className="btn btn--ghost"
                    aria-label="Go to next question"
                  >
                    Next
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="btn btn--ghost"
                  aria-label="Save answer and stay on this question"
                >
                  Save
                </button>
                  <button
                    onClick={handleFinishTest}
                    className="btn btn--primary"
                    aria-label="Submit quiz"
                  >
                    Submit
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review View
  if (currentView === 'review') {
    const localResults = calculateResults();
    const results = serverResults?.results || localResults;

    return (
      <div className="quiz-page">
        <div className="review-container">
          {/* Score Summary */}
          <div className="review-summary">
            <h1 className="review-title">Quiz Completed!</h1>
            {!!videoTitle && (
              <p style={{ fontSize: '16px', color: '#475569', marginTop: 8 }}>For: <strong>{videoTitle}</strong></p>
            )}
            <p style={{ fontSize: '18px', color: '#334155', marginBottom: '32px', textAlign: 'center' }}>
              Great job! Here's how you did:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <button className="btn btn--primary" onClick={() => navigate(`/dashboard/courses/${fromCategory || 'nism'}`)}>
                Back to Courses
              </button>
            </div>
            <div className="review-stats-grid">
              <div className="review-stat-card">
                <div className="review-stat-value">{results.total}</div>
                <div className="review-stat-label">Total</div>
              </div>
              <div className="review-stat-card">
                <div className="review-stat-value">{results.attempted}</div>
                <div className="review-stat-label">Attempted</div>
              </div>
              <div className="review-stat-card">
                <div className="review-stat-value">{results.correct}</div>
                <div className="review-stat-label">Correct</div>
              </div>
              <div className="review-stat-card">
                <div className="review-stat-value">{results.score}</div>
                <div className="review-stat-label">Score</div>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="review-questions">
            <h2 className="review-questions-title">Review</h2>
            <div>
              {quizData.map((q, index) => {
                // Find answer details from server results or use local calculation
                const answerDetail = serverResults?.details?.find(d => d.questionId === q.id);
                const userAnswer = answers[q.id];
                const isCorrect = answerDetail ? answerDetail.isCorrect : (userAnswer === q.answer);

                return (
                  <div key={q.id} className="review-question-item">
                    <div className="review-question-header">
                      <p className="review-question-number">Question {index + 1}</p>
                      {userAnswer ? (
                        <span className={`review-status-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      ) : (
                        <span className="review-status-badge not-attempted">Not Attempted</span>
                      )}
                    </div>
                    <h3 className="review-question-text">{q.question}</h3>
                    <div className="review-answer-info">
                      <p style={{ marginBottom: '8px' }}>
                        <strong>Your answer:</strong> {userAnswer ? <span>{userAnswer}</span> : <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>—</span>}
                      </p>
                      <p>
                        <strong>Correct answer:</strong> <span className="review-correct-answer">{q.answer}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* No auto-continue; user stays until clicking Back */}

            {/* Go Back Button at Bottom Left */}
            <div className="review-back-button">
              <Link to={`/dashboard/courses/${fromCategory || 'nism'}`} className="btn btn--primary">
                Go Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Quiz;

