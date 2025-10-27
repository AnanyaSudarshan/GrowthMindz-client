import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MyLearning from "./pages/MyLearning";
import Progress from "./pages/Progress";
import Courses from "./pages/Courses";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-learning"
          element={
            <DashboardLayout>
              <MyLearning />
            </DashboardLayout>
          }
        />
        <Route
          path="/progress"
          element={
            <DashboardLayout>
              <Progress />
            </DashboardLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          }
        />
        <Route
          path="/courses/nism"
          element={
            <DashboardLayout>
              <Courses category="nism" />
            </DashboardLayout>
          }
        />
        <Route
          path="/courses/forex"
          element={
            <DashboardLayout>
              <Courses category="forex" />
            </DashboardLayout>
          }
        />
        <Route
          path="/courses/stock"
          element={
            <DashboardLayout>
              <Courses category="stock" />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
