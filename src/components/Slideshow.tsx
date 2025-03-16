"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import "./slideshow.css";
import SlideHeader from "./SlideHeader";
import IntroSlide from "./IntroSlide";
import MainSlide from "./MainSlide";
import ProgressBar from "./ProgressBar";

interface SlideImage {
  path: string;
  title: string;
  parentDir: string;
}

interface SlideshowProps {
  images: SlideImage[];
  initialSlideIndex?: number;
  useSlugUrls?: boolean;
}

// Function to convert title to slug
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^[0-9]+\s*/, ""); // Remove leading numbers
};

export default function Slideshow({
  images,
  initialSlideIndex = -1,
  useSlugUrls = false,
}: SlideshowProps) {
  // State for tracking current slide and errors
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [error, setError] = useState<string | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // No decade information needed since we removed tick marks

  // Create a function to navigate to a specific slide with browser history
  const navigateToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return; // Skip if already on this slide

      console.log(`[Slideshow] Navigating to slide: ${index}`);

      if (!useSlugUrls || typeof window === "undefined") {
        // Just update the state if not using slug URLs
        setCurrentIndex(index);
        return;
      }

      // Create a new history entry
      if (index === -1) {
        console.log("[Slideshow] Pushing history state: intro slide");
        window.history.pushState(
          { slideIndex: index, timestamp: Date.now() },
          "",
          "/slides/intro"
        );
      } else if (index >= 0 && index < images.length) {
        const slug = titleToSlug(images[index].title);
        console.log(
          `[Slideshow] Pushing history state: slide ${index} (${slug})`
        );
        window.history.pushState(
          { slideIndex: index, timestamp: Date.now() },
          "",
          `/slides/${slug}`
        );
      }

      // Update the current index
      setCurrentIndex(index);
    },
    [currentIndex, images, useSlugUrls]
  );

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!useSlugUrls || typeof window === "undefined") {
      return;
    }

    const handlePopState = (event: PopStateEvent) => {
      // Get the slide index from the state object
      const state = event.state as { slideIndex?: number } | null;

      console.log("[Slideshow] Popstate event triggered", state);

      if (state && typeof state.slideIndex === "number") {
        console.log(
          `[Slideshow] Navigating to slide index: ${state.slideIndex} via browser history`
        );
        // Update the current index directly without creating a new history entry
        setCurrentIndex(state.slideIndex);
      } else {
        console.log("[Slideshow] Popstate event with invalid or missing state");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [useSlugUrls]);

  // Navigation functions that use the navigateToSlide function
  const goToNextSlide = useCallback(() => {
    // If we're on the intro slide, go to the first image
    if (currentIndex === -1) {
      navigateToSlide(0);
      return;
    }

    // If we're on the last slide, stay on the last slide
    if (currentIndex >= images.length - 1) {
      return;
    }

    // Otherwise, go to the next image
    navigateToSlide(currentIndex + 1);
  }, [currentIndex, images.length, navigateToSlide]);

  const goToPrevSlide = useCallback(() => {
    // If we're on the first image, go to the intro slide
    if (currentIndex === 0) {
      navigateToSlide(-1);
      return;
    }

    // If we're on the intro slide, stay on the intro slide
    if (currentIndex === -1) {
      return;
    }

    // Otherwise, go to the previous image
    navigateToSlide(currentIndex - 1);
  }, [currentIndex, navigateToSlide]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Debug: Log keyboard events
      console.log("Keyboard event:", e.key);

      // Skip if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ": // Space bar
          e.preventDefault(); // Prevent page scrolling on space
          goToNextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "Escape":
          // Go back to intro slide
          if (currentIndex !== -1) {
            navigateToSlide(-1);
          }
          break;
        case "Home":
          e.preventDefault();
          if (currentIndex !== -1) {
            navigateToSlide(-1); // Go to intro slide
          }
          break;
        case "End":
          e.preventDefault();
          if (currentIndex !== images.length - 1) {
            navigateToSlide(images.length - 1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide, images.length]);

  // Focus management for accessibility
  useEffect(() => {
    if (slideRef.current) {
      // Ensure the slideshow container gets focus to receive keyboard events
      slideRef.current.focus();
    }
  }, [currentIndex]);

  // Initial focus when component mounts
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.focus();
    }
  }, []);

  // Function to detect if the page is zoomed
  const isPageZoomed = useCallback(() => {
    // Check if visualViewport API is available (more accurate)
    if (window.visualViewport) {
      return window.visualViewport.scale > 1.0;
    }

    // Fallback method: compare window dimensions
    // This is less accurate but works on more browsers
    // A zoomed page typically has innerWidth smaller than device-width
    const zoomThreshold = 0.95; // Allow slight differences without considering it zoomed
    return window.innerWidth / window.screen.width < zoomThreshold;
  }, []);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    // Ignore multi-touch gestures (like pinch to zoom)
    if (e.touches.length > 1) {
      return;
    }

    // Check if the page is already zoomed - if so, don't handle swipes
    // This prevents navigation when panning a zoomed view
    if (isPageZoomed()) {
      return;
    }

    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;

    // Track if this is a multi-touch gesture
    let isMultiTouch = false;
    // Track if the page becomes zoomed during this gesture
    let becameZoomed = false;

    // Handle additional touches that might occur during the gesture
    const handleTouchMove = (e: TouchEvent) => {
      // If at any point during the gesture we detect multiple touches, mark as multi-touch
      if (e.touches.length > 1) {
        isMultiTouch = true;
      }

      // Check if the page became zoomed during this interaction
      if (isPageZoomed()) {
        becameZoomed = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Remove the touch move listener
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      // If this was a multi-touch gesture (like zooming) or the page is now zoomed, don't navigate
      if (
        isMultiTouch ||
        e.changedTouches.length > 1 ||
        becameZoomed ||
        isPageZoomed()
      ) {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Check if it's a mobile device
      const isMobile = window.innerWidth <= 768;

      // For mobile devices, handle both horizontal and vertical swipes
      if (isMobile) {
        // If vertical swipe is more significant than horizontal
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
          if (diffY > 0) {
            // Swipe up, go to next slide
            goToNextSlide();
          } else {
            // Swipe down, go to previous slide
            goToPrevSlide();
          }
        }
        // If horizontal swipe is more significant
        else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left, go to next slide
            goToNextSlide();
          } else {
            // Swipe right, go to previous slide
            goToPrevSlide();
          }
        }
      }
      // For desktop, only handle horizontal swipes
      else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left, go to next slide
          goToNextSlide();
        } else {
          // Swipe right, go to previous slide
          goToPrevSlide();
        }
      }
    };

    // Add listener for touch move to detect multi-touch during the gesture
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  // Handle image load error
  const handleImageError = () => {
    if (currentIndex >= 0) {
      setError(`Failed to load image: ${images[currentIndex].path}`);
    }
  };

  if (images.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-content">
          <h2 className="empty-state-heading">No Images Available</h2>
          <p className="empty-state-text">
            There are no images to display in the slideshow.
          </p>
        </div>
      </div>
    );
  }

  // Function to clean up title by removing leading numbers
  const cleanTitle = (title: string) => {
    // Remove leading numbers and any spaces after them
    return title.replace(/^\d+\s*/, "");
  };

  // Determine indices for preloading next and previous slides
  const nextSlideIndex =
    currentIndex === -1
      ? 0 // If on intro, preload first slide
      : currentIndex === images.length - 1
      ? -1 // If on last slide, don't preload (or preload intro)
      : currentIndex + 1; // Otherwise preload next slide

  // Also preload the previous slide for backward navigation
  const prevSlideIndex =
    currentIndex <= 0
      ? -1 // If on intro or first slide, no previous to preload
      : currentIndex - 1; // Otherwise preload previous slide

  return (
    <div
      className="slideshow-container"
      onTouchStart={handleTouchStart}
      ref={slideRef}
      tabIndex={0}
      aria-live="polite"
      aria-atomic="true"
      role="region"
      aria-label={
        currentIndex === -1
          ? "Intro Slide"
          : `Slide ${currentIndex + 1} of ${images.length}: ${cleanTitle(
              images[currentIndex].title
            )}`
      }
    >
      {/* Error message */}
      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button
            onClick={() => setError(null)}
            className="error-dismiss-button"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Intro slide */}
      {currentIndex === -1 ? (
        <IntroSlide totalSlides={images.length} />
      ) : (
        <>
          {/* Header with parent directory name, slide title, and QR code */}
          <SlideHeader
            parentDir={images[currentIndex].parentDir}
            title={images[currentIndex].title}
          />

          {/* Main slide - flex-grow to take remaining space */}
          <MainSlide
            imagePath={images[currentIndex].path}
            imageAlt={cleanTitle(images[currentIndex].title)}
            currentIndex={currentIndex}
            totalSlides={images.length}
            onImageError={handleImageError}
          />

          {/* No button as per user request */}
        </>
      )}

      {/* Simple progress bar without tick marks */}
      <ProgressBar
        current={currentIndex === -1 ? 1 : currentIndex + 2}
        total={images.length + 1}
      />

      {/* Preload next and previous slides' images */}
      <div style={{ display: "none" }}>
        {/* Preload next slide */}
        {nextSlideIndex >= 0 && nextSlideIndex < images.length && (
          <img
            src={images[nextSlideIndex].path}
            alt={`Preload next: ${cleanTitle(images[nextSlideIndex].title)}`}
            aria-hidden="true"
          />
        )}

        {/* Preload previous slide */}
        {prevSlideIndex >= 0 && prevSlideIndex < images.length && (
          <img
            src={images[prevSlideIndex].path}
            alt={`Preload previous: ${cleanTitle(
              images[prevSlideIndex].title
            )}`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
