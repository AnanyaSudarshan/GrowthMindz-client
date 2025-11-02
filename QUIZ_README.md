# Quiz Component Documentation

## Overview
A fully functional, modern quiz application built with React and Tailwind CSS. The quiz simulates an online test portal experience with timer, navigation, and detailed review capabilities.

## Features

### 1. **Landing Page**
- Beautiful gradient background with success message
- Green "Take the Quiz" button
- Smooth transitions and hover effects

### 2. **Instructions Page**
- Complete quiz guidelines and rules
- Lists total questions, time duration, marking scheme
- Start button to begin the quiz

### 3. **Quiz Interface**
- **Live Timer**: Countdown from 60 minutes (hours:minutes:seconds)
- **Question Navigation Sidebar**: 
  - Visual indicators for current question, answered questions, and unanswered
  - Click any question number to jump to it
- **Question Display**: 
  - One question at a time with multiple-choice options
  - Radio button selection
  - Visual feedback on selection
- **Navigation Buttons**:
  - **Save**: Saves answer and auto-navigates to next question
  - **Reset**: Clears current question's selected answer
  - **Previous**: Go to previous question
  - **Next**: Go to next question
  - **Finish Test**: Submit quiz and view results
- **Auto-Submit**: Timer automatically submits when reaching 00:00:00

### 4. **Results/Review Page**
- **Score Summary Card**: 
  - Total Questions
  - Attempted Questions
  - Correct Answers
  - Final Score
- **Detailed Answer Review**:
  - Color-coded results (Green=Correct, Red=Incorrect, Gray=Not Attempted)
  - Shows correct answer for each question
  - Displays user's selected answer
  - Marks displayed per question
- **Back to Home** button

## Technical Implementation

### State Management
- `currentView`: Controls which view to display (landing, instructions, quiz, review)
- `instructionsVisible`: Toggle instructions display
- `currentQuestionIndex`: Tracks current question (0-9)
- `answers`: Object storing user answers {questionId: selectedAnswer}
- `timeRemaining`: Countdown timer in seconds
- `isQuizActive`: Boolean to control timer start/stop

### Timer Logic
- Uses `useEffect` with `setInterval` for 1-second countdown
- Auto-submits when timer reaches 0
- Formatted as HH:MM:SS

### Sample Data
10 quiz questions on web development topics including:
- HTML, React, CSS, APIs
- JavaScript fundamentals
- SQL, data types
- Virtual DOM concepts

## Styling

### Tailwind CSS Classes Used
- Responsive grid layouts (`grid-cols-1 lg:grid-cols-4`)
- Color gradients (`bg-gradient-to-br`)
- Hover effects (`hover:bg-*`, `hover:scale-*`)
- Shadows (`shadow-lg`, `shadow-xl`, `shadow-2xl`)
- Spacing utilities (`p-4`, `mb-6`, `space-y-4`)
- Responsive utilities (`md:`, `lg:`)

### Color Scheme
- **Primary**: Blue (`blue-600`, `blue-700`)
- **Success**: Green (`green-600`, `green-700`)
- **Warning**: Yellow (`yellow-500`, `yellow-600`)
- **Danger**: Red (`red-500`, `red-600`)
- **Neutral**: Gray scale (`gray-50` to `gray-800`)

## File Structure

```
GrowthMindz-client/src/
├── pages/
│   └── Quiz.jsx           # Main quiz component
└── App.jsx                # Route: /quiz
```

## Usage

1. Navigate to `/quiz` route
2. Click "Take the Quiz" on landing page
3. Read instructions and click "Start Quiz"
4. Answer questions using navigation buttons
5. Click "Finish Test" or wait for auto-submit
6. Review detailed results

## Customization

### Add More Questions
Edit the `quizData` array in `Quiz.jsx`:

```javascript
const quizData = [
  {
    id: 11,
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: "Option 1"
  },
  // ... more questions
];
```

### Change Timer Duration
Modify `QUIZ_TIME` constant:
```javascript
const QUIZ_TIME = 60 * 60; // 60 minutes in seconds
```

### Modify Styling
All styling is done with Tailwind CSS utility classes. Customize colors, spacing, and layout by modifying class names.

## Dependencies

- React 19.1.1
- React Router DOM 7.9.4
- Tailwind CSS 3.x
- PostCSS
- Autoprefixer

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

- **Mobile**: Single column layout
- **Tablet**: Optimized spacing
- **Desktop**: Full grid layout with sidebar
- **Large screens**: Maximum width container for readability


