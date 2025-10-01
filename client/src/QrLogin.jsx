import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import App from "./App";

// ✅ DEPLOYMENT CHANGE: Use environment variable for the Socket.IO server URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const socket = io(API_URL);

const QrLogin = () => {
  const [qr, setQr] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    socket.on("qr", (qrCode) => {
      setQr(qrCode);
      setIsReady(false);
    });

    socket.on("ready", () => {
      setQr(null);
      setIsReady(true);
    });

    return () => {
      socket.off("qr");
      socket.off("ready");
    };
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center gap-4 mt-10">
        <h1 className="text-2xl font-bold">Scan the QR to continue</h1>
        {qr && <QRCodeCanvas value={qr} size={256} />}
      </div>
    );
  }

  return <App />;
};

export default QrLogin;
