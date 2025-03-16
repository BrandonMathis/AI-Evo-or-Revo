"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "../slideshow-page.css";

// Function to convert title to slug
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^[0-9]+\s*/, ""); // Remove leading numbers
};

// Define the image type
interface SlideImage {
  path: string;
  title: string;
  parentDir: string;
}

// Cache for images to prevent duplicate fetches
let cachedImages: SlideImage[] | null = null;

export default function SlideIndexPage() {
  const router = useRouter();
  const params = useParams();
  const slideIndex = params.slideIndex
    ? parseInt(params.slideIndex as string, 10)
    : -1;

  // Fetch images and redirect to the new URL structure
  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // If we already have cached images, use them
        if (cachedImages) {
          redirectToNewUrl(cachedImages);
          return;
        }

        // Otherwise fetch the images
        const response = await fetch("/api/images", {
          cache: "force-cache",
        });
        const data = await response.json();
        cachedImages = data;
        redirectToNewUrl(data);
      } catch (error) {
        console.error("Error fetching images:", error);
        router.push("/slides/intro");
      }
    };

    const redirectToNewUrl = (images: SlideImage[]) => {
      // Redirect to the intro slide
      if (slideIndex === -1) {
        console.log("[slideIndex] Redirecting to intro slide");
        router.push("/slides/intro");
        return;
      }

      // Validate slideIndex
      if (slideIndex < 0 || slideIndex >= images.length) {
        console.log(
          `[slideIndex] Invalid index ${slideIndex}, redirecting to intro`
        );
        router.push("/slides/intro");
        return;
      }

      // Redirect to the new URL with the slug
      const slug = titleToSlug(images[slideIndex].title);
      console.log(`[slideIndex] Redirecting to slide with slug: ${slug}`);
      router.push(`/slides/${slug}`);
    };

    fetchAndRedirect();
  }, [router, slideIndex]);

  // Show nothing during loading/redirect
  return null;
}
