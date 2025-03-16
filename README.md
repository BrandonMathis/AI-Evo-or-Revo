# AI Evolution or Revolution Slideshow

A slideshow application built with Next.js that explores the evolution and revolution of AI in software development.

## Features

- Responsive slideshow with keyboard and touch navigation
- QR code that adapts to development and production environments
- Mobile-friendly design

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
