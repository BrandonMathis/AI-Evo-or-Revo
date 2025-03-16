"use client";

import React from "react";

interface SlideCounterProps {
  current: number;
  total: number;
  isIntro?: boolean;
}

// Memoized slide counter component that only re-renders when numbers change
const SlideCounter = React.memo(function SlideCounter({
  current,
  total,
  isIntro = false,
}: SlideCounterProps) {
  const counterText = isIntro ? `Intro / ${total}` : `${current} / ${total}`;

  return (
    <div className="slide-counter">
      <p className="counter-text">{counterText}</p>
    </div>
  );
});

export default SlideCounter;
