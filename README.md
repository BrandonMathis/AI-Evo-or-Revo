# AI Evolution or Revolution Slideshow

A set of slides for a talk Brandon Mathis gave at allthingsopen.ai. The images in `public/images` were collected by hand but this codebase was generated entirely via "Vibe Coding" with VS Code ([https://code.visualstudio.com/](https://code.visualstudio.com/)), Anthropic ([https://www.anthropic.com/](https://www.anthropic.com/)) and Roo. It is built in Next.js and deployed on Vercel. It was used as a slideshow presentation tool and supports desktop and well as mobile with complex gestures for navigating through slides. It optimizes images and loads only the slide's image you are looking at as well as the next slide upcoming for optimized scrolling. This project was entirely coded by AI under the direction of a software engineer (Brandon Mathis).

## Features

- Responsive slideshow with keyboard and touch navigation
- QR code that adapts to development and production environments
- Mobile-friendly design
- Optimized image loading for smooth scrolling

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd AI-Evo-or-Revo
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

## Development

### Standard Development

```bash
npm run dev
```

This starts the Next.js development server on http://localhost:3000.

### Development with Ngrok (Mobile Testing)

```bash
npm run dev:ngrok
```

This starts the Next.js development server and exposes it through ngrok, which:

- Provides a public URL for testing on mobile devices
- Displays a QR code in the top-right corner that points to the ngrok URL (hidden on mobile devices)
- Allows you to share your local development with others

When running in this mode, you can scan the QR code with your phone to view the slideshow on your mobile device. Any changes you make to the code will be reflected when you refresh the page.

## Production

```bash
npm run build
npm run start
```

In production mode, the QR code will point to the Vercel deployment URL.

## QR Code Functionality

The QR code in the top-right corner of the slideshow adapts based on the environment:

- **Development with Ngrok**: Points to the ngrok URL, allowing you to scan and view on mobile devices
- **Production**: Points to the Vercel deployment URL

The QR code is automatically hidden on mobile devices (screen width less than 768px) since it's not needed when already viewing on a mobile device.

This makes it easy to share the slideshow with others, whether you're developing locally or have deployed to production.

## Vibe Coding Details

This project was generated entirely via "Vibe Coding" with VS Code, Anthropic, and Roo. Vibe Coding is a methodology where a software engineer directs AI to generate code through iterative prompting and refinement. This project showcases the potential of AI in software development when guided by human expertise.

Roo ([https://www.roovet.com/](https://www.roovet.com/)) is an AI assistant that was instrumental in the development of this project.

## Technical Details

The project is built with Next.js and uses the following key components:

- **`src/app/page.tsx`:** This is the main page of the application, which redirects to the intro slide (`/slides/intro`).
- **`src/components/Slideshow.tsx`:** This component handles the slideshow functionality, including state management, navigation, keyboard controls, touch events, image preloading, accessibility, and error handling. It uses `useState` to manage the current slide index and `window.history.pushState` to update the browser history.
- **`src/utils/imageUtils.ts`:** This utility file contains the `getAllImages()` function, which recursively reads the `public/images` directory and its subdirectories to find all image files. It extracts the image title from the filename and the parent directory name from the directory structure.
- **`src/app/api/images/route.ts`:** This file defines an API endpoint (`/api/images`) that returns a list of all images in the `public/images` directory. It uses the `getAllImages()` function from `src/utils/imageUtils.ts` to get the list of images.

The slideshow supports keyboard and touch navigation, allowing users to navigate between slides using arrow keys, spacebar, Page Up/Down, Escape, Home, End keys, and swipe gestures on mobile devices. It optimizes image loading by preloading the next and previous slides' images for smoother transitions.

## Token & API Cost Summary

Total Tokens Used: 413,000
Total Cached Tokens: 3,185,800
Total API Cost: $44.52

### Potential Climate Impact

Using the estimate of 0.3 kg CO₂ per $1 spent:

Total CO₂ Emission: ~13.36 kg CO₂
(Equivalent to driving ~36 miles in a gasoline car.)

## AI Prompting Guides for Software Engineers

Here are some useful resources for software engineers who want to learn how to effectively prompt AI models for code generation:

- [OpenAI Cookbook](https://github.com/openai/openai-cookbook): Examples and guides for using OpenAI APIs.
- [Prompt Engineering Guide](https://www.promptingguide.ai/): A comprehensive guide to prompt engineering techniques.

---

_This README.md file was also generated by AI._
