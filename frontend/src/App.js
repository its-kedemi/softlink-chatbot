/* ============================================================
   Softlink Options — AI Chat Assistant
   Brand: Navy #28307b / Electric blue accent / White
   Font: Sora
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// ─── Brand Tokens ─────────────────────────────────────────────
const C = {
  navy: "#28307b",
  navyDark: "#1a1f55",
  navyLight: "#3a44a0",
  accent: "#4f6ef7",
  accentGlow: "rgba(79,110,247,0.18)",
  white: "#ffffff",
  offWhite: "#f5f6ff",
  bubble: "#eef0ff",
  userBubble: "#28307b",
  text: "#1a1a2e",
  muted: "#7b82b5",
  border: "#e2e4f0",
  bg: "#f0f1fb",
};

// ─── Quick replies by state ───────────────────────────────────
const QR = {
  MAIN_MENU: ["1 - Domain", "2 - Hosting", "3 - Website Design", "4 - Digital Services", "5 - Support"],
  HOSTING_MENU: ["1 - Shared Hosting", "2 - VPS", "4 - Dedicated", "5 - Managed", "0 - Back"],
  SERVICES_MENU: ["1 - SSL", "2 - Google Ads", "3 - AI Automation", "4 - Digital Marketing", "5 - Bulk SMS"],
  SHARED_HOSTING: ["1 - Basic KES 300", "2 - Bronze KES 450", "3 - Silver KES 900", "4 - Help me choose"],
  DOMAIN_FLOW: ["1 - Check availability", "2 - Help choosing", "0 - Back"],
  WEBSITE_DESIGN: ["1 - Get a quote", "2 - Learn more", "0 - Back"],
  SUPPORT_FLOW: ["1 - Website down", "2 - Email issues", "3 - cPanel access", "6 - Billing"],
  AI_CHAT: ["Hosting pricing", "How to register a domain", "Website design cost", "Menu"],
};

function formatTime(d) {
  return d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

// ─── Typing dots ──────────────────────────────────────────────
function Typing() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "12px 16px", background: C.bubble, borderRadius: "6px 18px 18px 18px", width: "fit-content", boxShadow: "0 1px 4px rgba(40,48,123,0.08)" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.navy, animation: `softPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────
function Bubble({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end", animation: "slideUp 0.22s ease forwards" }}>
      <div style={{
        maxWidth: "84%",
        background: isBot ? C.bubble : C.userBubble,
        color: isBot ? C.text : C.white,
        borderRadius: isBot ? "6px 18px 18px 18px" : "18px 6px 18px 18px",
        padding: "10px 15px",
        boxShadow: isBot ? "0 1px 4px rgba(40,48,123,0.08)" : "0 2px 8px rgba(40,48,123,0.25)",
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.text.replace(/\*/g, "")}
      </div>
      <div style={{ fontSize: 10, color: C.muted, marginTop: 3, padding: "0 4px" }}>{formatTime(msg.time)}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId] = useState(() => uuidv4());
  const [typing, setTyping] = useState(false);
  const [state, setState] = useState("MAIN_MENU");
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  const scrollBottom = useCallback(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), []);
  useEffect(() => { scrollBottom(); }, [messages, typing, scrollBottom]);

  useEffect(() => {
    if (!started) { setStarted(true); initChat(); }
  }, []); // eslint-disable-line

  async function initChat() {
    setTyping(true);
    try {
      const res = await axios.post("/api/chat/start");
      setMessages([{ role: "bot", text: res.data.reply, time: new Date() }]);
      setState(res.data.state);
    } catch {
      setMessages([{ role: "bot", text: "⚠️ Could not connect to the server.\n\nMake sure the backend is running on port 3001, then refresh.", time: new Date() }]);
    } finally { setTyping(false); }
  }

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: msg, time: new Date() }]);
    setTyping(true);
    try {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
      const res = await axios.post("/api/chat/message", { userId, message: msg });
      setState(res.data.state);
      setMessages((p) => [...p, { role: "bot", text: res.data.reply, time: new Date() }]);
    } catch {
      setMessages((p) => [...p, { role: "bot", text: "⚠️ Connection error. Please try again or call +254 723 498 783.", time: new Date() }]);
    } finally { setTyping(false); }
  }

  const quickReplies = QR[state] || [];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #1a1f3c; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        @keyframes softPulse { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .qr-btn:hover { background: ${C.navy} !important; color: white !important; transform: translateY(-1px); }
        .send-btn:hover { background: ${C.navyLight} !important; }
        .send-btn:active { transform: scale(0.94); }
        textarea:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentGlow} !important; }
      `}</style>

      {/* Outer shell — dark navy bg */}
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1a1f3c 0%, #28307b 50%, #1a1f55 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>

        {/* Chat window */}
        <div style={{ width: "100%", maxWidth: 440, height: "calc(100vh - 32px)", maxHeight: 800, display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}>

          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${C.navyDark}, ${C.navy})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💻</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Softlink Options</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>🟢 AI Assistant · Always online</div>
            </div>
            <a href="https://softlinkoptions.co.ke" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 10px", fontWeight: 600 }}>Website ↗</a>
          </div>

          {/* Info strip */}
          <div style={{ background: C.accentGlow, borderBottom: `1px solid ${C.border}`, padding: "8px 20px", fontSize: 12, color: C.navy, textAlign: "center", fontWeight: 500, flexShrink: 0, background: "#eef0ff" }}>
            ☎️ +254 723 498 783 &nbsp;·&nbsp; 📧 info@softlinkoptions.com
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8, background: C.bg }}>
            <div style={{ alignSelf: "center", background: "rgba(40,48,123,0.1)", color: C.muted, fontSize: 11, padding: "3px 12px", borderRadius: 12, marginBottom: 4, fontWeight: 500 }}>
              {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
            </div>

            {messages.map((m, i) => <Bubble key={i} msg={m} />)}

            {typing && (
              <div style={{ animation: "slideUp 0.2s ease forwards" }}>
                <Typing />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {quickReplies.length > 0 && !typing && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 14px 6px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
              {quickReplies.map((qr) => (
                <button key={qr} className="qr-btn" style={{ background: "white", border: `1.5px solid ${C.navy}`, color: C.navy, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontFamily: "'Sora', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }} onClick={() => send(qr.split(" - ")[0])}>
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{ display: "flex", gap: 10, padding: "10px 14px 14px", background: C.bg, alignItems: "flex-end" }}>
            <textarea
              ref={taRef}
              rows={1}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              disabled={typing}
              style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: "10px 16px", fontSize: 14, fontFamily: "'Sora', sans-serif", outline: "none", resize: "none", background: "white", color: C.text, lineHeight: 1.4, maxHeight: 100, overflowY: "auto", transition: "border-color 0.2s, box-shadow 0.2s" }}
            />
            <button
              className="send-btn"
              onClick={() => send()}
              disabled={typing}
              title="Send"
              style={{ width: 44, height: 44, borderRadius: "50%", background: C.navy, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", opacity: typing ? 0.5 : 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "6px 16px 10px", fontSize: 10, color: C.muted, background: C.bg }}>
            Powered by AI · <a href="https://softlinkoptions.co.ke" style={{ color: C.accent, textDecoration: "none" }}>softlinkoptions.co.ke</a>
          </div>
        </div>
      </div>
    </>
  );
}
