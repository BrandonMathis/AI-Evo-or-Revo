"use client";

import React, { useState, useEffect, useCallback } from "react";
import SlideCounter from "./SlideCounter";
import ThisDotLogo from "./ThisDotLogo";

interface IntroSlideProps {
  totalSlides: number;
}

// Intro slide component with This Dot logo and presentation title
const IntroSlide = React.memo(function IntroSlide({
  totalSlides,
}: IntroSlideProps) {
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and show the modal
  useEffect(() => {
    // Check if it's a mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Only show modal on mobile devices
      if (mobile) {
        setShowMobileModal(true);
      }
    };

    checkMobile();

    // Re-check on resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle tap anywhere on the screen to dismiss modal
  const handleScreenTap = useCallback(() => {
    if (showMobileModal) {
      setShowMobileModal(false);
    }
  }, [showMobileModal]);

  return (
    <div className="main-slide-container">
      <div className="intro-slide">
        {/* This Dot Logo at the top */}
        <div className="thisdot-logo-container">
          <ThisDotLogo width={100} height={57} />
        </div>

        <h1 className="intro-title">
          <span className="intro-title-top">Coding with AI</span>
          <br />
          Revolution
          <br />
          or
          <br />
          Evolution?
        </h1>
        <h2 className="intro-subtitle">Brandon Mathis</h2>
        <p className="intro-author">
          Engineering Lead @{" "}
          <a href="https://thisdot.co" style={{ textDecoration: "underline" }}>
            This Dot Labs
          </a>
        </p>
        <p className="intro-author">
          <a href="https://github.com/BrandonMathis/AI-Evo-or-Revo" style={{ textDecoration: "underline", fontSize: '0.75em' }}>
            View slide-deck code on Github
          </a>
        </p>

        {/* Mobile navigation modal */}
        {isMobile && showMobileModal && (
          <div className="mobile-nav-modal" onClick={handleScreenTap}>
            <div className="mobile-nav-content">
              <p>Swipe in any direction to navigate</p>
              <div className="swipe-directions">
                <span>↑</span>
                <div className="horizontal-directions">
                  <span>←</span>
                  <span>→</span>
                </div>
                <span>↓</span>
              </div>
              <p className="tap-instruction">Tap anywhere to continue</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide counter in bottom right */}
      <SlideCounter current={0} total={totalSlides + 1} isIntro={true} />
    </div>
  );
});

export default IntroSlide;
