import { useState, useEffect, useRef, useCallback } from "react";
import nishitaPhoto from "@/imports/IMG_5426-1.jpeg";

/* ── Scroll reveal hook ───────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

/* ── Reduced motion ────────────────────────────────── */
function useReducedMotion() {
  const [v, setV] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h); return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

/* ── Audio ─────────────────────────────────────────── */
function useAudio(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  const get = useCallback(() => { if (!ctx.current) ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)(); return ctx.current; }, []);
  const rustle = useCallback(() => {
    if (!on) return;
    try { const c = get(), buf = c.createBuffer(1, c.sampleRate * 0.13, c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.6) * 0.25; const src = c.createBufferSource(); src.buffer = buf; const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1600; src.connect(f); f.connect(c.destination); src.start(); } catch {}
  }, [on, get]);
  const click = useCallback(() => {
    if (!on) return;
    try { const c = get(), buf = c.createBuffer(1, c.sampleRate * 0.03, c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 5) * 0.18; const src = c.createBufferSource(); src.buffer = buf; const g = c.createGain(); g.gain.value = 0.45; src.connect(g); g.connect(c.destination); src.start(); } catch {}
  }, [on, get]);
  const beep = useCallback(() => {
    if (!on) return;
    try { const c = get(), osc = c.createOscillator(), g = c.createGain(); osc.frequency.value = 880; osc.type = "square"; g.gain.setValueAtTime(0.05, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07); osc.connect(g); g.connect(c.destination); osc.start(); osc.stop(c.currentTime + 0.07); } catch {}
  }, [on, get]);
  return { rustle, click, beep };
}

/* ── Terminal ──────────────────────────────────────── */
function Terminal({ reviewed, total, onFile, onContact, onCaseNo }: {
  reviewed: number; total: number; onFile: () => void; onContact: () => void; onCaseNo: () => void;
}) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const pct = reviewed / total;
  const bar = Math.round(pct * 18);
  return (
    <div className="terminal" role="complementary" aria-label="Case terminal">
      <div className="term-inner">
        <div className="term-top">
          <span>GLENDALE P.D. · SYS v2.4</span>
          <span>{time.toLocaleTimeString("en-GB", { hour12: false })}</span>
        </div>
        {[
          ["CASE NO",    <button onClick={onCaseNo} style={{ all: "unset", cursor: "pointer" }}>#0426</button>],
          ["SUBJECT",    <span className="cursor">PHUTANE, N.</span>],
          ["STATUS",     "ACTIVE / OPEN"],
          ["LOCATION",   <span className="dim">GLASGOW, UK</span>],
          ["FILED",      <span className="dim">2021-06-01</span>],
          ["MOTIVE",     <span className="dim">UNCLEAR. POSSIBLY CAFFEINE.</span>],
          ["CLEARANCE",  <span className="dim">LVL 2 (PROBATIONARY)</span>],
        ].map(([k, v], i) => (
          <div key={i} className="term-row">
            <span className="tk">{k as string}</span>
            <span className="tv">{v as React.ReactNode}</span>
          </div>
        ))}
        <hr className="term-sep" />
        <div className="term-body">
          PHUTANE, NISHITA · COMP SCI STUDENT.<br />
          KNOWN TO OPERATE SIX CONCURRENT SYSTEMS.<br />
          ML HABIT: <span className="hi">ONGOING.</span><br />
          LAST SEEN: DEBUGGING AT 2AM.<br />
          ALL LEADS POINT TO BSc, <span className="hi">2028.</span>
        </div>
        <hr className="term-sep" />
        <div className="term-prog">
          <div className="term-prog-lbl">EVIDENCE REVIEW PROGRESS</div>
          <div className="term-bar"><div className="term-bar-fill" style={{ width: `${pct * 100}%` }} /></div>
          <div className="term-chars">{"▓".repeat(bar)}{"░".repeat(18 - bar)} {reviewed}/{total}</div>
        </div>
        <div className="term-btns">
          <button className="term-btn" onClick={onFile}>▶ OPEN FILE</button>
          <button className="term-btn" onClick={onContact}>▶ CONTACT</button>
        </div>
      </div>
    </div>
  );
}

