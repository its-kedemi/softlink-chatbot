// ============================================================
// services/chatEngine.js
// Softlink Options conversation state machine
// ============================================================
const { getOrCreate, update, reset, addHistory } = require("./sessionManager");
const { askClaude } = require("./aiService");
const { saveLead } = require("./leadService");
const KB = require("./knowledgeBase");

// ─── Menu Text ───────────────────────────────────────────────
const MAIN_MENU = `👋 *Hi! Welcome to Softlink Options Limited*
Kenya's trusted web hosting & digital services provider since 2007.

How can I help you today?

1️⃣  Domain Registration
2️⃣  Web Hosting Plans
3️⃣  Website Design
4️⃣  Digital Services (SEO, Ads, SMS, AI)
5️⃣  Technical Support
6️⃣  Pricing & Quotes
7️⃣  Talk to Our Team
8️⃣  About Softlink Options

💬 Or just type your question!`;

const HOSTING_MENU = `🖥️ *Web Hosting Options*

1️⃣  Shared Hosting (KES 300–900/mo) — Popular
2️⃣  VPS Hosting — More power & control
3️⃣  Kenya VPS — Local servers, low latency
4️⃣  Dedicated Hosting — Full server, max performance
5️⃣  Managed Hosting — We handle everything
6️⃣  Reseller Hosting — Start your own hosting business
7️⃣  Object Storage — Cloud file storage
8️⃣  Hosting for NGOs
9️⃣  Hosting for Schools
🔟  Hosting for Node.js Apps

0️⃣  ← Back to Main Menu`;

const SERVICES_MENU = `⚡ *Digital Services*

1️⃣  SSL Certificate — Secure your website
2️⃣  Google Advertising — Grow with Google Ads
3️⃣  AI Automation — Automate your business
4️⃣  Digital Marketing — SEO, social media & more
5️⃣  Bulk SMS — Reach customers via SMS
6️⃣  ERP Software — Business management systems
7️⃣  Email Hosting — Business email solutions
8️⃣  Data Backup — Cloud backup & recovery

0️⃣  ← Back to Main Menu`;

// ─── Main Processor ──────────────────────────────────────────
async function processMessage(userId, userMessage) {
  const session = getOrCreate(userId);
  addHistory(userId, "user", userMessage);

  const msg = userMessage.trim().toLowerCase();
  let response;

  // Global resets
  if (["menu", "hi", "hello", "start", "hujambo", "habari"].includes(msg)) {
    update(userId, { state: "MAIN_MENU" });
    response = MAIN_MENU;
    addHistory(userId, "assistant", response);
    return { text: response, state: "MAIN_MENU" };
  }
  if (msg === "0" || msg === "back") {
    update(userId, { state: "MAIN_MENU" });
    response = MAIN_MENU;
    addHistory(userId, "assistant", response);
    return { text: response, state: "MAIN_MENU" };
  }

  switch (session.state) {
    case "MAIN_MENU":         response = await handleMain(userId, msg, session); break;
    case "HOSTING_MENU":      response = await handleHostingMenu(userId, msg, session); break;
    case "SERVICES_MENU":     response = await handleServicesMenu(userId, msg, session); break;
    case "SHARED_HOSTING":    response = await handleSharedHosting(userId, msg, session); break;
    case "DOMAIN_FLOW":       response = await handleDomainFlow(userId, msg, session); break;
    case "WEBSITE_DESIGN":    response = await handleWebsiteDesign(userId, msg, session); break;
    case "SUPPORT_FLOW":      response = await handleSupportFlow(userId, msg, session); break;
    case "QUOTE_NAME":        response = await handleQuoteName(userId, userMessage.trim(), session); break;
    case "QUOTE_EMAIL":       response = await handleQuoteEmail(userId, userMessage.trim(), session); break;
    case "QUOTE_PHONE":       response = await handleQuotePhone(userId, userMessage.trim(), session); break;
    case "QUOTE_MESSAGE":     response = await handleQuoteMessage(userId, userMessage.trim(), session); break;
    case "AI_CHAT":           response = await handleAI(userId, userMessage, session); break;
    default:
      update(userId, { state: "AI_CHAT" });
      response = await handleAI(userId, userMessage, session);
  }

  addHistory(userId, "assistant", response);
  return { text: response, state: getOrCreate(userId).state };
}

// ─── Handlers ────────────────────────────────────────────────

