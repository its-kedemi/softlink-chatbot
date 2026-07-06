// ============================================================
// services/sessionManager.js — Per-user conversation state
// ============================================================
const sessions = new Map();
const TTL = 30 * 60 * 1000; // 30 min inactivity

function getOrCreate(userId) {
  let s = sessions.get(userId);
  if (!s || Date.now() - s.lastActivity > TTL) {
    s = { userId, state: "MAIN_MENU", data: {}, history: [], lastActivity: Date.now() };
    sessions.set(userId, s);
  }
  s.lastActivity = Date.now();
  return s;
}

function update(userId, changes) {
  const s = getOrCreate(userId);
  Object.assign(s, changes);
  sessions.set(userId, s);
  return s;
}

function reset(userId) {
  sessions.delete(userId);
  return getOrCreate(userId);
}

function addHistory(userId, role, content) {
  const s = getOrCreate(userId);
  s.history.push({ role, content });
  if (s.history.length > 20) s.history = s.history.slice(-20);
  sessions.set(userId, s);
}

module.exports = { getOrCreate, update, reset, addHistory };
