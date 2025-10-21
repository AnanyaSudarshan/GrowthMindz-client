import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <a href="#top" className="brand" aria-label="Home">
          <span className="brand__icon" />
          <span className="brand__text">GrowthMindz</span>
        </a>
        <nav className="navbar__nav" aria-label="Primary">
          <a href="#about" className="nav__link">About</a>
          <a href="#curriculum" className="nav__link">Curriculum</a>
        </nav>
      </div>
      <div className="navbar__right">
        <a href="/login" className="btn btn--ghost">Login</a>
        <a href="/signup" className="btn btn--primary">Signup</a>
      </div>
    </header>
  )
}

export default Navbar


