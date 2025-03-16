"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to intro slide with the new URL structure
    router.push("/slides/intro");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Slideshow...</h1>
      </div>
    </div>
  );
}
