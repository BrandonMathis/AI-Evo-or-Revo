"use client";

import React from "react";

interface SlideHeaderProps {
  parentDir: string;
  title: string;
}

// Function to clean up title by removing leading numbers
const cleanTitle = (title: string) => {
  // Remove leading numbers and any spaces after them
  return title.replace(/^\d+\s*/, "");
};

// Header component that displays the parent directory and slide title
const SlideHeader = React.memo(function SlideHeader({
  parentDir,
  title,
}: SlideHeaderProps) {
  return (
    <div className="header-container header-slide">
      <div className="header-content">
        {/* Space for QR code */}
        <div
          className="qr-code-placeholder"
          style={{ width: "100px", height: "100px" }}
        />

        <div className="header-text-container">
          {/* Parent directory name as larger heading - always render even if empty */}
          <h1 className="parent-dir-heading">{parentDir || "\u00A0"}</h1>

          {/* Slide title - always render even if empty */}
          <h2 className="slide-title">
            {title ? cleanTitle(title) : "\u00A0"}
          </h2>
        </div>
      </div>
    </div>
  );
});

export default SlideHeader;