/* ── Cork Board ────────────────────────────────────── */
const PINS = [
  { left:  30, top:  38, delay: 0.08, date: "JUN–AUG 2021",       role: "Inpirit AI\nProgramme" },
  { left: 234, top:  46, delay: 0.14, date: "JUN–SEP 2021",       role: "ML Intern\nNUS & HPE" },
  { left: 438, top:  34, delay: 0.20, date: "SEP 2025–MAY 2026",  role: "Welfare Officer\nFinTech Soc." },
  { left: 642, top:  48, delay: 0.26, date: "SEP 2025",           role: "Mentor\nPeer Programme" },
  { left: 128, top: 258, delay: 0.32, date: "NOV 2025",           role: "Bakery Asst.\nPastéis Lisboa" },
  { left: 332, top: 265, delay: 0.38, date: "JAN 2026",           role: "Secretary\nRobotics Soc." },
  { left: 536, top: 254, delay: 0.44, date: "13–16 APR 2026",     role: "JP Morgan\nSpring Insight" },
  { left: 730, top: 268, delay: 0.50, date: "JUN 2026",           role: "Deutsche Bank\nInsight Prog." },
];

function Pushpin() {
  return (
    <div className="pushpin" aria-hidden="true">
      <div className="pushpin-head" />
      <div className="pushpin-shadow" />
    </div>
  );
}

const STICKY_COLORS = [
  { bg: "#F4E047", shadow: "rgba(200,170,0,0.25)" },         // yellow
  { bg: "#F9C0C0", shadow: "rgba(200,80,80,0.2)" },          // pink
  { bg: "#B8E4A8", shadow: "rgba(60,160,60,0.18)" },         // green
  { bg: "#F5C842", shadow: "rgba(200,150,0,0.3)" },          // gold
  { bg: "#C4AAEE", shadow: "rgba(120,80,200,0.22)" },        // lavender
];

const STICKIES = [
  { top: 132, left:  16, rotate: -3.5, delay: ".44s", width: 100,
    text: "est. 2028",    color: 0 },
  { top: 124, left: 786, rotate:  2.2, delay: ".50s", width: 100,
    text: "5 open files", color: 1 },
  { top: 348, left:  72, rotate: -2.8, delay: ".56s", width: 124,
    text: "Gold Finalist\nQueen's Commonwealth Essay Competition\nJan 2022", color: 3 },
  { top: 352, left: 668, rotate:  2.2, delay: ".63s", width: 124,
    text: "Top Finalist\nMicrosoft Sustainability Hackathon\nJun 2023",      color: 4 },
];

