"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

// Simple progress bar component without tick marks
const ProgressBar = React.memo(function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  // Calculate width percentage
  const widthPercentage = `${(current / total) * 100}%`;

  // No tick marks as per user request
  const renderTickMarks = () => null;

  return (
    <div className="progress-bar-container">
      {renderTickMarks()}
      <div
        className="progress-bar"
        style={{ width: widthPercentage }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Slide ${current} of ${total}`}
      ></div>
    </div>
  );
});

export default ProgressBar;
