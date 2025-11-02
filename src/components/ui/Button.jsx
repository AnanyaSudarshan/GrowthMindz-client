import React from "react";

const variants = {
  primary: "btn btn--primary",
  ghost: "btn btn--ghost",
  outline: "btn btn--ghost",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  return <button className={`${v} ${s} ${className}`} {...props} />;
}

export default Button;
