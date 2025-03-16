"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { getQRCodeUrl } from "@/utils/qrCodeUtils";

// QR code component that adapts to the current environment
const LayoutQRCode = React.memo(() => {
  // State to store the QR code URL
  const [url, setUrl] = useState("https://google.com"); // Default fallback

  // Update the URL based on the environment
  useEffect(() => {
    setUrl(getQRCodeUrl());
  }, []);

  return (
    <div className="layout-qr-code">
      <QRCode value={url} size={96} style={{ height: "100%", width: "100%" }} />
    </div>
  );
});

// Add display name for React.memo component
LayoutQRCode.displayName = "LayoutQRCode";

export default LayoutQRCode;