async function handleMain(userId, msg, session) {
  switch (msg) {
    case "1":
      update(userId, { state: "DOMAIN_FLOW" });
      return `🌐 *Domain Registration*

Register your domain name and establish your online presence!

*Our Pricing:*
━━━━━━━━━━━━━━━━━━━━
• .co.ke — *KES 1,300/year* ⭐ Best for Kenyan businesses
• .or.ke — *KES 1,300/year* — NGOs & organisations  
• .ac.ke — *KES 1,300/year* — Academic institutions
• .me.ke — *KES 1,300/year* — Personal websites
• .com   — *KES 2,500/year* — Global businesses
• .org   — *KES 2,500/year* — Global organisations
━━━━━━━━━━━━━━━━━━━━

What domain name are you looking for? Type it and I'll help, or:

1️⃣  Check domain availability →
2️⃣  I need help choosing a domain
3️⃣  Back to Main Menu`;

    case "2":
      update(userId, { state: "HOSTING_MENU" });
      return HOSTING_MENU;

    case "3":
      update(userId, { state: "WEBSITE_DESIGN" });
      return `🎨 *Website Design & Development*

We build professional, modern websites for businesses, NGOs, schools, and personal brands across Kenya.

*What we offer:*
✅ Custom website design & development
✅ Mobile-responsive (works on all devices)
✅ E-commerce / online shops
✅ WordPress websites
✅ Landing pages & portfolios
✅ Website maintenance & updates
✅ SEO-optimised code

*Our process:*
1. Consultation → 2. Design mockup → 3. Development → 4. Launch

Would you like to get a quote for your website?

1️⃣  Yes, get a quote
2️⃣  Tell me more about the process
0️⃣  Back to Main Menu`;

    case "4":
      update(userId, { state: "SERVICES_MENU" });
      return SERVICES_MENU;

    case "5":
      update(userId, { state: "SUPPORT_FLOW" });
      return `🔧 *Technical Support*

Our support team is available *24/7* to help you.

What do you need help with?

1️⃣  My website is down / not loading
2️⃣  Email not working
3️⃣  cPanel / hosting access issues
4️⃣  Domain not resolving
5️⃣  SSL certificate issue
6️⃣  Billing / payment issue
7️⃣  Something else

0️⃣  ← Back to Main Menu`;

    case "6":
      update(userId, { state: "QUOTE_NAME" });
      return `📋 *Get a Custom Quote*

I'd love to help you find the right solution! Let me get a few details.

What's your *name*?`;

    case "7":
      return `📞 *Reach Our Team*

We're here to help!

📍 *Office:* Ngong Road, Enwealth Business Centre, 5th Floor Annex _(Next to Double Tree by Hilton)_

📱 *Call/WhatsApp:*
• +254 723 498 783
• +254 712 399 544

📧 *Email:* info@softlinkoptions.com

🌐 *Client Portal:* ${KB.company.clientPortal}

⏰ *Hours:* We offer 24/7 technical support. Business inquiries: Mon-Fri 8AM-5PM.

_Type *Menu* to go back._`;

    case "8":
      return `🏢 *About Softlink Options Limited*

We are an established cloud services and web development solutions provider, grounded in *trust, teamwork, and technology*.

📅 Founded: *2007* (${KB.company.experience} of experience)
✅ Projects completed: *999+*
😊 Happy clients: *1,800+*
📍 Based in Nairobi, Kenya — serving Kenya and the US

*Our Services:*
Web hosting • Domain registration • Website design • Digital marketing • AI automation • Bulk SMS • ERP software • Email hosting • Payroll software • Data backup

*Our Values:*
Be Accountable · Communicate Openly · Drive Innovation · Work Passionately · Value People

*Vision:* To be a World Class Software Solutions Provider
*Mission:* Enable individuals and enterprises achieve greater success through technology.

🌐 ${KB.company.website}

_Type *Menu* to go back._`;

    default:
      // Free-form — route to AI
      update(userId, { state: "AI_CHAT" });
      return await handleAI(userId, getOrCreate(userId).history.slice(-2)[0]?.content || msg, session);
  }
}

async function handleHostingMenu(userId, msg, session) {
  const links = {
    "1": { state: "SHARED_HOSTING", text: null },
    "2": { url: KB.hosting.vps.url, name: "VPS Hosting", desc: KB.hosting.vps.description },
    "3": { url: KB.hosting.kenyaVps.url, name: "Kenya VPS", desc: KB.hosting.kenyaVps.description },
    "4": { url: KB.hosting.dedicated.url, name: "Dedicated Hosting", desc: KB.hosting.dedicated.description },
    "5": { url: KB.hosting.managed.url, name: "Managed Hosting", desc: KB.hosting.managed.description },
    "6": { url: KB.hosting.reseller.url, name: "Reseller Hosting", desc: KB.hosting.reseller.description },
    "7": { url: KB.hosting.objectStorage.url, name: "Object Storage", desc: KB.hosting.objectStorage.description },
    "8": { url: KB.hosting.ngos.url, name: "Hosting for NGOs", desc: KB.hosting.ngos.description },
    "9": { url: KB.hosting.schools.url, name: "Hosting for Schools", desc: KB.hosting.schools.description },
    "10": { url: KB.hosting.nodejs.url, name: "Node.js Hosting", desc: KB.hosting.nodejs.description },
  };

  if (msg === "0") {
    update(userId, { state: "MAIN_MENU" });
    return MAIN_MENU;
  }

  if (msg === "1") {
    update(userId, { state: "SHARED_HOSTING" });
    return handleSharedHosting(userId, "show", session);
  }

  const item = links[msg];
  if (item?.url) {
    update(userId, { state: "MAIN_MENU" });
    return `🖥️ *${item.name}*\n\n${item.desc}\n\n🔗 Full details & pricing:\n${item.url}\n\n📞 Questions? Call +254 723 498 783 or type *Menu* to go back.`;
  }
  return `Please reply with a number 1-10, or 0 to go back.\n\n${HOSTING_MENU}`;
}

