(function () {
  const hoverTimers = {};
  const clickCount = {};
  let scrollCounts = {};
  let lastScrollTime = Date.now();
  let lastInterest = null;
  let analysisCount = 0;

  window.__behaviorInterest = null;
  window.__behaviorSentiment = 'browsing';
  window.__behaviorAnalysis = null;
  window.__behaviorLog = [];

  const SERVICES = [
    'Web Development', 'SEO Optimization', 'UX Design',
    'Mobile App Dev', 'Content Strategy', 'Analytics Setup'
  ];

  function findService(text) {
    if (!text) return null;
    const t = text.toLowerCase();
    for (const s of SERVICES) {
      if (s.toLowerCase().includes(t) || t.includes(s.toLowerCase())) return s;
    }
    return null;
  }

  function logEvent(type, data) {
    const entry = { type, ...data, time: Date.now() };
    window.__behaviorLog.push(entry);
    if (window.__behaviorLog.length > 200) window.__behaviorLog.splice(0, 50);
    try { localStorage.setItem('ba_log', JSON.stringify(window.__behaviorLog.slice(-100))); } catch {}
  }

  function analyze() {
    const events = window.__behaviorLog;
    if (events.length === 0) return;

    const recent = events.slice(-30);
    analysisCount++;

    const hovers = recent.filter(e => e.type === 'hover');
    const clicks = recent.filter(e => e.type === 'click');
    const scrolls = recent.filter(e => e.type === 'scroll');
    const exits = recent.filter(e => e.type === 'exit_intent');

    let sentiment = 'browsing';
    let confidence = 0;
    let trigger = '';
    let target_service = null;
    let discount_percent = 0;
    let suggested_action = '';
    let toast_message = '';

    const longHover = hovers.filter(h => h.duration >= 3);
    const allHovered = hovers.map(h => h.element);
    const allClicked = clicks.map(c => c.element);

    const hoveredServices = [];
    allHovered.forEach(el => {
      for (const s of SERVICES) {
        const slug = s.toLowerCase().replace(/[^a-z]/g, '-');
        if (el && el.includes(slug)) hoveredServices.push(s);
      }
      if (el && el.includes('service-')) {
        const name = el.replace('service-', '').replace(/-/g, ' ');
        hoveredServices.push(name.charAt(0).toUpperCase() + name.slice(1));
      }
    });

    if (exits.length > 0) {
      sentiment = 'abandoning';
      confidence = 85;
      trigger = 'User moved to leave the page';
      discount_percent = 20;
      suggested_action = 'Show exit popup with 20% discount';
      toast_message = 'Wait! Get 20% off before you go! 🏃';
      if (hoveredServices.length) target_service = hoveredServices[hoveredServices.length - 1];
    }
    else if (longHover.length >= 3) {
      sentiment = 'confused';
      confidence = 75;
      trigger = `Hovered ${longHover.length} different elements for 3s+`;
      suggested_action = 'Ask if they need help choosing';
      toast_message = 'Need help deciding? Chat with us! 💬';
    }
    else if (longHover.length >= 1) {
      sentiment = 'interested';
      confidence = 70 + Math.min(longHover.length * 10, 25);
      const last = longHover[longHover.length - 1];
      trigger = `Hovered "${last.element}" for ${last.duration}s`;
      if (last.element) target_service = findService(last.element) || null;
      if (!target_service && hoveredServices.length) target_service = hoveredServices[hoveredServices.length - 1];
      suggested_action = target_service ? `Offer more info about ${target_service}` : 'Offer general help';
      toast_message = target_service ? `Interested in ${target_service}? Let's talk! 💡` : '';
    }
    else if (scrolls.length >= 2) {
      sentiment = 'price_sensitive';
      confidence = 65 + Math.min(scrolls.length * 5, 20);
      const pricingScrolls = scrolls.filter(s => s.section && s.section.includes('pric'));
      trigger = `Scrolled pricing section ${pricingScrolls.length} times`;
      discount_percent = Math.min(10 + pricingScrolls.length * 5, 25);
      suggested_action = `Show ${discount_percent}% limited-time discount`;
      toast_message = `Special ${discount_percent}% off just for you! 🎉`;
      if (hoveredServices.length) target_service = hoveredServices[hoveredServices.length - 1];
    }
    else if (clicks.length >= 2) {
      sentiment = 'high_intent';
      confidence = 80;
      trigger = `Clicked ${clicks.length} elements`;
      suggested_action = 'Fast-track to checkout';
      for (const c of allClicked) {
        if (c && (c.includes('book') || c.includes('cta') || c.includes('get-started'))) {
          toast_message = 'Great choice! Let\'s get you started! 🚀';
          break;
        }
      }
      if (hoveredServices.length) target_service = hoveredServices[hoveredServices.length - 1];
    }

    if (!toast_message) {
      toast_message = '👋 Let us know if you have questions!';
    }

    window.__behaviorSentiment = sentiment;
    window.__behaviorAnalysis = { sentiment, confidence, trigger, target_service, discount_percent, suggested_action, toast_message, time: Date.now() };

    if (target_service && target_service !== lastInterest) {
      lastInterest = target_service;
      window.__behaviorInterest = target_service;
      window.dispatchEvent(new CustomEvent('behavior:interest', {
        detail: { service: target_service, sentiment, discount: discount_percent }
      }));
    }

    if (toast_message && analysisCount > 1) {
      showToast(toast_message, sentiment);
    }
  }

  const sentColors = {
    interested: '#22c55e', price_sensitive: '#f59e0b', confused: '#f97316',
    abandoning: '#ef4444', high_intent: '#38bdf8', browsing: '#64748b'
  };

  function showToast(message, sentiment) {
    const color = sentColors[sentiment] || '#38bdf8';
    const container = document.getElementById('toastContainer') || (() => {
      const c = document.createElement('div');
      c.id = 'toastContainer';
      c.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:99999;display:flex;flex-direction:column;gap:0.5rem;max-width:340px;';
      document.body.appendChild(c);
      return c;
    })();
    const toast = document.createElement('div');
    toast.style.cssText = `background:#1e293b;border-left:4px solid ${color};border-radius:8px;padding:0.85rem 1rem;color:#e2e8f0;font-size:0.85rem;box-shadow:0 8px 24px rgba(0,0,0,0.4);animation:slideIn 0.3s ease-out;display:flex;align-items:center;gap:0.5rem;`;
    toast.innerHTML = `<span>${message}</span><span style="color:#64748b;cursor:pointer;font-size:0.8rem;margin-left:auto;" onclick="this.parentElement.remove()">✕</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = '0.3s';
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
    }, 5000);
  }

  document.querySelectorAll('[data-track]').forEach(el => {
    const name = el.dataset.track;
    el.addEventListener('mouseenter', () => { hoverTimers[name] = Date.now(); logEvent('mouseenter', { element: name }); });
    el.addEventListener('mouseleave', () => {
      if (hoverTimers[name]) {
        const dur = (Date.now() - hoverTimers[name]) / 1000;
        if (dur > 0.5) { logEvent('hover', { element: name, duration: Math.round(dur * 10) / 10 }); }
        delete hoverTimers[name];
      }
    });
    el.addEventListener('click', () => {
      logEvent('click', { element: name });
      if (!clickCount[name]) clickCount[name] = 0;
      clickCount[name]++;
      if (clickCount[name] <= 3) setTimeout(analyze, 100);
    });
  });

  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < 400) return;
    lastScrollTime = now;
    const sections = document.querySelectorAll('[data-section]');
    let visible = null;
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.6 && r.bottom > 0) visible = s.dataset.section;
    });
    if (visible) {
      if (!scrollCounts[visible]) scrollCounts[visible] = 0;
      scrollCounts[visible]++;
    }
  });

  setInterval(() => {
    for (const [section, count] of Object.entries(scrollCounts)) {
      if (count > 0) { logEvent('scroll', { section, count }); delete scrollCounts[section]; }
    }
  }, 4000);

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0) { logEvent('exit_intent', { element: 'page' }); setTimeout(analyze, 50); }
  });

  setInterval(analyze, 6000);

  const style = document.createElement('style');
  style.textContent = `@keyframes slideIn { from { opacity:0;transform:translateX(40px); } to { opacity:1;transform:translateX(0); } }`;
  document.head.appendChild(style);
})();
