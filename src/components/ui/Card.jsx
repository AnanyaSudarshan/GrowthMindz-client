import React from "react";

function Card({ className = "", ...props }) {
  return <div className={`bg-white rounded-xl shadow-lg ${className}`} {...props} />;
}

export default Card;
