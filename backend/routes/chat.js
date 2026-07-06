// routes/chat.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { processMessage } = require("../services/chatEngine");
const { getAllLeads } = require("../services/leadService");

const router = express.Router();

router.post("/message", async (req, res) => {
  const { userId, message } = req.body;
  if (!message || message.length > 500) return res.status(400).json({ error: "Invalid message" });
  const uid = userId || uuidv4();
  try {
    const result = await processMessage(uid, message);
    res.json({ userId: uid, reply: result.text, state: result.state, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

router.post("/start", async (req, res) => {
  const userId = uuidv4();
  const result = await processMessage(userId, "hi");
  res.json({ userId, reply: result.text, state: result.state, timestamp: new Date().toISOString() });
});

// Admin: view captured leads (protect with auth in production!)
router.get("/leads", (req, res) => {
  res.json(getAllLeads());
});

module.exports = router;