async function handleSharedHosting(userId, msg, session) {
  if (msg === "0") { update(userId, { state: "HOSTING_MENU" }); return HOSTING_MENU; }

  const plans = KB.hosting.shared.plans;
  const planText = plans.map((p, i) =>
    `*${i + 1}. ${p.name} — ${p.price}*\n   💾 ${p.space} Storage\n   ✅ Unlimited Email, Bandwidth & Subdomains\n   ✅ Free .co.ke Domain\n   ✅ 24/7 Support · 99.9% Uptime`
  ).join("\n\n");

  if (msg === "show" || msg === "2") {
    return `🖥️ *Shared Hosting Plans*

All plans include cPanel, free .co.ke domain, unlimited email, enhanced security, and 24/7 support.

${planText}

🔥 *Special Offer:* Bronze plan at KES 450 → ${KB.hosting.shared.special.url}

Which plan interests you?

1️⃣  Basic (KES 300/mo) → Purchase
2️⃣  Bronze (KES 450/mo) → Purchase  
3️⃣  Silver (KES 900/mo) → Purchase
4️⃣  Help me choose the right plan
0️⃣  ← Back`;
  }

  const plan = plans[parseInt(msg) - 1];
  if (plan) {
    update(userId, { state: "MAIN_MENU" });
    return `✅ *${plan.name} Hosting — ${plan.price}*\n\nClick below to purchase:\n🛒 ${plan.buyUrl}\n\nNeed help? Call +254 723 498 783\nType *Menu* to go back.`;
  }

  if (msg === "4") {
    update(userId, { state: "AI_CHAT" });
    return `💡 Tell me a bit about your website needs — how much traffic do you expect, what type of site is it (blog, business, e-commerce)? I'll recommend the best plan for you.`;
  }

  return `Please reply 1, 2, 3, or 4.\n\nOr type *0* to go back.`;
}

async function handleDomainFlow(userId, msg, session) {
  if (msg === "1") {
    update(userId, { state: "MAIN_MENU" });
    return `🔍 *Check Domain Availability*\n\nSearch and register your domain here:\n🌐 ${KB.domains.registerUrl}\n\nType *Menu* to go back.`;
  }
  if (msg === "2") {
    update(userId, { state: "AI_CHAT" });
    return `💬 I can help you choose a domain! Tell me:\n• What is your business or website about?\n• What's your business name?\n\nI'll suggest the best domain options for you.`;
  }
  if (msg === "3" || msg === "0") {
    update(userId, { state: "MAIN_MENU" });
    return MAIN_MENU;
  }
  // They typed a domain name — help them with it via AI
  update(userId, { state: "AI_CHAT" });
  return await handleAI(userId, `The user wants to register this domain or is asking about it: "${msg}". Help them check if it's a good choice and what to do next. Keep it brief and practical.`, session);
}

async function handleWebsiteDesign(userId, msg, session) {
  if (msg === "1") {
    update(userId, { state: "QUOTE_NAME" });
    return `Great! Let's get you a quote.\n\nFirst, what is your *name*?`;
  }
  if (msg === "2") {
    update(userId, { state: "AI_CHAT" });
    return `🎨 Our website design process:\n\n*Step 1 — Consultation*\nWe understand your goals, audience, and design preferences.\n\n*Step 2 — Design Mockup*\nWe create a visual prototype for your approval before coding.\n\n*Step 3 — Development*\nOur developers build your site with clean, SEO-friendly code.\n\n*Step 4 — Testing*\nWe test on all devices — desktop, tablet, and mobile.\n\n*Step 5 — Launch*\nWe deploy your site and hand over full access.\n\n*Step 6 — Support*\nOngoing maintenance and updates available.\n\nAny questions? Just ask! Or type *1* to request a quote.`;
  }
  update(userId, { state: "MAIN_MENU" });
  return MAIN_MENU;
}

