import React from 'react';
import '../styles/AvatarFallback.css';

// Simple hash function to pick gradient variant
function hashName(name) {
  if (!name) return 0;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 6;
}

// Extract initials: first letter of first name + first letter of last name
function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase();
  }
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
}

const AvatarFallback = ({ name, size = 'md', imageUrl, className = '' }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "Avatar"}
        className={`avatar-image size-${size} ${className}`}
        loading="lazy"
      />
    );
  }

  const initials = getInitials(name);
  const variant = hashName(name);

  return (
    <div
      className={`avatar-fallback size-${size} variant-${variant} ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};

export default AvatarFallback;
