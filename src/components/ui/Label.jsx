import React from "react";

function Label({ htmlFor, className = "", children, ...props }) {
  return (
    <label htmlFor={htmlFor} className={`text-gray-800 ${className}`} {...props}>
      {children}
    </label>
  );
}

export default Label;
