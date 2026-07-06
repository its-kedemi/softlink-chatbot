# 💻 Softlink Options — AI Chatbot

Customer support & sales chatbot for **Softlink Options Limited** (softlinkoptions.co.ke).

---

## What It Does

| Feature | Description |
|---------|-------------|
| 🌐 Domain enquiries | Shows pricing for .co.ke, .com, .org etc, links to registration |
| 🖥️ Hosting plans | Walks through Shared, VPS, Dedicated, Managed, Reseller & more |
| 🎨 Website design | Explains the process, captures quote requests |
| ⚡ Digital services | SSL, Google Ads, AI Automation, Digital Marketing, Bulk SMS, ERP |
| 🔧 Support tickets | Categorises issues, captures contact details, notifies team by email |
| 📋 Lead capture | Name + email + phone + message → saved + email notification sent |
| 🤖 AI free chat | Ask anything — powered by Claude, knows all Softlink services |
| 📱 WhatsApp | Full WhatsApp bot via Twilio (same logic, same flows) |

---

## File Structure

```
softlink-chatbot/
├── backend/
│   ├── server.js                   ← Express app entry
│   ├── .env.example                ← Copy to .env
│   ├── routes/
│   │   ├── chat.js                 ← Web API endpoints
│   │   └── whatsapp.js             ← Twilio webhook
│   └── services/
│       ├── chatEngine.js           ← All conversation flows
│       ├── knowledgeBase.js        ← ALL pricing & service info ← Edit this!
│       ├── aiService.js            ← Claude AI integration
│       ├── sessionManager.js       ← Per-user state
│       └── leadService.js          ← Lead capture + email alerts
└── frontend/
    └── src/App.js                  ← React chat UI
```

> 📌 **To update pricing or services:** only edit `backend/services/knowledgeBase.js`

---

## 🚀 Setup (WSL)

### Step 1 — Install Node.js (if not already)
```bash
# In WSL terminal:
node --version   # Should be v18+

# If not installed:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2 — Install dependencies
```bash
cd ~/projects/softlink-chatbot

cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3 — Configure environment
```bash
cd backend
cp .env.example .env
nano .env
```

Minimum required:
```env
PORT=3001
ANTHROPIC_API_KEY=sk-ant-...      ← From console.anthropic.com (free to start)
```

Optional for email notifications on new leads:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourteam@gmail.com
SMTP_PASS=your_gmail_app_password  ← NOT your regular password
NOTIFY_EMAIL=info@softlinkoptions.com
```
> Get Gmail App Password: Google Account → Security → App Passwords
> Watch: https://www.youtube.com/watch?v=hXiPshHn9Pw

### Step 4 — Run the app

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# You should see: 🚀 Softlink Chatbot running → http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# Browser opens at http://localhost:3000
```

### Step 5 — Test it!
Try these in the chat:
- `1` → Domain pricing
- `2` → Hosting plans
- `2` → `1` → Shared Hosting plans
- `6` → Request a quote (captures lead + sends email if configured)
- Type freely: "What's the difference between VPS and Dedicated hosting?"

---

## 📱 WhatsApp Setup (Twilio)

📺 **Tutorial:** https://www.youtube.com/watch?v=98OewpG8-Jo

1. Create free Twilio account at https://console.twilio.com
2. Go to **Messaging → Try it → Send a WhatsApp message**
3. Join their sandbox by WhatsApp-ing `join <your-word>`

4. Install and run ngrok to expose your local server:
```bash
# Install ngrok in WSL
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Sign up at ngrok.com → get authtoken
ngrok config add-authtoken YOUR_TOKEN

# Expose backend
ngrok http 3001
# Note the https URL e.g: https://abc123.ngrok.io
```

5. In Twilio console → Sandbox Settings → set webhook to:
   `https://abc123.ngrok.io/webhook/whatsapp`

6. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

7. Restart backend → WhatsApp `Hi` to Twilio sandbox number 🎉

---

## 🌍 Embed on softlinkoptions.co.ke

To add this as a floating chat widget on your website:

### Option A — iframe embed (simplest)
Add this to any page's HTML:
```html
<!-- Floating chat button -->
<div id="softlink-chat-btn" onclick="document.getElementById('softlink-chat-frame').style.display='block'; this.style.display='none';"
  style="position:fixed;bottom:24px;right:24px;background:#28307b;color:white;border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;box-shadow:0 4px 20px rgba(40,48,123,0.4);z-index:9999;">
  💬
</div>

<!-- Chat iframe -->
<iframe id="softlink-chat-frame"
  src="https://YOUR_CHATBOT_URL"
  style="display:none;position:fixed;bottom:24px;right:24px;width:420px;height:700px;border:none;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:9998;"
></iframe>
```
Replace `YOUR_CHATBOT_URL` with your deployed chatbot URL.

### Option B — Deploy to Railway first (free)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
📺 https://www.youtube.com/watch?v=HHgH185SDQQ

---

## 🔧 Customisation

### Update pricing/services
Edit `backend/services/knowledgeBase.js` — everything is clearly labelled.

### Change AI personality
Edit the `SYSTEM_PROMPT` in `backend/services/aiService.js`.

### Add a new menu option
1. Add the option text in `chatEngine.js` in the relevant menu string
2. Add a case in the handler function
3. Add quick replies in `frontend/src/App.js` in the `QR` object

### View captured leads
Visit: `http://localhost:3001/api/chat/leads`
(Protect with a password in production — see Express basic-auth package)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Install Node.js (see Step 1) |
| Port 3001 in use | `kill -9 $(lsof -t -i:3001)` |
| Chat says "connection error" | Is backend running on 3001? Check Terminal 1 |
| AI not responding | Check `ANTHROPIC_API_KEY` in `.env`, restart backend |
| Email not sending | Use Gmail App Password (not regular password), check SMTP settings |
| WhatsApp not responding | Re-join Twilio sandbox, check ngrok is still running |

---

*Softlink Options Limited · softlinkoptions.co.ke · info@softlinkoptions.com*
