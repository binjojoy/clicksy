import React from 'react';
import './Button.css'; // Import the CSS for the button

const Button = ({ children, variant = 'primary', ...props }) => {
  // The `variant` prop determines the CSS class applied.
  // Defaults to 'primary' if no variant is specified.
  const buttonClass = `btn btn-${variant}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
