// components/ui/badge.jsx

import * as React from "react";

// Utility function to map variant prop to a CSS class
const getBadgeClass = (variant) => {
    switch (variant) {
        case "secondary":
            return "badge-secondary";
        case "destructive":
            return "badge-destructive";
        case "outline":
            return "badge-outline";
        case "default":
        default:
            return "badge-default";
    }
};

function Badge({ className, variant, ...props }) {
  const baseClass = "badge";
  const variantClass = getBadgeClass(variant);

  return <div className={`${baseClass} ${variantClass} ${className || ""}`} {...props} />;
}

export { Badge };