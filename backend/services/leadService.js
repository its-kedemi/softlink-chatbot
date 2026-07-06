// ============================================================
// services/leadService.js
// Captures leads (name, email, phone, interest) and optionally
// sends an email notification to the Softlink team
// ============================================================
const nodemailer = require("nodemailer");

// In-memory lead store (use a DB in production)
const leads = [];

async function saveLead(lead) {
  const entry = { ...lead, createdAt: new Date().toISOString(), id: Date.now() };
  leads.push(entry);
  console.log("📋 New lead captured:", entry);

  // Send email notification if SMTP is configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendLeadEmail(entry).catch((e) => console.error("Email send failed:", e.message));
  }
  return entry;
}

async function sendLeadEmail(lead) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Softlink Chatbot" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL || "info@softlinkoptions.com",
    subject: `🆕 New Chatbot Lead: ${lead.interest || "General Inquiry"}`,
    html: `
      <h2>New Lead from Softlink Chatbot</h2>
      <table border="1" cellpadding="8" style="border-collapse:collapse">
        <tr><td><b>Name</b></td><td>${lead.name || "Not provided"}</td></tr>
        <tr><td><b>Email</b></td><td>${lead.email || "Not provided"}</td></tr>
        <tr><td><b>Phone</b></td><td>${lead.phone || "Not provided"}</td></tr>
        <tr><td><b>Interest</b></td><td>${lead.interest || "General"}</td></tr>
        <tr><td><b>Message</b></td><td>${lead.message || "-"}</td></tr>
        <tr><td><b>Time</b></td><td>${lead.createdAt}</td></tr>
      </table>
      <p>Reply to this email or call the client directly.</p>
    `,
  });
}

function getAllLeads() {
  return leads;
}

module.exports = { saveLead, getAllLeads };
