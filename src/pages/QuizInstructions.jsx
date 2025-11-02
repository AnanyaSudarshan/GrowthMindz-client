import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizInstructions.css";

function QuizInstructions() {
  const navigate = useNavigate();

  return (
    <div className="quiz-instructions-page">
      <div className="container">
        <div className="quiz-instructions-card">
          <h1 className="quiz-instructions-title">Quiz Instructions</h1>

          <div className="quiz-instructions-content">
            <div className="instructions-summary-box">
              <p className="instruction-summary-item">
                <strong>Total Questions:</strong> 10
              </p>
              <p className="instruction-summary-item">
                <strong>Time Duration:</strong> 10 minutes
              </p>
              <p className="instruction-summary-item">
                <strong>Marks per Question:</strong> 1 mark
              </p>
              <p className="instruction-summary-item">
                <strong>Negative Marking:</strong> No
              </p>
            </div>

            <div className="instructions-section">
              <h3 className="instructions-section-title">General Instructions:</h3>
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

            <div className="instructions-note-box">
              <p className="instructions-note">
                <strong>Note:</strong> The quiz will automatically submit when the timer reaches 00:00:00
              </p>
            </div>
          </div>

          <div className="quiz-instructions-actions">
            <button onClick={() => navigate("/quiz")} className="btn btn--primary">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizInstructions;
