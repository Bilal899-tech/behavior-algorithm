(function () {
  const FAQ = {
    "pricing": "Our plans start at $29/mo for Starter, $79/mo for Growth, and $199/mo for Enterprise. Each plan includes AI behavior tracking with increasing limits.",
    "features": "BehaviorAgent offers: real-time tracking, AI sentiment analysis, smart discount engine, exit intent detection, toast notifications, and a full analytics dashboard.",
    "free trial": "Yes! We offer a 14-day free trial with full features. No credit card required. Click Get Started to begin.",
    "setup": "Setup takes less than 1 hour. Add our script to your site, configure your preferences, and tracking starts immediately.",
    "security": "All behavior data is processed locally using our algorithm-based engine. No data leaves your browser or server.",
    "data": "Behavior data stays in your browser localStorage. No data is sent to external servers.",
    "discount": "Use code WELCOME20 for 20% off your first month, or EARLY10 for 10% off any plan.",
    "contact": "You can reach our team at support@behavioragent.ai. We respond within 2-4 hours.",
    "cancel": "You can cancel anytime from your dashboard. No long-term contracts. 14-day full refund."
  };
  const SERVICE_INFO = {
    "Web Development": "Our Web Development service ($1,499/project) includes full-stack development with behavior tracking built-in.",
    "SEO Optimization": "SEO Optimization ($899/mo) uses behavior data to improve rankings based on user interaction.",
    "UX Design": "UX Design ($2,499/project) creates interfaces backed by real behavior data.",
    "Mobile App Dev": "Mobile App Development ($3,999/project) for iOS and Android with integrated behavior analytics.",
    "Content Strategy": "Content Strategy ($599/mo) creates content optimized for your audience based on behavior patterns.",
    "Analytics Setup": "Analytics Setup ($1,199/setup) installs custom dashboards with AI behavior insights."
  };
  let open = false;
  const c = document.createElement("div");
  c.innerHTML = `<style>
    #algChat * { margin:0; padding:0; box-sizing:border-box; font-family:system-ui,-apple-system,sans-serif; }
    #algBubble { position:fixed;bottom:1.5rem;left:1.5rem;z-index:99998;width:56px;height:56px;border-radius:50%;background:#38bdf8;color:#0f172a;border:none;cursor:pointer;font-size:1.5rem;box-shadow:0 4px 20px rgba(56,189,248,0.3);transition:0.3s;display:flex;align-items:center;justify-content:center; }
    #algBubble:hover { transform:scale(1.1); }
    #algBubble .badge { position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#ef4444;color:#fff;border-radius:50%;font-size:0.6rem;display:flex;align-items:center;justify-content:center;display:none; }
    #algPanel { position:fixed;bottom:5.5rem;left:1.5rem;z-index:99998;width:360px;max-height:480px;background:#1e293b;border-radius:16px;border:1px solid #334155;box-shadow:0 12px 48px rgba(0,0,0,0.5);display:none;flex-direction:column;overflow:hidden;animation:chatIn 0.25s ease-out; }
    #algPanel.open { display:flex; }
    @keyframes chatIn { from { opacity:0;transform:translateY(20px) scale(0.95); } to { opacity:1;transform:translateY(0) scale(1); } }
    #algHeader { padding:1rem 1.2rem;background:#0f172a;display:flex;justify-content:space-between;align-items:center; }
    #algHeader h4 { color:#e2e8f0;font-size:0.9rem;display:flex;align-items:center;gap:0.4rem; }
    #algHeader h4 .dot { width:8px;height:8px;background:#22c55e;border-radius:50%;display:inline-block; }
    #algHeader .close { color:#64748b;cursor:pointer;font-size:0.9rem;background:none;border:none;padding:0.2rem; }
    #algHeader .close:hover { color:#ef4444; }
    #algContext { padding:0.5rem 1.2rem;background:rgba(56,189,248,0.06);border-bottom:1px solid #0f172a;font-size:0.78rem;color:#94a3b8;display:none; }
    #algMessages { flex:1;overflow-y:auto;padding:1rem 1.2rem;display:flex;flex-direction:column;gap:0.6rem;min-height:200px;max-height:300px; }
    #algMessages .msg { max-width:85%;padding:0.6rem 0.9rem;border-radius:10px;font-size:0.85rem;line-height:1.5;animation:msgIn 0.2s ease-out; }
    @keyframes msgIn { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
    #algMessages .msg.user { align-self:flex-end;background:#38bdf8;color:#0f172a;border-bottom-right-radius:4px; }
    #algMessages .msg.bot { align-self:flex-start;background:#0f172a;color:#cbd5e1;border-bottom-left-radius:4px; }
    #algInputRow { display:flex;gap:0.5rem;padding:0.8rem 1.2rem;border-top:1px solid #0f172a; }
    #algInputRow input { flex:1;padding:0.6rem 0.8rem;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:0.85rem;outline:none; }
    #algInputRow input:focus { border-color:#38bdf8; }
    #algInputRow button { padding:0.6rem 1rem;background:#38bdf8;color:#0f172a;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.82rem; }
    #algInputRow button:hover { background:#0ea5e9; }
    #algSuggest { padding:0.3rem 1.2rem 0.8rem;display:flex;gap:0.4rem;flex-wrap:wrap; }
    #algSuggest button { background:#0f172a;color:#64748b;border:1px solid #334155;padding:0.3rem 0.6rem;border-radius:6px;font-size:0.75rem;cursor:pointer; }
    #algSuggest button:hover { border-color:#38bdf8;color:#38bdf8; }
    @media (max-width:480px) { #algPanel { left:0.5rem;right:0.5rem;width:auto;max-height:70vh; } }
  </style>
  <button id="algBubble">???<span class="badge" id="algBadge">1</span></button>
  <div id="algPanel">
    <div id="algHeader"><h4><span class="dot"></span> RuleBot FAQ</h4><button class="close" id="algClose">?</button></div>
    <div id="algContext"></div>
    <div id="algMessages"><div class="msg bot">Hi! I am your rule-based assistant. Ask me about pricing, features, or services!</div></div>
    <div id="algSuggest"></div>
    <div id="algInputRow"><input id="algInput" placeholder="Ask a question..." /><button id="algSend">Send</button></div>
  </div>`;
  c.id = "algChat"; document.body.appendChild(c);
  const bubble = document.getElementById("algBubble"), panel = document.getElementById("algPanel"), closeBtn = document.getElementById("algClose"), msgs = document.getElementById("algMessages"), input = document.getElementById("algInput"), sendBtn = document.getElementById("algSend"), ctxBar = document.getElementById("algContext"), suggest = document.getElementById("algSuggest"), badge = document.getElementById("algBadge");
  let hasNew = false;
  function updateContext(d) {
    if (d && d.service) {
      ctxBar.textContent = "Detected interest: " + d.service + (d.discount ? " - " + d.discount + "% off!" : "");
      ctxBar.style.display = "block"; suggest.innerHTML = "";
      ["Tell me about " + d.service, "How much does it cost?", "Pricing plans", "Setup process"].forEach(t => {
        const b = document.createElement("button"); b.textContent = t; b.onclick = () => { input.value = t; sendMsg(); }; suggest.appendChild(b);
      });
      if (!open) { hasNew = true; badge.style.display = "flex"; }
    }
  }
  window.addEventListener("behavior:interest", (e) => updateContext(e.detail));
  bubble.addEventListener("click", () => { open = !open; panel.classList.toggle("open", open); badge.style.display = "none"; if (open) { msgs.scrollTop = msgs.scrollHeight; input.focus(); } });
  closeBtn.addEventListener("click", () => { open = false; panel.classList.remove("open"); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendMsg(); } });
  sendBtn.addEventListener("click", sendMsg);
  function findAnswer(text) {
    const t = text.toLowerCase();
    for (const [k, a] of Object.entries(FAQ)) { if (t.includes(k)) return a; }
    for (const [n, i] of Object.entries(SERVICE_INFO)) { if (t.includes(n.toLowerCase()) || n.toLowerCase().includes(t)) return i; }
    if (t.includes("book") || t.includes("buy") || t.includes("order") || t.includes("start")) return "Great! Head to our Services page, select a service, and fill out the checkout form. Use code WELCOME20 for 20% off!";
    if (t.includes("hello") || t.includes("hi") || t.includes("hey")) {
      const interest = window.__behaviorInterest;
      return interest ? "Hi there! I see you are interested in " + interest + ". Ask me anything!" : "Hello! Ask me about our services, pricing, or features.";
    }
    return "I am not sure about that. Try asking about: pricing, features, setup, security, discounts, or a specific service.";
  }
  function sendMsg() {
    const text = input.value.trim(); if (!text) return; input.value = ""; addMsg(text, "user");
    setTimeout(() => { addMsg(findAnswer(text), "bot"); }, 200 + Math.random() * 200);
  }
  function addMsg(text, role) { const d = document.createElement("div"); d.className = "msg " + role; d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  if (window.__behaviorInterest) updateContext({ service: window.__behaviorInterest, sentiment: window.__behaviorSentiment });
})();