async function handleServicesMenu(userId, msg, session) {
  const serviceMap = {
    "1": { name: "SSL Certificate", ...KB.services.ssl },
    "2": { name: "Google Advertising", ...KB.services.googleAds },
    "3": { name: "AI Automation", ...KB.services.aiAutomation },
    "4": { name: "Digital Marketing", ...KB.services.digitalMarketing },
    "5": { name: "Bulk SMS Services", ...KB.services.bulkSms },
    "6": { name: "ERP Software", ...KB.services.erp },
    "7": { name: "Email Hosting", ...KB.services.emailHosting },
    "8": { name: "Data Backup", ...KB.services.dataBackup },
  };

  if (msg === "0") { update(userId, { state: "MAIN_MENU" }); return MAIN_MENU; }

  const svc = serviceMap[msg];
  if (svc) {
    const linkLine = svc.url ? `\n\n🔗 Learn more: ${svc.url}` : "";
    update(userId, { state: "MAIN_MENU" });
    return `✅ *${svc.name}*\n\n${svc.description}${linkLine}\n\n📞 Get a quote: +254 723 498 783\n📧 info@softlinkoptions.com\n\n_Type *Menu* to go back._`;
  }
  return `Please reply with a number 1-8 or 0 to go back.\n\n${SERVICES_MENU}`;
}

async function handleSupportFlow(userId, msg, session) {
  const issues = {
    "1": "website down / not loading",
    "2": "email not working",
    "3": "cPanel / hosting access",
    "4": "domain not resolving",
    "5": "SSL certificate issue",
    "6": "billing / payment issue",
    "7": "general technical issue",
  };

  if (msg === "0") { update(userId, { state: "MAIN_MENU" }); return MAIN_MENU; }

  const issue = issues[msg];
  if (issue) {
    update(userId, { state: "QUOTE_NAME", data: { ...getOrCreate(userId).data, issueType: issue, purpose: "support" } });
    return `🔧 *Support: ${issue}*\n\nI'll connect you with our team right away.\n\nWhat's your *name*?`;
  }
  return `Please select an option 1-7, or 0 to go back.\n\n${SERVICES_MENU}`;
}

// ─── Quote / Lead Capture Flow ────────────────────────────────

async function handleQuoteName(userId, name, session) {
  if (name.length < 2) return `Please enter a valid name:`;
  update(userId, { state: "QUOTE_EMAIL", data: { ...session.data, name } });
  return `Nice to meet you, *${name}*! 😊\n\nWhat's your *email address*? _(We'll send details to this email)_`;
}

async function handleQuoteEmail(userId, email, session) {
  if (!email.includes("@")) return `That doesn't look like an email. Please enter a valid email address:`;
  update(userId, { state: "QUOTE_PHONE", data: { ...session.data, email } });
  return `Got it! What's your *phone number*? _(So our team can reach you)_`;
}

async function handleQuotePhone(userId, phone, session) {
  if (phone.length < 7) return `Please enter a valid phone number:`;
  update(userId, { state: "QUOTE_MESSAGE", data: { ...session.data, phone } });
  const isSupport = session.data.purpose === "support";
  return isSupport
    ? `Almost done! Briefly describe the issue you're experiencing:`
    : `Almost there! Briefly describe what you need — website type, business, any specific requirements:`;
}

async function handleQuoteMessage(userId, message, session) {
  const { name, email, phone, purpose, issueType } = session.data;
  const interest = issueType || session.data.purpose || "General Inquiry";

  await saveLead({ name, email, phone, interest, message });

  update(userId, { state: "MAIN_MENU", data: {} });

  const isSupport = purpose === "support";
  return isSupport
    ? `✅ *Support request received, ${name}!*\n\nOur technical team has been notified and will contact you at *${phone}* or *${email}* shortly.\n\n⏱️ Response time: Usually within 1-2 hours (24/7 support).\n\nFor urgent issues, call us directly:\n📞 +254 723 498 783\n\nType *Menu* to go back.`
    : `✅ *Thanks ${name}! Your inquiry has been received.*\n\nOur team will reach out to you at:\n📱 ${phone}\n📧 ${email}\n\nWe'll get back to you within *1 business day* with a tailored quote.\n\nIn the meantime:\n🌐 ${KB.company.website}\n📞 +254 723 498 783\n\nType *Menu* to go back.`;
}

// ─── AI Free Chat ─────────────────────────────────────────────

async function handleAI(userId, message, session) {
  try {
    const reply = await askClaude(message, session.history.slice(-8));
    return reply;
  } catch (err) {
    console.error("AI error:", err.message);
    return `I'm having trouble answering that right now. Please contact our team directly:\n\n📞 +254 723 498 783\n📧 info@softlinkoptions.com\n🌐 ${KB.company.website}\n\nType *Menu* to see all options.`;
  }
}

module.exports = { processMessage };
