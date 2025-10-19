import React from 'react';
import './Card.css'; // Import the CSS for the card

const Card = ({ children, variant = 'default', ...props }) => {
  // The `variant` prop determines the CSS class applied.
  const cardClass = `card card-${variant}`;

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