function CorkBoard({ revealed }: { revealed: boolean }) {
  return (
    <div className="cork">
      {/* Tape strips holding photos */}
      <div className="tape" style={{ position: "absolute", top: -4, left: 52, transform: "rotate(-2deg)", zIndex: 5 }} />
      <div className="tape" style={{ position: "absolute", top: -4, right: 56, transform: "rotate(2.5deg)", zIndex: 5 }} />

      <div className="board-inner">
        <div className={`board-stage${revealed ? " revealed" : ""}`}>
          <svg className="strings" viewBox="0 0 900 450" preserveAspectRatio="none">
            {PINS.map((p, i) => (
              <line key={i} x1={445} y1={172} x2={p.left + 67} y2={p.top + 12} style={{ animationDelay: `${p.delay}s` }} />
            ))}
          </svg>

          {/* Polaroid */}
          <div className="polaroid bc" style={{ transitionDelay: "0s", left: 390, top: 140 }}>
            <Pushpin />
            <div className="polaroid-img">
              <img src={nishitaPhoto} alt="Nishita P." style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }} />
            </div>
            <div className="polaroid-caption">Nishita P.</div>
          </div>

          {/* Sticky notes */}
          {STICKIES.map((s, i) => (
            <div
              key={i}
              className="sticky-note bc"
              style={{
                top: s.top,
                left: s.left,
                width: s.width,
                transform: `rotate(${s.rotate}deg)`,
                transitionDelay: s.delay,
                whiteSpace: "pre-line",
                background: `linear-gradient(175deg, rgba(255,255,255,0.18) 0%, transparent 40%), ${STICKY_COLORS[s.color].bg}`,
                boxShadow: `0 1px 1px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.22), 0 10px 24px rgba(0,0,0,0.15), 4px 8px 16px ${STICKY_COLORS[s.color].shadow}`,
              }}
            >
              {s.text}
            </div>
          ))}

          {/* Index cards */}
          {PINS.map((p, i) => (
            <div key={i} className="index-card bc" style={{ left: p.left, top: p.top, transitionDelay: `${p.delay}s` }}>
              <Pushpin />
              <div className="ic-date">{p.date}</div>
              <div className="ic-role" style={{ whiteSpace: "pre-line" }}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Content inside page sheet ────────────────────── */
function Redact({ children, onInteract }: { children: React.ReactNode; onInteract: () => void }) {
  return <span className="redact" tabIndex={0} onMouseEnter={onInteract} onFocus={onInteract}>{children}</span>;
}

function ExperienceContent({ click }: { click: () => void }) {
  const rows = [
    { role: "ML Intern", org: "National University of Singapore & Hewlett Packard Enterprise", date: "Jun–Sep 2021", status: "CLOSED", bullets: ["Explored the role of linear algebra in ML, working with vectors, matrices and tensors.", "Trained and evaluated AI models using Decision Trees, Random Forests, SVMs and MLPs, computing metrics such as precision and recall to determine accuracy.", "Applied ML to a breast cancer classification project, predicting whether tumours are malignant or benign using SVM and MLP algorithms.", "Gained practical experience in Python.", "Developed a real-time flood prediction model in Azure ML Studio, analysing a 50-year weather dataset to train and deploy the model.", "Built a solution that predicts live flood statuses and estimates preventative costs to support disaster risk mitigation."] },
    { role: "Welfare Officer", org: "Glasgow University FinTech Society · Full-time", date: "Sep 2025 – Apr 2026", status: "CLOSED", bullets: ["Supporting the wellbeing of society members, ensuring an inclusive and supportive environment across all events and activities.", "Acting as a point of contact for members with welfare concerns, signposting to university support services where needed.", "Collaborating with the committee to promote mental health awareness and a positive culture within the society."] },
    { role: "Peer Mentor", org: "University of Glasgow", date: "Sep 2025 – Present", status: "ACTIVE", bullets: ["Mentoring first-year and fast-track second-year students, sharing effective study strategies and academic guidance.", "Supporting mentees with goal setting, wellbeing, and accessing university support services.", "Conducting regular check-ins to monitor progress and promote positive academic transitions."] },
    { role: "Secretary", org: "University of Glasgow Robotics Society", date: "Jan 2026 – Present", status: "ACTIVE", bullets: ["Preparing meeting agendas in conjunction with the President and maintaining accurate minutes and attendance records.", "Managing all society communications, ensuring members are kept informed of meeting dates, venues and updates.", "Coordinating meetings, events and workshops for members interested in robotics and autonomous systems.", "Liaising with the SRC to ensure society membership is accurately displayed on the website and reporting key correspondence to the committee."] },
    { role: "Bakery Assistant", org: "Pastéis Lisboa · Part-time", date: "Nov 2025 – Present", status: "ACTIVE", bullets: ["Maintained high standards of cleanliness and hygiene across all bakery and kitchen areas to the standard required by the company and EHO.", "Supported bakers in the production of Pasteis de Nata, including food prep and assisted front-of-house staff with product handling and display.", "Worked collaboratively with the team to meet daily targets, manage cleaning supplies, and maintain a safe, efficient, and well-organised environment."] },
  ];
  return (
    <div className="page-content">
      {rows.map((r, i) => (
        <div key={i} className="case-row">
          <div className="case-top">
            <span className="case-role">{r.role} <span className="case-org">@ {r.org}</span></span>
            <span className="case-date">{r.date}</span>
          </div>
          <span className="status-tag">{r.status}</span>
          <ul>{r.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({ click }: { click: () => void }) {
  const cards = [
    { id: "S-01", title: "The Safety Ring", sub: "Personal Project · In Progress", desc: "Designed a phone-to-phone safety network for commuters that works without a stable signal or a panic button. When cellular drops, nearby phones relay an encrypted distress signal device-to-device via Bluetooth mesh until one reaches a working connection and alerts emergency contacts. A background route monitor flags unexpected detours or unexplained stops and checks in automatically, escalating if there's no response. Privacy is built in from the start; devices exchange only rotating, HMAC-based codes, never identity or location.", mats: "React Native, Google Nearby Connections API, Google Maps SDK, Geofencing API, FastAPI, Firebase Cloud Messaging, Twilio, Supabase, AES-GCM" },
    { id: "F-01", title: "Case File Portfolio", desc: "This very file: a true-crime detective portfolio rebuilt in React with procedural Web Audio and cork board animations.", mats: "React, Tailwind, Web Audio" },
    { id: "H-01", title: "Code for Good: SafeHome", sub: "National Fire Chiefs Council · JP Morgan", desc: "Developed an intelligent early-warning system monitoring elderly residents' daily safety habits in real time, escalating risks through a tiered alert chain from carer notifications to fire service intervention.", mats: "Python 3.12, FastAPI, Uvicorn, Supabase (PostgreSQL), Cryptography (Fernet), HTML5, CSS3, Vanilla JS, Fetch API" },
    { id: "H-02", title: "Glasgow 850 GameJam", sub: "20 Oct – 5 Nov 2025", desc: "Co-developed \"PubCrawl Simulator\" in Godot, contributing to game logic and backend development.", mats: "Godot" },
    { id: "H-03", title: "Do You Have The GUTS Hackathon", sub: "Honourable Mention · Morgan Stanley · 25–26 Oct 2025", desc: "Built a Godot simulation with randomised events where a company must balance profits with a net-zero goal by adjusting environmental policy commitments and investing in green technologies.", mats: "Godot" },
    { id: "H-04", title: "Microsoft Sustainability Hackathon", sub: "Top Finalist · Jun 2023", desc: "Built a carbon emissions calculator using Angular, Spring Boot, and Azure ML to predict app emissions and suggest improvements; also gained experience in carbon proxy measurement and digital marketing.", mats: "Angular, Spring Boot, Azure ML" },
  ];
  return (
    <div className="page-content">
      <div className="grid2">
        {cards.map((p, i) => (
          <div key={i} className="proj-card">
            <div className="proj-id">{p.id}</div>
            <h3>{p.title}</h3>
            {"sub" in p && p.sub && <div className="proj-sub">{p.sub}</div>}
            <p>{p.desc}</p>
            {p.mats && <div className="mats">{p.mats}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsContent({ click }: { click: () => void }) {
  return (
    <div className="page-content">
      {[
        { label: "LANGUAGES", tags: ["Python", "Java", "Haskell", "SQL", "JavaScript", "TypeScript", "C", "HTML5", "CSS3"] },
        { label: "FRAMEWORKS & TOOLS", tags: ["React", "React Native", "Angular", "FastAPI", "Uvicorn", "Spring Boot", "JPA", "Firebase Cloud Messaging", "Twilio", "Supabase", "Azure ML", "HuggingFace", "PyTorch", "Godot", "Git", "Docker", "Tailwind CSS"] },
        { label: "SECURITY & ENCRYPTION", tags: ["AES-GCM", "HMAC", "Fernet (Cryptography)", "Bluetooth Mesh", "Rotating Token Auth"] },
        { label: "APIS & SERVICES", tags: ["Google Nearby Connections API", "Google Maps SDK", "Geofencing API", "Fetch API", "Supabase (PostgreSQL)"] },
        { label: "DOMAINS", tags: ["Machine Learning", "NLP", "Web Development", "Mobile Development", "Databases", "Systems", "Game Development", "Cybersecurity"] },
        { label: "WEAKNESSES", tags: ["Overcommitting", "Dark chocolate", "One more tab in the browser"] },
        { label: "CLEARANCE LEVEL", tags: [<Redact key={0} onInteract={click}>LEVEL 4 / ACTIVE</Redact>] },
      ].map((g, i) => (
        <div key={i} className="tag-group">
          <span className="exhibit-tag">{g.label}</span>
          <div className="tags">{g.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

function PersonalContent({ click }: { click: () => void }) {
  return (
    <div className="page-content">
      <div className="grid2">
        <div className="proj-card">
          <div className="proj-id">F-04 · ACADEMIC</div>
          <h3>Academic Record</h3>
          <p>BSc Computing Science, University of Glasgow. Third year. Expected graduation <Redact onInteract={click}>2028</Redact>.</p>
          <div className="mats">transcript: clearance required</div>
        </div>
        <div className="proj-card">
          <div className="proj-id">F-05 · COURSE</div>
          <h3>Inspirit AI Programme</h3>
          <div className="proj-sub">02 Jul – 02 Aug 2021</div>
          <p>Developed a BERT-based NLP model for intent detection and entity extraction from natural language commands. Implemented joint sequence and token classification using BIO tagging, tokenization, and attention masking. Gained experience in deep learning, transformer models, fine-tuning, and evaluating large language model limitations.</p>
          <div className="mats">Python, BERT, HuggingFace Transformers, NLP</div>
        </div>
      </div>

      <div className="proj-id" style={{ marginTop: 18, marginBottom: 8, fontSize: "0.62rem", letterSpacing: "0.08em" }}>INSIGHT PROGRAMMES</div>
      <div className="grid2">
        <div className="proj-card">
          <div className="proj-id">I-01 · INSIGHT</div>
          <h3>JP Morgan Spring Insight</h3>
          <div className="proj-sub">13–16 Apr 2026</div>
          <p>Competitive spring insight programme at JP Morgan, gaining exposure to technology and finance operations across the firm.</p>
        </div>
        <div className="proj-card">
          <div className="proj-id">I-02 · INSIGHT</div>
          <h3>Deutsche Bank Insight Programme</h3>
          <div className="proj-sub">Jun 2026</div>
          <p>Insight programme at Deutsche Bank, exploring technology and innovation within a leading global investment bank.</p>
        </div>
      </div>

      <div className="case-row" style={{ marginTop: 14 }}>
        <span style={{ fontFamily: "var(--font-hand)", fontSize: "1rem", color: "var(--ink)" }}>
          "Six systems running in parallel. Somehow they're all still up."
        </span>
        <p style={{ color: "var(--ink-soft)", fontSize: "0.78rem", margin: "5px 0 0" }}>From the subject's own testimony, unverified</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: "experience", label: "Known associates (Work Experience)", num: "B", tooltip: "Work experience and roles outside coursework." },
  { id: "projects",   label: "Evidence log",        num: "C", tooltip: "Coursework projects and independent builds." },
  { id: "skills",     label: "Materials recovered", num: "D", tooltip: "Languages, frameworks, and tools in active use." },
  { id: "personal",   label: "Personal files",      num: "F", tooltip: "Side projects and off-record activity." },
];

/* ── App ────────────────────────────────────────────── */
export default function App() {
  const [tabsVisible, setTabsVisible] = useState(false);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [caseClosedShown, setCaseClosedShown] = useState(false);
  const [showCaseClosed, setShowCaseClosed] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);

  const reduceMotion = useReducedMotion();
  const { rustle, click: sfxClick, beep } = useAudio(sfxOn);

  const [heroRef, heroVisible] = useReveal(0.05);
  const [boardRef, boardVisible] = useReveal(0.1);
  const [filesRef, filesVisible] = useReveal(0.1);
  const [contactRef, contactVisible] = useReveal(0.1);

  const clickCount = useRef(0);
  const clickTimer = useRef<any>(null);

  useEffect(() => { if (filesVisible) setTimeout(() => setTabsVisible(true), 200); }, [filesVisible]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowCaseClosed(false); setShowEgg(false); setActiveSheet(null); } };
    document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h);
  }, []);

  const openTab = useCallback((id: string) => {
    setActiveSheet(prev => prev === id ? null : id);
    rustle();
    setReviewed(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      if (next.size === TABS.length && !caseClosedShown) { setCaseClosedShown(true); setTimeout(() => setShowCaseClosed(true), 900); }
      return next;
    });
  }, [rustle, caseClosedShown]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  const handleCaseNoClick = useCallback(() => {
    beep(); clickCount.current++;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 900);
    if (clickCount.current >= 5) { clickCount.current = 0; setShowEgg(true); }
  }, [beep]);

  return (
    <>
      {/* Overlays */}
      <div className={`overlay-backdrop${showCaseClosed ? " show" : ""}`} onClick={() => { setShowCaseClosed(false); scrollTo("contact"); }} role="dialog" aria-modal="true">
        <div className="cc-card" onClick={e => e.stopPropagation()}>
          <h3>CASE CLOSED</h3>
          <p>ALL FOUR EXHIBITS REVIEWED.<br />YOU READ THE WHOLE THING. IMPRESSIVE.<br />MOST PEOPLE JUST LOOK AT THE PICTURES.</p>
          <button className="cc-btn" onClick={() => { setShowCaseClosed(false); scrollTo("contact"); }}>FINE. TAKE HER CONTACT DETAILS.</button>
        </div>
      </div>
      <div className={`overlay-backdrop${showEgg ? " show" : ""}`} onClick={() => setShowEgg(false)} role="dialog" aria-modal="true">
        <div className="egg-card" onClick={e => e.stopPropagation()}>
          <span className="exhibit-tag">OFF THE RECORD</span>
          <button className="page-close" onClick={() => setShowEgg(false)} aria-label="Close">×</button>
          <p>You clicked the case number five times.<br />That's either dedication or a cry for help.<br />Either way, hi. I like you already.</p>
        </div>
      </div>

      {/* Nav */}
      <nav>
        <div className="nav-inner">
          <span className="nav-brand">CASE #0426</span>
          <div className="nav-links">
            <button onClick={() => scrollTo("board")}>The Board</button>
            <button onClick={() => scrollTo("files")}>Case Files</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
            <a href="https://www.linkedin.com/in/nishita-phutane" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
          <div className="nav-right">
            <button className="case-no-btn" onClick={handleCaseNoClick} title="Click 5× for a surprise">CASE #0426</button>
            <button className={`sfx-btn${sfxOn ? " on" : ""}`} onClick={() => setSfxOn(v => !v)} aria-pressed={sfxOn}>SFX {sfxOn ? "ON" : "OFF"}</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="top">
        <div className="hero-grid" ref={heroRef}>
          <div>
            <div className={`hero-eyebrow reveal${heroVisible ? " in" : ""}`}>OPEN CASE · GLASGOW, UK</div>
            <h1 className={`hero-title reveal d1${heroVisible ? " in" : ""}`}>
              Case File<br /><em>No. 0426</em>
            </h1>
            <p className={`hero-subtitle reveal d2${heroVisible ? " in" : ""}`}>"the subject"</p>
            <p className={`hero-brief reveal d3${heroVisible ? " in" : ""}`}>
              Nishita Phutane, 3rd-year Computer Science student at the University of Glasgow (expected graduation 2028),
              currently under investigation for supporting a fintech society, leading robotics projects, and working on
              machine learning systems, all before her degree's even done. Suspect is considered a fast learner,
              and <em style={{fontStyle:"italic", color:"var(--red)"}}>dangerously caffeinated</em>.
            </p>
            <div className={`hero-actions reveal d4${heroVisible ? " in" : ""}`}>
              <button className="btn-primary" onClick={() => scrollTo("files")}>Open the file</button>
              <button className="btn-ghost" onClick={() => scrollTo("board")}>View the board</button>
              <a className="btn-ghost" href={`${import.meta.env.BASE_URL}Nishita-Phutane-CV.pdf`} download>
                Download CV
              </a>
            </div>
          </div>
          <div className={`reveal-right${heroVisible ? " in" : ""} d2`}>
            <Terminal
              reviewed={reviewed.size}
              total={TABS.length}
              onFile={() => scrollTo("files")}
              onContact={() => scrollTo("contact")}
              onCaseNo={handleCaseNoClick}
            />
          </div>
        </div>
      </header>

      {/* Board section */}
      <section className="board-section" id="board">
        <div className="section-inner" ref={boardRef}>
          <div className={`section-num reveal${boardVisible ? " in" : ""}`}><span>01 ·</span> THE EVIDENCE WALL</div>
          <h2 className={`section-title reveal d1${boardVisible ? " in" : ""}`}>Timeline of<br /><em>known activity</em></h2>
          <p className={`section-intro reveal d2${boardVisible ? " in" : ""}`}>
            Five confirmed sightings. Red string traces the connections. All alibis suspicious. One involves a bakery.
          </p>
          <div className={`reveal d3${boardVisible ? " in" : ""}`}>
            <CorkBoard revealed={boardVisible} />
          </div>
        </div>
      </section>

      {/* Files section */}
      <section className="files-section" id="files">
        <div className="section-inner" ref={filesRef}>
          <div className={`section-num reveal${filesVisible ? " in" : ""}`}><span>02 ·</span> EVIDENCE LOCKER</div>
          <h2 className={`section-title reveal d1${filesVisible ? " in" : ""}`}>The case<br /><em>files</em></h2>
          <p className={`section-intro reveal d2${filesVisible ? " in" : ""}`}>
            Four sealed exhibits. Pull a tab to open the relevant file.
          </p>
          <div className={`reveal d3${filesVisible ? " in" : ""}`}>
            <div className="folder-stage">
              <div className="folder-body">
                <div className="folder-seal"><div className="folder-seal-text">University<br />of Glasgow<br />Comp Sci</div></div>
                <div className="folder-stamp">RESTRICTED</div>
                <div className="folder-meta">
                  <div>STATUS: <span className="fv">ACTIVE</span></div>
                  <div>SUBJECT: <span className="fv">N. PHUTANE</span></div>
                  <div>CASE: <span className="fv">#0426</span></div>
                  <div>OPENED: <span className="fv">2021</span></div>
                </div>
                <div className="folder-hint">pull tab gently →</div>
              </div>

              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  className={`f-tab${tabsVisible ? " visible" : ""}${activeSheet === t.id ? " open" : ""}`}
                  style={{ top: 18 + i * 110, transitionDelay: `${0.1 + i * 0.08}s` }}
                  onClick={() => openTab(t.id)}
                  aria-expanded={activeSheet === t.id}
                >
                  <span className="tab-num">{t.num}</span>
                  {t.label}
                  {reviewed.has(t.id) && <span className="dot" />}
                  <span className="ttip">{t.tooltip}</span>
                </button>
              ))}

              <div className={`page-sheet${activeSheet ? " open" : ""}`}>
                <button className="page-close" onClick={() => setActiveSheet(null)} aria-label="Close">×</button>
                {activeSheet && (
                  <>
                    <div className="page-head">{TABS.find(t => t.id === activeSheet)?.label}</div>
                    <div id="pageContent">
                      {activeSheet === "experience" && <ExperienceContent click={sfxClick} />}
                      {activeSheet === "projects"   && <ProjectsContent click={sfxClick} />}
                      {activeSheet === "skills"     && <SkillsContent click={sfxClick} />}
                      {activeSheet === "personal"   && <PersonalContent click={sfxClick} />}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="contact-section" id="contact">
        <div className="section-inner" ref={contactRef}>
          <div className={`section-num reveal${contactVisible ? " in" : ""}`}><span>03 ·</span> CONTACT</div>
          <div className="contact-grid">
            <div className="contact-left">
              <div className={`stamp reveal d1${contactVisible ? " in" : ""}`}>EXHIBIT E · CONTACT</div>
              <p className={`reveal d2${contactVisible ? " in" : ""}`}>
                The subject is reachable through official channels. All correspondence reviewed within 48 hours. No warrant required. Bribes in the form of good coffee are not <em style={{fontStyle:"italic"}}>not</em> accepted.
              </p>
            </div>
            <div className={`reveal-right d2${contactVisible ? " in" : ""}`}>
              <div className="contact-links">
                {[
                  { label: "Email", href: "mailto:nishitaphutane@gmail.com", val: "nishitaphutane@gmail.com" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/nishita-phutane", val: "linkedin.com/in/nishita-phutane" },
                  { label: "GitHub", href: "https://github.com/nishitaphutane", val: "github.com/nishitaphutane" },
                ].map(l => (
                  <a key={l.label} className="contact-link" href={l.href} target="_blank" rel="noopener noreferrer">
                    <span>{l.val}</span>
                    <span className="arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className={`foot-note reveal d4${contactVisible ? " in" : ""}`}>
            Case #0426 · Glendale P.D. Records · {new Date().getFullYear()} · Built by the subject, for the record · No developers were harmed in the making of this portfolio
          </p>
        </div>
      </section>
    </>
  );
}
