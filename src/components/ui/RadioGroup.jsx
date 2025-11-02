import React from "react";

export function RadioGroup({ value, onValueChange, children, className = "" }) {
  const ctx = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <div role="radiogroup" className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { group: ctx });
      })}
    </div>
  );
}

export function RadioGroupItem({ id, value, group, className = "", ...props }) {
  const checked = group?.value === value;
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={(e) => group?.onValueChange?.(e.target.value)}
      className={`w-5 h-5 text-indigo-600 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
}
