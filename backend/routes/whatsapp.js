// routes/whatsapp.js — Twilio WhatsApp webhook
const express = require("express");
const twilio = require("twilio");
const { processMessage } = require("../services/chatEngine");

const router = express.Router();

router.post("/", async (req, res) => {
  const { Body, From } = req.body;
  console.log(`📱 WhatsApp from ${From}: "${Body}"`);

  try {
    const result = await processMessage(From, Body || "");
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(result.text);
    res.type("text/xml").send(twiml.toString());
  } catch (err) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Sorry, something went wrong. Please call us on +254 723 498 783 or type Menu to restart.");
    res.type("text/xml").send(twiml.toString());
  }
});

module.exports = router;
