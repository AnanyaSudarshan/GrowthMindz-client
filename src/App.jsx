import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/"></Link>
        <Link to="/login"></Link>
        <Link to="/signup"></Link>
        <Link to="/forgot-password"></Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
