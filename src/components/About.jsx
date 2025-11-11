import React from 'react'
import './About.css'

function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about__highlights">
          <ul className="about__list">
            <li className="about__item">
              <span className="about__term">Vision Statement:</span>{' '}
              <span className="about__desc">Empowering individuals and communities to achieve financial confidence, independence, and resilience through lifelong learning.</span>
            </li>
            <li className="about__item">
              <span className="about__term">Mission Statement:</span>{' '}
              <span className="about__desc">To provide accessible, engaging, and practical financial education that equips people of all ages and backgrounds with the knowledge and tools to make informed financial decisions, build wealth, and secure their future.</span>
            </li>
          </ul>
        </div>
        <h2>About MindsetMovez</h2>
        <p>
          Our platform provides financial literacy through smart learning techniques, aiming to educate and create awareness among the middle and lower-middle-class communities about smart investments. We empower users to confidently manage their money, offering strategies to invest with reduced risk and higher returns. Our goal is to help you take control of your finances, grow your wealth independently, and make your money work for you—even when you're not actively working.
        </p>
      </div>
    </section>
  )
}

export default About


