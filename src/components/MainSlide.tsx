"use client";

import React from "react";
import SlideCounter from "./SlideCounter";

interface MainSlideProps {
  imagePath: string;
  imageAlt: string;
  currentIndex: number;
  totalSlides: number;
  onImageError: () => void;
}

// Main slide component that displays the current slide image
const MainSlide = React.memo(function MainSlide({
  imagePath,
  imageAlt,
  currentIndex,
  totalSlides,
  onImageError,
}: MainSlideProps) {
  return (
    <div className="main-slide-container">
      <div className="slide-image-container">
        <img
          src={imagePath}
          alt={imageAlt}
          style={{
            maxWidth: '90vw',
            position: "absolute",
            height: "100%",
            objectFit: "contain",
          }}
          onError={onImageError}
        />

        {/* Slide counter in bottom right */}
        <SlideCounter current={currentIndex + 1} total={totalSlides} />
      </div>
    </div>
  );
});

export default MainSlide;
