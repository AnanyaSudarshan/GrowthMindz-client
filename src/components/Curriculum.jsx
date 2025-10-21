import React from 'react'
import './Curriculum.css'

const topics = [
  'NISM SERIES',
  'STOCK MARKET',
  'FOREX MARKET'
]

function Curriculum() {
  return (
    <section id="curriculum" className="section curriculum">
      <div className="container">
        <h2>Curriculum</h2>
        <ul className="topics">
          {topics.map((t) => (
            <li className="topic" key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Curriculum


