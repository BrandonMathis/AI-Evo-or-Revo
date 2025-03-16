"use client";

import React from "react";

interface ThisDotLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

// This Dot Labs logo component with customizable dimensions
const ThisDotLogo: React.FC<ThisDotLogoProps> = ({
  width = 556,
  height = 318,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 556 318"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M211.181 0.871033H124.929L0.875 157.935L127.059 317.129H213.311L88.192 157.935L211.181 0.871033Z"
        fill="white"
      />
      <path
        d="M468.34 157.935L343.754 0.871033H430.006L555.125 157.935L427.876 317.129H341.624L468.34 157.935Z"
        fill="white"
      />
      <circle cx="277.734" cy="158.468" r="97.9654" fill="white" />
    </svg>
  );
};

export default ThisDotLogo;
