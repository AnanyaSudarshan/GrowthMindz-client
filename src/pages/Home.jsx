import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Curriculum from "../components/Curriculum";
import "./Home.css";

function Home() {
  useEffect(() => {
    const handleNavClick = (e) => {
      const target = e.target;
      if (target.matches('a[href^="#"]')) {
        const id = target.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const navbarOffset = 64;
          const elementTop = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - navbarOffset + 1,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleNavClick);
    return () => document.removeEventListener("click", handleNavClick);
  }, []);

  return (
    <div id="top">
      <Navbar />
      <main className="hero">
        <div className="hero__content container">
          <h1>Master Your Money, One Lesson at a Time</h1>
          <p>
            + Learn personal finance with a practical curriculum designed for
            students and professionals of any age. Start building confidence
            with your money today.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="/signup">
              Get Started
            </a>
            <a className="btn btn--ghost" href="#about">
              Learn More
            </a>
          </div>
        </div>
      </main>
      <About />
      <Curriculum />
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} MindsetMovez. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
