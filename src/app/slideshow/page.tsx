"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./slideshow-page.css";

export default function SlideshowPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new URL structure
    router.replace("/slides/intro");
  }, [router]);

  // Show nothing during loading/redirect
  return null;
}
