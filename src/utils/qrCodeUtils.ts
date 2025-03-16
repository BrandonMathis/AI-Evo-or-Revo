"use client";

/**
 * Get the appropriate URL for the QR code based on the environment
 * In development with ngrok, it returns the ngrok domain
 * In production, it returns the Vercel domain
 */
export function getQRCodeUrl(): string {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    return "https://google.com"; // Default fallback for server-side rendering
  }

  // Check if we're in development
  if (process.env.NODE_ENV === "development") {
    // Check if ngrok is running by looking for the ngrok domain in the URL
    if (window.location.hostname.includes("ngrok")) {
      // We're viewing through ngrok, use the current URL
      return window.location.origin;
    }

    // If we're on localhost but ngrok might be running
    return "https://brandonmathis.ngrok.app";
  }

  // In production, return the Vercel domain
  return "https://ato-ai-ignight-talk.vercel.app";
}
