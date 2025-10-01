import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import App from "./App";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const socket = io(API_URL);

// A simple CSS spinner component for visual feedback
const Spinner = () => (
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-700"></div>
);

const QrLogin = () => {
  const [qr, setQr] = useState(null);
  const [isReady, setIsReady] = useState(false);
  // State to hold the current status message for the user
  const [statusMessage, setStatusMessage] = useState("Initializing client & generating QR code...");

  useEffect(() => {
    socket.on("qr", (qrCode) => {
      setQr(qrCode);
      setStatusMessage("Please scan the QR code with WhatsApp.");
    });

    // Listener for the authenticated event from the backend
    socket.on("authenticated", () => {
      setQr(null); // Hide QR code after scanning
      setStatusMessage("Authentication successful! Finalizing connection...");
    });

    socket.on("ready", () => {
      setQr(null);
      setIsReady(true);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      socket.off("qr");
      socket.off("authenticated");
      socket.off("ready");
    };
  }, []);

  // If the client is ready, show the main application
  if (isReady) {
    return <App />;
  }

  // Otherwise, show the login UI with status indicators
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 mt-10 p-4">
      <h1 className="text-2xl font-bold">{statusMessage}</h1>
      
      {/* Show the QR code when available, otherwise show a spinner */}
      <div className="w-64 h-64 flex items-center justify-center bg-white rounded-lg shadow-md">
        {qr ? (
          <QRCodeCanvas value={qr} size={256} />
        ) : (
          <Spinner />
        )}
      </div>

      <p className="text-gray-600">This can take a moment. Please be patient.</p>
    </div>
  );
};

export default QrLogin;

