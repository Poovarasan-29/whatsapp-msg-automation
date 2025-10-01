import express from "express";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { Server } from "socket.io";
import http from "http";
import cors from "cors";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // ✅ DEPLOYMENT CHANGE: Restrict CORS to your frontend's domain
  cors: { origin: "https://whatsapp-msg-automation.vercel.app" }, // <-- IMPORTANT: Change this to your live frontend URL
});

app.use(express.json());
app.use(cors());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "my-whatsapp-session" }),
  // ✅ DEPLOYMENT CHANGE: Server-friendly Puppeteer configuration
  puppeteer: {
    headless: true,
    // On most servers, you don't need to specify a path if Chrome/Chromium is installed correctly.
    // These args are often necessary for server environments.
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
});

let isClientReady = false;

client.on("qr", (qr) => {
  console.log("📲 QR generated, sending to frontend...");
  io.emit("qr", qr);
});

client.on("ready", () => {
  isClientReady = true;
  console.log("✅ WhatsApp Client is ready!");
  io.emit("ready");
});

app.post("/send-message", async (req, res) => {
  if (!isClientReady) {
    return res.status(503).json({ error: "WhatsApp client not ready yet" });
  }
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      return res.status(400).json({ error: "Number and message are required" });
    }

    const chatId = `${number}@c.us`;
    await client.sendMessage(chatId, message);

    return res.json({ success: true, number, message, info: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ DEPLOYMENT CHANGE: Use port from environment variables for hosting
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

client.initialize();
