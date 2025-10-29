import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import ProductPage from "./pages/dashboard/ProductPage";
import MyLearning from "./pages/dashboard/MyLearning";
import Progress from "./pages/dashboard/Progress";
import Courses from "./pages/dashboard/Courses";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
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
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/product"
            element={
              <DashboardLayout>
                <ProductPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/learning"
            element={
              <DashboardLayout>
                <MyLearning />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/progress"
            element={
              <DashboardLayout>
                <Progress />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/courses/:category"
            element={
              <DashboardLayout>
                <Courses />
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;