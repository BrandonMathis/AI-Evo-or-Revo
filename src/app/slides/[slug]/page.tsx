"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Slideshow from "@/components/Slideshow";
import "../../slideshow/slideshow-page.css";

// Define the image type
interface SlideImage {
  path: string;
  title: string;
  parentDir: string;
}

// Cache for images to prevent duplicate fetches
let cachedImages: SlideImage[] | null = null;

// Function to convert title to slug
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^[0-9]+\s*/, ""); // Remove leading numbers
};

// Function to find slide index by slug
const findSlideIndexBySlug = (images: SlideImage[], slug: string): number => {
  if (slug === "intro") return -1;

  const index = images.findIndex((image) => titleToSlug(image.title) === slug);
  return index !== -1 ? index : -1;
};

export default function SlideBySlugPage() {
  const [images, setImages] = useState(cachedImages || []);
  const [loading, setLoading] = useState(!cachedImages);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // Memoized fetch function to prevent unnecessary re-fetches
  const fetchImages = useCallback(async () => {
    // Skip if we already have cached images
    if (cachedImages) {
      console.log("[SlideBySlug] Using cached images");
      setImages(cachedImages);
      setLoading(false);
      return;
    }

    try {
      console.log("[SlideBySlug] Fetching images from API");
      const response = await fetch("/api/images", {
        cache: "force-cache",
      });
      const data = await response.json();
      console.log(`[SlideBySlug] Fetched ${data.length} images`);
      cachedImages = data; // Cache the result
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      router.push("/");
    }
  }, [router]);

  // Fetch images only once on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // We don't need the keyboard shortcut handler here anymore
  // as the Slideshow component now handles navigation with browser history

  // Show nothing during loading
  if (loading) {
    return null;
  }

  // Find the slide index based on the slug
  const slideIndex = findSlideIndexBySlug(images, slug);
  console.log(
    `[SlideBySlug] Found slide index ${slideIndex} for slug "${slug}"`
  );

  // If slug is invalid, redirect to intro
  if (slideIndex === -1 && slug !== "intro") {
    console.log(`[SlideBySlug] Invalid slug "${slug}", redirecting to intro`);
    router.push("/slides/intro");
    return null;
  }

  return (
    <Slideshow
      images={images}
      initialSlideIndex={slideIndex}
      useSlugUrls={true}
    />
  );
}
