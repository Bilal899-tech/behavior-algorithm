# Behavior Algorithm — nexagaze project

> Built by Founder Bilal

Algorithm-based behavior tracking (no AI). Client-side rule engine processes events instantly. No server dependency.

## SEO Keywords
behavior tracking algorithm, rule-based tracking, no AI behavior analysis, client-side tracking engine, real-time engagement, nexagaze, open source algorithm tracking, Founder Bilal

## Tech Stack
- Node.js / Express
- Client-side rule engine (no AI)
- JSON data storage
- Real-time event processing

## Setup
```bash
npm install
npm start
```

## Features
- 100% algorithmic behavior tracking (no AI required)
- Client-side rule engine for instant processing
- Real-time hover, scroll, and click tracking
- Smart discount engine
- Exit intent detection
- Toast notification system
- Search with behavior-based recommendations
- Admin dashboard with analytics
- Zero server dependency for analysis

## 📖 Documentation

### Architecture
Lightweight Express static server (port 3007). No AI — all logic runs client-side via rule engine in `behavior.js`.

### Rule Engine
| Rule | Condition | Result |
|------|-----------|--------|
| Deep Interest | Hover element > 3s | `interested` + toast with service name |
| Price Sensitivity | Scroll pricing 2+ times | `price_sensitive` + discount toast (10-25%) |
| Confusion | Hover 3+ different elements | `confused` + "Need help?" toast |
| Abandoning | Mouse leaves page | `abandoning` + 20% off exit toast |
| High Intent | 2+ clicks on CTAs | `high_intent` |

### Key Difference from behavior-agent
Zero server-side processing. All analysis happens in the browser. No Ollama dependency. No API calls.

## License
MIT — see [LICENSE](LICENSE)

---

**Contact:** ai@nexagaze.com | **WhatsApp:** 03103860653

---

## 🤝 Hire Me

Need a more advanced version? Want this built in Python, Rust, Go, or another language?  
I build custom AI agents, automation tools, and full-stack applications.

**Founder Bilal** — nexagaze  
📧 **Email:** ai@nexagaze.com  
📱 **WhatsApp:** 03103860653  
🌐 **GitHub:** [github.com/your-profile](https://github.com/your-profile)

> *"I don't just build projects — I build solutions that scale."*
