// ============================================================
// Softlink Options Chatbot — server.js
// ============================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const chatRoutes = require("./routes/chat");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(morgan("dev"));
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:3000"
).split(",");

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120 });
app.use(limiter);

app.use("/api/chat", chatRoutes);
app.use("/webhook/whatsapp", whatsappRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Softlink Options Chatbot", time: new Date() });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Softlink Chatbot running → http://localhost:${PORT}`);
  console.log(`📱 WhatsApp webhook → http://localhost:${PORT}/webhook/whatsapp\n`);
});
