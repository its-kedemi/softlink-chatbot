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

// ------------------------------------------------------------
// Security
// ------------------------------------------------------------
app.use(helmet());

// ------------------------------------------------------------
// Logging
// ------------------------------------------------------------
app.use(morgan("dev"));

// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000"
).split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ------------------------------------------------------------
// Body Parser (VERY IMPORTANT)
// ------------------------------------------------------------
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// ------------------------------------------------------------
// Running behind Nginx Reverse Proxy
// ------------------------------------------------------------
app.set("trust proxy", 1);

// ------------------------------------------------------------
// Rate Limiter
// ------------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.use("/api/chat", chatRoutes);
app.use("/webhook/whatsapp", whatsappRoutes);

// ------------------------------------------------------------
// Health Check
// ------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Softlink Options Chatbot",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------
// 404 Handler
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ------------------------------------------------------------
// Global Error Handler
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Server Error:");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ------------------------------------------------------------
// Start Server
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("🚀 Softlink Chatbot Started");
  console.log("========================================");
  console.log(`Server  : http://localhost:${PORT}`);
  console.log(`Health  : http://localhost:${PORT}/health`);
  console.log(`Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`WhatsApp: http://localhost:${PORT}/webhook/whatsapp`);
  console.log("========================================");
  console.log("");
});
