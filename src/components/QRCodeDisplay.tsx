"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  className?: string;
}

/**
 * A simplified QR code component
 * Note: This component is kept for backward compatibility,
 * but new code should use the QR code in the layout
 */
const QRCodeDisplay = React.memo(function QRCodeDisplay({
  url,
  size = 100,
  className,
}: QRCodeDisplayProps) {
  return (
    <div className={className}>
      <QRCode
        value={url}
        size={size}
        style={{ height: "auto", maxWidth: "100%" }}
      />
    </div>
  );
});

export default QRCodeDisplay;
