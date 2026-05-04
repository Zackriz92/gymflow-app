import { useState, useEffect, useRef } from "react";

// ═════════════════════════════════════════════════════════════════════════════
// GYMFLOW V3 — "THE GAZETTE"
// Newspaper masthead aesthetic. Dense. Opinionated. Singapore-specific.
// Design rules:
// - Sharp corners only (border-radius: 0 except for avatars and pills)
// - Asymmetric layouts that lean
// - One signature accent (electric blue, not green)
// - Typography earns its weight: tight tracking, real hierarchy
// - Real density: data tables not card grids
// - Specific microcopy ("ah", "lah", "tau", "sia") used carefully
// ═════════════════════════════════════════════════════════════════════════════

// ── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  paper:   "#0E0E10",    // page bg — paper-toned dark
  ink:     "#08080A",    // deepest surface
  panel:   "#161618",    // card surface
  panel2:  "#1C1C20",    // hover surface
  rule:    "#26262B",    // hairline borders
  rule2:   "#33333A",    // stronger borders
  text:    "#F4F2EE",    // primary off-white
  body:    "#C9C7C2",    // body text
  faded:   "#7E7C77",    // captions, labels
  ghost:   "#52524E",    // muted
  off:     "#33332F",    // disabled
  
  // Signature accent — electric cobalt (NOT green)
  spark:   "#5B9BE8",
  sparkD:  "#3F7DC7",
  sparkL:  "#8DBAEF",
  
  // Supporting (used sparingly, NOT as primary CTAs)
  flag:    "#E84545",    // alerts, danger
  honey:   "#E8B547",    // pending, gold
  jade:    "#3FB68B",    // success
  rust:    "#E87045",    // warning
  violet:  "#8B7FE8",    // premium
};

// ── Global CSS ──────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&display=swap');
  
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: ${T.paper};
    color: ${T.text};
    font-family: 'Inter Tight', system-ui, sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'ss01' on, 'cv11' on;
    line-height: 1.4;
    width: 100%;
    max-width: 100vw;
  }
  html { width: 100%; max-width: 100vw; overflow-x: hidden; }
  input, textarea, select, button {
    font-family: 'Inter Tight', sans-serif;
    color: ${T.text};
    -webkit-appearance: none;
  }
  button { cursor: pointer; }
  input::placeholder, textarea::placeholder { color: ${T.ghost}; }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${T.ink}; }
  ::-webkit-scrollbar-thumb { background: ${T.rule2}; }
  
  /* ── Typography utilities ── */
  .news { font-family: 'Newsreader', Georgia, serif; font-weight: 400; letter-spacing: -0.01em; }
  .news-i { font-family: 'Newsreader', Georgia, serif; font-style: italic; font-weight: 400; }
  .mono { font-family: 'DM Mono', monospace; font-feature-settings: "tnum" on, "lnum" on; }
  .num { font-family: 'Inter Tight', sans-serif; font-feature-settings: "tnum" on, "lnum" on; font-variant-numeric: tabular-nums; }
  
  /* ── Animations (sparing) ── */
  @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
  @keyframes lift { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
  
  /* ── Components ── */
  .row-hover { transition: background 0.12s; }
  .row-hover:hover { background: ${T.panel2}; }
  
  .scroll-x { display: flex; overflow-x: auto; scrollbar-width: none; }
  .scroll-x::-webkit-scrollbar { display: none; }
  
  
  .btn-press:active { transform: translateY(1px); }
  
  /* ── Responsive ── */
  @media (min-width: 900px) {
    .desk-grid { display: grid !important; grid-template-columns: 1.4fr 1fr; gap: 32px; }
    .desk-3 { display: grid !important; grid-template-columns: repeat(3, 1fr); gap: 0; }
    .desk-4 { display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 0; }
    .desk-show { display: block !important; }
    .desk-flex { display: flex !important; }
    .auth-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
  }
  @media (max-width: 899px) {
    /* Stack everything vertically on mobile */
    .desk-grid { display: flex !important; flex-direction: column; gap: 16px; }
    .desk-3 { display: flex !important; flex-direction: column; }
    .desk-4 { display: flex !important; flex-direction: column; }
    .mob-hide { display: none !important; }
    .auth-grid { display: flex; flex-direction: column; min-height: 100vh; }
    .auth-side { display: none !important; }
    .pad-mob { padding: 16px !important; }
    
    /* Force tables and tabular grids to stack on mobile */
    .table-row-mobile { 
      display: flex !important; 
      flex-direction: column !important; 
      gap: 8px !important;
      align-items: flex-start !important;
    }
    .table-head-mobile { display: none !important; }
    
    /* Reduce padding on mobile */
    main { padding-left: 16px !important; padding-right: 16px !important; }
    
    /* Stat cells stack vertically with borders adjusted */
    .stat-cell-mobile { 
      border-right: none !important; 
      border-bottom: 1px solid ${T.rule} !important;
    }
    
    /* Hero numbers shrink on mobile */
    .hero-num { font-size: clamp(48px, 14vw, 72px) !important; }
    
    /* Bar chart adjusts */
    .chart-mobile { height: 100px !important; }
    
    /* Reduce font sizes for hero headlines */
    .news-hero { font-size: clamp(32px, 8vw, 48px) !important; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVES — sharp-edged, opinionated
// ═══════════════════════════════════════════════════════════════════════════

const Btn = ({ children, variant = "primary", size = "md", loading, disabled, onClick, fw, style = {} }) => {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 12 },
    md: { padding: "11px 18px", fontSize: 13 },
    lg: { padding: "15px 24px", fontSize: 14 },
  };
  const variants = {
    primary: { background: T.text, color: T.ink, border: `1px solid ${T.text}` },
    spark: { background: T.spark, color: T.ink, border: `1px solid ${T.spark}` },
    outline: { background: "transparent", color: T.text, border: `1px solid ${T.rule2}` },
    minimal: { background: "transparent", color: T.body, border: `1px solid transparent` },
    flag: { background: T.flag, color: T.text, border: `1px solid ${T.flag}` },
  };
  const hover = {
    primary: { background: T.body },
    spark: { background: T.sparkD },
    outline: { background: T.panel2, borderColor: T.text },
    minimal: { background: T.panel2 },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className="btn-press"
      style={{
        ...sizes[size], ...variants[variant],
        fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, letterSpacing: 0,
        borderRadius: 0,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        opacity: disabled ? 0.4 : 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: fw ? "100%" : "auto",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={e => { if (!disabled && !loading && hover[variant]) Object.assign(e.currentTarget.style, hover[variant]); }}
      onMouseLeave={e => { if (!disabled && !loading) Object.assign(e.currentTarget.style, variants[variant]); }}
    >
      {loading && <span style={{ width: 12, height: 12, border: `1.5px solid currentColor`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
      {children}
    </button>
  );
};

const Field = ({ label, error, hint, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 500 }}>{label}</label>
    )}
    <input {...props}
      style={{
        width: "100%", background: T.ink,
        border: `1px solid ${error ? T.flag : T.rule}`,
        color: T.text,
        padding: "12px 14px",
        borderRadius: 0,
        fontSize: 14, fontWeight: 500,
        transition: "border-color 0.15s",
      }}
      onFocus={e => { e.target.style.borderColor = error ? T.flag : T.spark; }}
      onBlur={e => { e.target.style.borderColor = error ? T.flag : T.rule; }}
    />
    {hint && !error && <span style={{ fontSize: 11, color: T.ghost, marginTop: 1 }}>{hint}</span>}
    {error && <span style={{ fontSize: 11, color: T.flag, marginTop: 1 }}>↳ {error}</span>}
  </div>
);

const Pill = ({ children, tone = "default" }) => {
  const tones = {
    default: { bg: T.panel, fg: T.body, br: T.rule },
    spark: { bg: `${T.spark}14`, fg: T.spark, br: `${T.spark}30` },
    flag: { bg: `${T.flag}14`, fg: T.flag, br: `${T.flag}30` },
    honey: { bg: `${T.honey}14`, fg: T.honey, br: `${T.honey}30` },
    jade: { bg: `${T.jade}14`, fg: T.jade, br: `${T.jade}30` },
    violet: { bg: `${T.violet}14`, fg: T.violet, br: `${T.violet}30` },
    rust: { bg: `${T.rust}14`, fg: T.rust, br: `${T.rust}30` },
    inverse: { bg: T.text, fg: T.ink, br: T.text },
  };
  const t = tones[tone] || tones.default;
  return (
    <span className="mono" style={{
      background: t.bg, color: t.fg, border: `1px solid ${t.br}`,
      padding: "2px 8px", borderRadius: 0, fontSize: 9.5, fontWeight: 500,
      letterSpacing: 1.2, textTransform: "uppercase", whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>{children}</span>
  );
};

const Avatar = ({ name = "", size = 32, tone = "spark" }) => {
  const tones = {
    spark: { bg: `${T.spark}1A`, br: `${T.spark}40`, fg: T.spark },
    honey: { bg: `${T.honey}1A`, br: `${T.honey}40`, fg: T.honey },
    violet: { bg: `${T.violet}1A`, br: `${T.violet}40`, fg: T.violet },
    jade: { bg: `${T.jade}1A`, br: `${T.jade}40`, fg: T.jade },
    rust: { bg: `${T.rust}1A`, br: `${T.rust}40`, fg: T.rust },
    flag: { bg: `${T.flag}1A`, br: `${T.flag}40`, fg: T.flag },
  };
  const t = tones[tone] || tones.spark;
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, minWidth: size,
      background: t.bg, border: `1px solid ${t.br}`, color: t.fg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
      borderRadius: 0,
    }}>{initials}</div>
  );
};

const StatCell = ({ label, value, sub, subTone, accent }) => (
  <div className="stat-cell-mobile" style={{ padding: "20px 22px", borderRight: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, background: T.panel, position: "relative" }}>
    {accent && <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: "100%", background: accent }} />}
    <div className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div className="num" style={{ fontSize: "clamp(24px, 3.5vw, 32px)", color: T.text, lineHeight: 1, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: subTone === "up" ? T.jade : subTone === "down" ? T.flag : T.faded, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════

const BIZ_USERS = [
  { email: "owner@gymflow.sg", password: "gym123", name: "Alexandra Chen", role: "Owner", avatar: "AC", gym: "Alpha Athletics", since: "Mar 2024" },
  { email: "trainer@gymflow.sg", password: "train123", name: "Marcus Lim", role: "Trainer", avatar: "ML", gym: "Alpha Athletics", since: "Jul 2024" },
];

const MEMBERS = [
  { id: 1, name: "Marcus Tan",      email: "marcus@email.com",  tone: "spark",  plan: "Premium",  expiry: "May 15", visits: 18, last: "Strength",   status: "active",   paid: true,  joined: "Jan '25" },
  { id: 2, name: "Priya Sharma",    email: "priya@email.com",   tone: "violet", plan: "Standard", expiry: "May 20", visits: 12, last: "Pilates",    status: "active",   paid: true,  joined: "Feb '25" },
  { id: 3, name: "Ahmad Faris",     email: "ahmad@email.com",   tone: "honey",  plan: "Elite",    expiry: "May 03", visits: 24, last: "CrossFit",   status: "active",   paid: true,  joined: "Nov '24" },
  { id: 4, name: "Jenny Wu",        email: "jenny@email.com",   tone: "jade",   plan: "Premium",  expiry: "Jun 01", visits: 9,  last: "Yoga",       status: "active",   paid: true,  joined: "Mar '25" },
  { id: 5, name: "Kevin Loh",       email: "kevin@email.com",   tone: "rust",   plan: "Standard", expiry: "Apr 30", visits: 3,  last: "HIIT",       status: "expiring", paid: false, joined: "Apr '25" },
  { id: 6, name: "Siti Rahimah",    email: "siti@email.com",    tone: "spark",  plan: "Premium",  expiry: "May 18", visits: 21, last: "Mobility",   status: "active",   paid: true,  joined: "Dec '24" },
  { id: 7, name: "Dylan Ong",       email: "dylan@email.com",   tone: "honey",  plan: "Elite",    expiry: "Jun 10", visits: 29, last: "Strength",   status: "active",   paid: true,  joined: "Sep '24" },
];

const TRAINERS = [
  { id: "t1", name: "Marcus Lim",    spec: "Strength · CrossFit",   rate: 4.9, sessions: 53, tone: "spark",  blurb: "Seven years building strength athletes. Former national powerlifter." },
  { id: "t2", name: "Sarah Kim",     spec: "Yoga · Mindfulness",    rate: 4.8, sessions: 38, tone: "violet", blurb: "RYT-500 certified. Vinyasa specialist trained under Baptiste-affiliated teachers." },
  { id: "t3", name: "Hafiz Ahmad",   spec: "Muay Thai · MMA",       rate: 4.7, sessions: 29, tone: "rust",   blurb: "Former national Muay Thai athlete. 40+ amateur fights." },
  { id: "t4", name: "Priya Mehta",   spec: "Pilates · Mobility",    rate: 4.9, sessions: 24, tone: "jade",   blurb: "Clinical Pilates practitioner. Post-natal & rehab specialist." },
];

const LOCATIONS = [
  { id: "loc1", name: "Tanjong Pagar",  short: "TPG", addr: "12 Tanjong Pagar Rd, #02-18",  cap: 20, in: 14, open: true,  trainer: "Marcus Lim", slots: ["06:00", "07:00", "08:00", "09:00", "17:00", "18:00", "19:00", "20:00"] },
  { id: "loc2", name: "Orchard",        short: "ORD", addr: "313 Orchard Rd, #04-23",       cap: 15, in: 15, open: false, trainer: "Sarah Kim",  slots: ["07:00", "09:00", "11:00", "18:00", "19:00"] },
  { id: "loc3", name: "East Coast",     short: "ECP", addr: "18 Marine Parade Rd, #03-12",  cap: 25, in: 9,  open: true,  trainer: "Hafiz Ahmad", slots: ["06:00", "07:00", "08:00", "17:00", "18:00", "19:00"] },
];

const SESSIONS = [
  { time: "06:00", client: "Marcus Tan",    type: "Strength",  status: "confirmed", price: 120 },
  { time: "07:30", client: "Jenny Wu",      type: "HIIT",      status: "confirmed", price: 90  },
  { time: "09:00", client: "Ahmad Faris",   type: "CrossFit",  status: "confirmed", price: 120 },
  { time: "10:30", client: "Siti Rahimah",  type: "Mobility",  status: "pending",   price: 90  },
  { time: "17:00", client: "Dylan Ong",     type: "Strength",  status: "confirmed", price: 160 },
  { time: "18:30", client: "Priya Sharma",  type: "Yoga Flow", status: "confirmed", price: 120 },
];

const REVENUE = [
  { m: "OCT", v: 8200 },  { m: "NOV", v: 9400 },  { m: "DEC", v: 11200 },
  { m: "JAN", v: 10800 }, { m: "FEB", v: 12600 }, { m: "MAR", v: 14100 }, { m: "APR", v: 17424 },
];

// ═══════════════════════════════════════════════════════════════════════════
// LANDING — Newspaper masthead
// ═══════════════════════════════════════════════════════════════════════════

const Landing = ({ onBiz, onMember, onAffiliate, onSignup }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const date = time.toLocaleDateString("en-SG", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const t24 = time.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div style={{ minHeight: "100vh", background: T.paper, position: "relative", overflow: "hidden" }}>
      <style>{css}</style>

      {/* Top utility bar — like a broadsheet */}
      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>{date} · Singapore</span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 10, color: T.spark, letterSpacing: 1.5 }}>{t24} SGT</span>
            <span className="mono mob-hide" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>Issue Nº 047</span>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>The Fitness Operations Gazette</div>
              <h1 className="news" style={{ fontSize: "clamp(56px, 12vw, 124px)", color: T.text, lineHeight: 0.85, letterSpacing: "-0.04em", fontWeight: 400 }}>
                GymFlow<span style={{ color: T.spark }}>.</span>
              </h1>
            </div>
            <div className="mob-hide" style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>Vol. 1 · Established 2026</div>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, marginTop: 4 }}>S$ 0.00 · Free Tier 14 Days</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main grid — newspaper-style asymmetric */}
      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Hero block — wide */}
        <div style={{ borderBottom: `1px solid ${T.rule}`, paddingBottom: 36, marginBottom: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div>
              <Pill tone="spark">Issue Nº 047 · Lead Story</Pill>
              <h2 className="news" style={{ fontSize: "clamp(36px, 6.5vw, 72px)", color: T.text, lineHeight: 1.0, letterSpacing: "-0.025em", marginTop: 16, marginBottom: 18, maxWidth: 980 }}>
                One platform replaces<br/>
                five Excel sheets, three apps,<br/>
                and your second mobile phone.
              </h2>
              <p className="news-i" style={{ fontSize: "clamp(15px, 2vw, 19px)", color: T.body, lineHeight: 1.55, maxWidth: 720, fontWeight: 300 }}>
                "Built in Singapore for gyms that hate spreadsheets" —<br/>
                Operate your studio, manage your members, get paid.<br/>
                Without the WhatsApp screenshots.
              </p>
            </div>
          </div>
        </div>

        {/* Three-portal split — but uneven, dense, with metadata */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <span className="mono" style={{ fontSize: 11, color: T.faded, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>§ Portal Selector</span>
            <span className="mono mob-hide" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.5, textTransform: "uppercase" }}>Choose your role to begin</span>
          </div>

          <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
            {[
              { id: "biz",       num: "01", title: "Business",    sub: "Owner / Trainer", desc: "Full operational control. Members, schedules, revenue.",       meta: "Most users", action: onBiz },
              { id: "member",    num: "02", title: "Member",      sub: "Gym Members",      desc: "Book any location. Unlock doors. Train where you want.",       meta: "Free", action: onMember },
              { id: "affiliate", num: "03", title: "Affiliate",   sub: "Referral Partner", desc: "Earn 20–35% recurring commission per gym you refer.",          meta: "By invite", action: onAffiliate },
            ].map((p, i) => (
              <div key={p.id} onClick={p.action}
                style={{
                  padding: "24px 24px",
                  borderTop: i > 0 ? `1px solid ${T.rule}` : "none",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 24,
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.panel2; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                <div className="mono" style={{ fontSize: 12, color: T.spark, fontWeight: 600, letterSpacing: 1 }}>{p.num} →</div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                    <h3 className="news" style={{ fontSize: "clamp(24px, 4vw, 32px)", color: T.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>— {p.sub}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: T.body, maxWidth: 600 }}>{p.desc}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Pill>{p.meta}</Pill>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 13, color: T.faded }}>
              Don't have an account? <span onClick={onSignup} style={{ color: T.spark, cursor: "pointer", fontWeight: 600, borderBottom: `1px solid ${T.spark}40` }}>Start a 14-day trial →</span>
            </span>
            <span className="mono" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.5, textTransform: "uppercase" }}>No card required · Cancel anytime</span>
          </div>
        </div>

        {/* Below-the-fold: stats + features in dense grid */}
        <div className="desk-grid">
          {/* Left: Numbers in a stacked block */}
          <div>
            <div style={{ borderTop: `1px solid ${T.rule}`, borderLeft: `1px solid ${T.rule}` }}>
              <div className="desk-4" style={{ background: T.rule }}>
                <StatCell label="Trial Days"   value="14"     sub="No card needed" accent={T.spark} />
                <StatCell label="Processing"   value="2.5%"   sub="+ S$0.30 / payout" />
                <StatCell label="Plans From"   value="$29"    sub="SGD per month" />
                <StatCell label="Payout"       value="1st"    sub="every month" />
              </div>
            </div>
            <div className="news-i" style={{ fontSize: 14, color: T.faded, marginTop: 16, lineHeight: 1.6, maxWidth: 460 }}>
              "Most gym owners spend S$8,000–25,000 building their own system. We do all that for ninety-nine dollars a month. Your call."
              <div className="mono" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.5, marginTop: 8, textTransform: "uppercase", fontStyle: "normal" }}>— GymFlow Editorial Board</div>
            </div>
          </div>

          {/* Right: feature list in tight column */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
              <span className="mono" style={{ fontSize: 11, color: T.faded, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>§ What's Inside</span>
              <div style={{ flex: 1, height: 1, background: T.rule }} />
            </div>

            {[
              { k: "MEM", title: "Member management",     d: "Live profiles, expiry tracking, automated WhatsApp reminders." },
              { k: "BOK", title: "Booking engine",        d: "Class slots, waitlists, GPS-verified door unlock." },
              { k: "PAY", title: "Payments & payouts",    d: "Stripe + PayNow. Members pay direct to you, monthly settlement." },
              { k: "MIG", title: "Migration in 48 hrs",   d: "Upload your Excel, we handle the rest. Existing packages honoured." },
              { k: "AFF", title: "Affiliate program",     d: "20–35% recurring on every gym you refer." },
            ].map(f => (
              <div key={f.k} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "14px 0", borderBottom: `1px solid ${T.rule}` }}>
                <span className="mono" style={{ fontSize: 11, color: T.spark, letterSpacing: 1.5, fontWeight: 600 }}>{f.k}</span>
                <div>
                  <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: T.body, lineHeight: 1.5 }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer / colophon */}
      <footer style={{ borderTop: `1px solid ${T.rule}`, padding: "24px", background: T.ink }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>GymFlow Pte. Ltd. · 2026</span>
          <div style={{ display: "flex", gap: 24 }}>
            <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>Terms</span>
            <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>Privacy</span>
            <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS LOGIN
// ═══════════════════════════════════════════════════════════════════════════

const BizLogin = ({ onBack, onLogin, onSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const go = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const u = BIZ_USERS.find(u => u.email === form.email && u.password === form.password);
    setLoading(false);
    u ? onLogin(u) : setError("Wrong email or password lah. Try again.");
  };

  return (
    <div className="auth-grid" style={{ background: T.paper }}>
      <style>{css}</style>

      {/* Left: editorial side panel */}
      <div className="auth-side" style={{ background: T.ink, borderRight: `1px solid ${T.rule}`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 40 }}>
        <div>
          <button onClick={onBack} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", marginBottom: 64, display: "flex", alignItems: "center", gap: 8 }}>
            ← Back to homepage
          </button>
          <Pill tone="spark">Section A · Business Portal</Pill>
          <h1 className="news" style={{ fontSize: "clamp(40px, 5vw, 64px)", color: T.text, lineHeight: 0.95, letterSpacing: "-0.025em", marginTop: 24, marginBottom: 20, fontWeight: 400 }}>
            The studio,<br/>
            and everything<br/>
            in it.
          </h1>
          <p className="news-i" style={{ fontSize: 16, color: T.body, lineHeight: 1.55, maxWidth: 380, fontWeight: 300 }}>
            Member rolls. Daily takings. Trainer schedules.<br/>
            Door access logs. The lot — under one roof.
          </p>
        </div>

        {/* Stats footer */}
        <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
            {[
              { v: "S$0",    l: "Trial cost"     },
              { v: "14d",    l: "Free trial"     },
              { v: "2.5%",   l: "Processing"     },
              { v: "1st",    l: "Payout day"     },
            ].map((s, i) => (
              <div key={s.l} style={{ borderRight: i % 2 === 0 ? `1px solid ${T.rule}` : "none", borderBottom: i < 2 ? `1px solid ${T.rule}` : "none", padding: "12px 16px" }}>
                <div className="num" style={{ fontSize: 22, color: T.spark, fontWeight: 600, letterSpacing: "-0.02em" }}>{s.v}</div>
                <div className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380, animation: "lift 0.3s ease" }}>
          {/* Mobile back */}
          <button onClick={onBack} className="mono mob-hide" style={{ background: "none", border: "none", color: T.faded, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            ← Back
          </button>
          
          {/* Header */}
          <div style={{ borderBottom: `2px solid ${T.text}`, paddingBottom: 16, marginBottom: 28 }}>
            <div className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Section A · Sign In</div>
            <h2 className="news" style={{ fontSize: 36, color: T.text, letterSpacing: "-0.02em", lineHeight: 1, fontWeight: 400 }}>
              Sign in.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email Address" type="email" placeholder="you@yourgym.sg" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <div>
              <Field label="Password" type={show ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <div onClick={() => setShow(p => !p)} className="mono" style={{ fontSize: 10, color: T.faded, marginTop: 6, cursor: "pointer", textAlign: "right", letterSpacing: 1.2, textTransform: "uppercase" }}>{show ? "Hide" : "Show"} password</div>
            </div>
            {error && (
              <div style={{ background: `${T.flag}10`, border: `1px solid ${T.flag}30`, padding: "10px 12px", fontSize: 12.5, color: T.flag }}>
                {error}
              </div>
            )}
            <Btn variant="primary" onClick={go} loading={loading} fw size="lg">Continue →</Btn>
            
            <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 16, fontSize: 13, color: T.faded, textAlign: "center" }}>
              No account yet? <span onClick={onSignup} style={{ color: T.spark, cursor: "pointer", fontWeight: 600, borderBottom: `1px solid ${T.spark}40` }}>Start free trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEMBER LOGIN
// ═══════════════════════════════════════════════════════════════════════════

const MemberLogin = ({ onBack, onLogin, onSignup }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const DEMO = [{ email: "marcus@email.com", password: "pass123", name: "Marcus Tan", plan: "Premium", avatar: "MT", tone: "spark" }];

  const go = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const u = DEMO.find(u => u.email === email && u.password === pwd);
    setLoading(false);
    u ? onLogin(u) : setError("Wrong email or password lah. Try again.");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      <div style={{ borderBottom: `1px solid ${T.rule}`, padding: "12px 24px", background: T.ink }}>
        <button onClick={onBack} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          ← Back to homepage
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "lift 0.3s ease" }}>
          <div style={{ borderBottom: `2px solid ${T.text}`, paddingBottom: 18, marginBottom: 28 }}>
            <Pill tone="spark">Section B · Member Portal</Pill>
            <h2 className="news" style={{ fontSize: 40, color: T.text, letterSpacing: "-0.025em", lineHeight: 0.95, fontWeight: 400, marginTop: 14 }}>
              The members'<br/>entrance.
            </h2>
            <p className="news-i" style={{ fontSize: 14, color: T.body, marginTop: 10, fontWeight: 300 }}>
              Book sessions. Unlock any gym. Train where you want.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email Address" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <Field label="Password" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} />
            {error && (
              <div style={{ background: `${T.flag}10`, border: `1px solid ${T.flag}30`, padding: "10px 12px", fontSize: 12.5, color: T.flag }}>
                {error}
              </div>
            )}
            <Btn onClick={go} loading={loading} fw size="lg" variant="spark">Continue →</Btn>
            <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 16, fontSize: 13, color: T.faded, textAlign: "center" }}>
              No account yet? <span onClick={onSignup} style={{ color: T.spark, cursor: "pointer", fontWeight: 600, borderBottom: `1px solid ${T.spark}40` }}>Sign up free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// OWNER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const OwnerDash = ({ user, onLogout }) => {
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  
  const max = Math.max(...REVENUE.map(d => d.v));
  const now = REVENUE[REVENUE.length - 1].v;
  const prev = REVENUE[REVENUE.length - 2].v;
  const growth = Math.round(((now - prev) / prev) * 100);
  const totalMembers = MEMBERS.length;
  const activeMembers = MEMBERS.filter(m => m.status === "active").length;
  const filtered = MEMBERS.filter(m => filter === "all" || m.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: T.paper }}>
      <style>{css}</style>

      {/* ── Top utility strip ── */}
      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink, padding: "8px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>{user.gym} · Member since {user.since}</span>
          
        </div>
      </div>

      {/* ── Masthead ── */}
      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "20px 24px 16px", background: T.paper }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Owner Dashboard</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 48px)", color: T.text, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400 }}>
              GymFlow<span style={{ color: T.spark }}>.</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="mob-hide" style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{user.name}</div>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.2, textTransform: "uppercase" }}>{user.role}</div>
            </div>
            <Avatar name={user.name} size={36} tone="honey" />
            <Btn variant="outline" size="sm" onClick={onLogout}>Sign out</Btn>
          </div>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink }}>
        <nav className="scroll-x" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          {["overview", "members", "schedule", "revenue", "operations"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 0", marginRight: 28,
              background: "none", border: "none",
              color: tab === t ? T.text : T.faded,
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12.5, fontWeight: 600,
              letterSpacing: 0.3,
              cursor: "pointer",
              borderBottom: tab === t ? `2px solid ${T.spark}` : "2px solid transparent",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </nav>
      </div>

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "overview" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            {/* ── Lead story: revenue ── */}
            <div style={{ borderBottom: `1px solid ${T.rule}`, paddingBottom: 32, marginBottom: 0 }}>
              <div className="desk-grid">
                <div>
                  <Pill tone="jade">↑ {growth}% Month-on-Month</Pill>
                  <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 14, marginBottom: 4 }}>Monthly Revenue · April 2026</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span className="num hero-num" style={{ fontSize: "clamp(64px, 11vw, 110px)", color: T.text, lineHeight: 0.85, fontWeight: 600, letterSpacing: "-0.04em" }}>${now.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: 14, color: T.body, maxWidth: 460, lineHeight: 1.55 }}>
                    {totalMembers} members on the books. {SESSIONS.length} sessions on today's schedule. {LOCATIONS.length} active locations.
                  </p>
                </div>

                {/* Bar chart on right */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                    <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>7-Month Trajectory</span>
                    <span className="mono" style={{ fontSize: 10, color: T.jade, letterSpacing: 1 }}>+112% YTD</span>
                  </div>
                  <div className="chart-mobile" style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, paddingBottom: 24, borderBottom: `1px solid ${T.rule}` }}>
                    {REVENUE.map((d, i) => {
                      const h = (d.v / max) * 100;
                      const isLast = i === REVENUE.length - 1;
                      return (
                        <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                          {isLast && (
                            <div className="mono" style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: T.spark, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                              ${(d.v/1000).toFixed(1)}k
                            </div>
                          )}
                          <div style={{
                            width: "100%",
                            height: `${h}%`,
                            background: isLast ? T.spark : T.rule2,
                            minHeight: 4,
                          }} />
                          <span className="mono" style={{ fontSize: 9.5, color: isLast ? T.spark : T.faded, letterSpacing: 1, fontWeight: 500 }}>{d.m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── KPI strip ── */}
            <div className="desk-4" style={{ background: T.rule, borderTop: `1px solid ${T.rule}` }}>
              <StatCell label="Active Members" value={activeMembers} sub={`/ ${totalMembers} total`} />
              <StatCell label="Sessions Today" value={SESSIONS.length} sub={`$${SESSIONS.reduce((a, s) => a + s.price, 0)} booked`} />
              <StatCell label="Avg Visit Rate" value="18.2" sub="visits per member" subTone="up" />
              <StatCell label="Retention Rate" value="94%" sub="3-month rolling" subTone="up" />
            </div>

            {/* ── Two-column: members + schedule ── */}
            <div className="desk-grid" style={{ marginTop: 32 }}>
              {/* Recent members table */}
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <h2 className="news" style={{ fontSize: 22, color: T.text, letterSpacing: "-0.015em", fontWeight: 500 }}>Recent activity</h2>
                  <span onClick={() => setTab("members")} className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", borderBottom: `1px solid ${T.rule2}` }}>View all members →</span>
                </div>
                <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
                  {MEMBERS.slice(0, 5).map((m, i) => (
                    <div key={m.id} className="row-hover" style={{ padding: "14px 18px", borderBottom: i < 4 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar name={m.name} size={34} tone={m.tone} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 13.5, color: T.text, fontWeight: 600 }}>{m.name}</span>
                          {!m.paid && <Pill tone="flag">Unpaid</Pill>}
                        </div>
                        <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5 }}>{m.last} · {m.joined}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="num" style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{m.visits}</div>
                        <div className="mono" style={{ fontSize: 9, color: T.faded, letterSpacing: 1, textTransform: "uppercase" }}>visits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Today's schedule */}
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <h2 className="news" style={{ fontSize: 22, color: T.text, letterSpacing: "-0.015em", fontWeight: 500 }}>Today's schedule</h2>
                  <span onClick={() => setTab("schedule")} className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", borderBottom: `1px solid ${T.rule2}` }}>View week →</span>
                </div>
                <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
                  {SESSIONS.slice(0, 5).map((s, i) => (
                    <div key={i} className="row-hover" style={{ padding: "14px 18px", borderBottom: i < 4 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                      <span className="mono" style={{ fontSize: 14, color: T.spark, fontWeight: 600, minWidth: 52, letterSpacing: 0.5 }}>{s.time}</span>
                      <div style={{ width: 1, height: 28, background: T.rule }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600 }}>{s.client}</div>
                        <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5 }}>{s.type} · ${s.price}</div>
                      </div>
                      <Pill tone={s.status === "confirmed" ? "jade" : "honey"}>{s.status}</Pill>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === "members" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Members</div>
                <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500 }}>
                  Member rolls
                </h1>
                <p style={{ fontSize: 13.5, color: T.body, marginTop: 6 }}>{totalMembers} on the books · {activeMembers} active · {totalMembers - activeMembers} expiring</p>
              </div>
              <div style={{ display: "flex" }}>
                {[{ k: "all", l: "All" }, { k: "active", l: "Active" }, { k: "expiring", l: "Expiring" }].map((f, i) => (
                  <button key={f.k} onClick={() => setFilter(f.k)} className="mono" style={{
                    padding: "8px 14px",
                    background: filter === f.k ? T.text : "transparent",
                    color: filter === f.k ? T.ink : T.body,
                    border: `1px solid ${T.rule}`,
                    borderLeft: i > 0 ? "none" : `1px solid ${T.rule}`,
                    fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                    cursor: "pointer", borderRadius: 0,
                  }}>{f.l}</button>
                ))}
              </div>
            </div>

            <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
              {/* Header row */}
              <div className="table-head-mobile" style={{ background: T.ink, padding: "10px 18px", display: "grid", gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 0.8fr", gap: 12, borderBottom: `1px solid ${T.rule}` }}>
                {["Member", "Last Class", "Visits", "Plan", "Status"].map(h => (
                  <span key={h} className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>{h}</span>
                ))}
              </div>
              {filtered.map((m, i) => (
                <div key={m.id} className="row-hover table-row-mobile" style={{ padding: "14px 18px", borderBottom: i < filtered.length - 1 ? `1px solid ${T.rule}` : "none", display: "grid", gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 0.8fr", gap: 12, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <Avatar name={m.name} size={32} tone={m.tone} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600 }}>{m.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 0.5 }}>{m.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: T.body }}>{m.last}</div>
                  <div className="num" style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{m.visits}</div>
                  <Pill tone={m.plan === "Elite" ? "violet" : m.plan === "Premium" ? "spark" : "default"}>{m.plan}</Pill>
                  <Pill tone={m.status === "active" ? "jade" : "honey"}>{m.status}</Pill>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Schedule</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              Today's bookings
            </h1>
            <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
              {SESSIONS.map((s, i) => (
                <div key={i} style={{ padding: "18px 20px", borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ minWidth: 64 }}>
                    <div className="mono" style={{ fontSize: 18, color: T.spark, fontWeight: 600, letterSpacing: 0.5 }}>{s.time}</div>
                  </div>
                  <div style={{ width: 1, height: 36, background: T.rule }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{s.client}</div>
                    <div className="mono" style={{ fontSize: 11, color: T.faded, letterSpacing: 0.5, marginTop: 2 }}>{s.type}</div>
                  </div>
                  <Pill tone={s.status === "confirmed" ? "jade" : "honey"}>{s.status}</Pill>
                  <span className="num" style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>${s.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "revenue" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Revenue</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              Money in, money out
            </h1>
            <div className="desk-4" style={{ background: T.rule, border: `1px solid ${T.rule}` }}>
              <StatCell label="This Month" value={`$${now.toLocaleString()}`} sub={`↑ ${growth}% MoM`} subTone="up" accent={T.spark} />
              <StatCell label="Last Month" value={`$${prev.toLocaleString()}`} />
              <StatCell label="Year-to-Date" value={`$${REVENUE.reduce((a, d) => a + d.v, 0).toLocaleString()}`} />
              <StatCell label="Avg/Member" value={`$${Math.round(now / activeMembers)}`} sub="per active" />
            </div>
          </div>
        )}

        {tab === "operations" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Operations</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              The plumbing
            </h1>
            <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 32 }}>
              <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7, maxWidth: 600 }}>
                Migration tools, WhatsApp settings, package builder, locations, and integrations live here.
                Coming next iteration.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TRAINER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const TrainerDash = ({ user, onLogout }) => {
  const [tab, setTab] = useState("today");
  const monthEarnings = 9600;
  const sessionsThisMonth = 53;

  return (
    <div style={{ minHeight: "100vh", background: T.paper }}>
      <style>{css}</style>

      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink, padding: "8px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>{user.gym} · Trainer since {user.since}</span>
          
        </div>
      </div>

      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Trainer Dashboard</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 48px)", color: T.text, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400 }}>
              GymFlow<span style={{ color: T.spark }}>.</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={user.name} size={36} tone="spark" />
            <Btn variant="outline" size="sm" onClick={onLogout}>Sign out</Btn>
          </div>
        </div>
      </header>

      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink }}>
        <nav className="scroll-x" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          {["today", "clients", "schedule", "earnings"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 0", marginRight: 28, background: "none", border: "none",
              color: tab === t ? T.text : T.faded, fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12.5, fontWeight: 600, letterSpacing: 0.3, cursor: "pointer",
              borderBottom: tab === t ? `2px solid ${T.spark}` : "2px solid transparent",
              textTransform: "uppercase", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </nav>
      </div>

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "today" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div style={{ borderBottom: `1px solid ${T.rule}`, paddingBottom: 28, marginBottom: 0 }}>
              <Pill tone="spark">Wednesday · 24 April</Pill>
              <h1 className="news" style={{ fontSize: "clamp(40px, 7vw, 64px)", color: T.text, letterSpacing: "-0.025em", fontWeight: 400, marginTop: 14, lineHeight: 0.95 }}>
                Hi {user.name.split(" ")[0]}.<br/>
                <span style={{ color: T.faded }}>{SESSIONS.length} sessions on today.</span>
              </h1>
              <p style={{ fontSize: 14.5, color: T.body, marginTop: 12 }}>${SESSIONS.reduce((a, s) => a + s.price, 0)} in bookings · 3 confirmed · 1 pending. Coffee first ☕.</p>
            </div>

            <div className="desk-4" style={{ background: T.rule, borderTop: `1px solid ${T.rule}` }}>
              <StatCell label="Sessions Today" value={SESSIONS.length} sub="6 booked, 0 cancelled" />
              <StatCell label="Today's Take" value={`$${SESSIONS.reduce((a, s) => a + s.price, 0)}`} sub="before processing" />
              <StatCell label="This Month" value={`$${monthEarnings.toLocaleString()}`} sub={`${sessionsThisMonth} sessions`} subTone="up" accent={T.spark} />
              <StatCell label="Active Clients" value="12" sub="3 new in April" subTone="up" />
            </div>

            <section style={{ marginTop: 32 }}>
              <h2 className="news" style={{ fontSize: 22, color: T.text, letterSpacing: "-0.015em", fontWeight: 500, marginBottom: 12 }}>Today's bookings</h2>
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
                {SESSIONS.map((s, i) => (
                  <div key={i} className="row-hover" style={{ padding: "16px 18px", borderBottom: i < SESSIONS.length - 1 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="mono" style={{ fontSize: 16, color: T.spark, fontWeight: 600, minWidth: 56, letterSpacing: 0.5 }}>{s.time}</span>
                    <div style={{ width: 1, height: 28, background: T.rule }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600 }}>{s.client}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5, marginTop: 1 }}>{s.type}</div>
                    </div>
                    <Pill tone={s.status === "confirmed" ? "jade" : "honey"}>{s.status}</Pill>
                    <span className="num" style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>${s.price}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "clients" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Clients</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              The roster
            </h1>
            <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
              {MEMBERS.slice(0, 6).map((m, i) => (
                <div key={m.id} className="row-hover" style={{ padding: "16px 18px", borderBottom: i < 5 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar name={m.name} size={36} tone={m.tone} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5, marginTop: 2 }}>Last: {m.last} · Joined {m.joined}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{m.visits}</div>
                    <div className="mono" style={{ fontSize: 9, color: T.faded, letterSpacing: 1, textTransform: "uppercase" }}>sessions</div>
                  </div>
                  <Pill tone={m.status === "active" ? "jade" : "honey"}>{m.status}</Pill>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === "schedule" || tab === "earnings") && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · {tab === "earnings" ? "Earnings" : "Schedule"}</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              {tab === "earnings" ? "Money matters" : "The week ahead"}
            </h1>
            <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 32 }}>
              <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7 }}>Detailed view coming next iteration.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEMBER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const MemberDash = ({ user, onLogout }) => {
  const [tab, setTab] = useState("book");
  const [bookTab, setBookTab] = useState("gym");
  const [selLoc, setSelLoc] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [success, setSuccess] = useState(false);

  const confirm = () => {
    setBookings(p => [{ id: Date.now(), location: selLoc.name, slot: selSlot, date: "Today" }, ...p]);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelLoc(null); setSelSlot(null); }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.paper }}>
      <style>{css}</style>

      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink, padding: "8px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>{user.plan} member · 12 visits this month</span>
          
        </div>
      </div>

      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Member Portal</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 48px)", color: T.text, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400 }}>
              GymFlow<span style={{ color: T.spark }}>.</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={user.name} size={36} tone="spark" />
            <Btn variant="outline" size="sm" onClick={onLogout}>Sign out</Btn>
          </div>
        </div>
      </header>

      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink }}>
        <nav className="scroll-x" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          {["book", "sessions", "access"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 0", marginRight: 28, background: "none", border: "none",
              color: tab === t ? T.text : T.faded, fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12.5, fontWeight: 600, letterSpacing: 0.3, cursor: "pointer",
              borderBottom: tab === t ? `2px solid ${T.spark}` : "2px solid transparent",
              textTransform: "uppercase", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </nav>
      </div>

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "book" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div style={{ borderBottom: `1px solid ${T.rule}`, paddingBottom: 28, marginBottom: 28 }}>
              <Pill tone="spark">Hello again · {user.name.split(" ")[0]}</Pill>
              <h1 className="news" style={{ fontSize: "clamp(36px, 6vw, 56px)", color: T.text, letterSpacing: "-0.025em", fontWeight: 400, marginTop: 14, lineHeight: 0.95 }}>
                Where to today?
              </h1>
              <p style={{ fontSize: 14.5, color: T.body, marginTop: 10 }}>Book a gym slot or a personal trainer. Walk-in welcome but advance booking ah.</p>
            </div>

            <div style={{ display: "flex", marginBottom: 24, border: `1px solid ${T.rule}` }}>
              {[{ k: "gym", l: "Book a Gym" }, { k: "trainer", l: "Book a Trainer" }].map((t, i) => (
                <button key={t.k} onClick={() => { setBookTab(t.k); }} className="mono" style={{
                  flex: 1, padding: "12px",
                  background: bookTab === t.k ? T.text : "transparent",
                  color: bookTab === t.k ? T.ink : T.body,
                  border: "none",
                  borderLeft: i > 0 ? `1px solid ${T.rule}` : "none",
                  fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                  cursor: "pointer", borderRadius: 0,
                }}>{t.l}</button>
              ))}
            </div>

            {bookTab === "gym" && (
              <div className="desk-grid">
                <div>
                  <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Step 1 · Choose location</div>
                  <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
                    {LOCATIONS.map((loc, i) => {
                      const sel = selLoc?.id === loc.id;
                      return (
                        <div key={loc.id} onClick={() => { setSelLoc(loc); setSelSlot(null); }} style={{
                          padding: "16px 18px",
                          borderBottom: i < LOCATIONS.length - 1 ? `1px solid ${T.rule}` : "none",
                          background: sel ? T.panel2 : "transparent",
                          borderLeft: sel ? `3px solid ${T.spark}` : "3px solid transparent",
                          cursor: "pointer", transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                <span className="mono" style={{ fontSize: 10, color: T.spark, letterSpacing: 1, fontWeight: 600 }}>{loc.short}</span>
                                <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{loc.name}</span>
                              </div>
                              <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5 }}>{loc.addr}</div>
                            </div>
                            <Pill tone={loc.open ? "jade" : "flag"}>{loc.open ? "Open" : "Full"}</Pill>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.rule}` }}>
                            <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 0.5 }}>Trainer: {loc.trainer}</span>
                            <span className="mono" style={{ fontSize: 10, color: T.spark, fontWeight: 500, letterSpacing: 0.5 }}>{loc.cap - loc.in} / {loc.cap} spots</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Step 2 · {selLoc ? "Choose time" : "Pick a location first"}</div>
                  {!selLoc && (
                    <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 36, textAlign: "center" }}>
                      <div className="mono" style={{ fontSize: 11, color: T.ghost, letterSpacing: 1.5, textTransform: "uppercase" }}>↰ Choose a location first</div>
                    </div>
                  )}
                  {selLoc && (
                    <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 18 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }}>
                        {selLoc.slots.map(s => (
                          <button key={s} onClick={() => setSelSlot(s)} className="mono" style={{
                            padding: "12px",
                            background: selSlot === s ? T.spark : T.ink,
                            color: selSlot === s ? T.ink : T.text,
                            border: `1px solid ${selSlot === s ? T.spark : T.rule}`,
                            fontSize: 12.5, fontWeight: 600, cursor: "pointer", borderRadius: 0,
                            letterSpacing: 0.5,
                          }}>{s}</button>
                        ))}
                      </div>
                      {selSlot && !success && <Btn variant="spark" onClick={confirm} fw size="lg">Confirm {selSlot} booking →</Btn>}
                      {success && (
                        <div style={{ padding: 14, background: `${T.jade}10`, border: `1px solid ${T.jade}30`, color: T.jade, fontWeight: 600, fontSize: 14, textAlign: "center" }}>✓ Booked. See you at {selLoc.short}.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {bookTab === "trainer" && (
              <div className="desk-grid">
                {TRAINERS.map(t => (
                  <div key={t.id} style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20 }}>
                    <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                      <Avatar name={t.name} size={48} tone={t.tone} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, color: T.text, fontWeight: 600 }}>{t.name}</div>
                        <div className="mono" style={{ fontSize: 10.5, color: T.spark, letterSpacing: 0.5, marginTop: 2 }}>{t.spec}</div>
                        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                          <span className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5 }}>★ {t.rate}</span>
                          <span className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5 }}>{t.sessions} sessions</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12.5, color: T.body, lineHeight: 1.55, marginBottom: 14, paddingTop: 14, borderTop: `1px solid ${T.rule}` }}>{t.blurb}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="primary" size="sm" style={{ flex: 1 }}>Book session</Btn>
                      <Btn variant="outline" size="sm">Message</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "sessions" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · My Sessions</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 24 }}>
              What's booked
            </h1>
            {bookings.length === 0 ? (
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 48, textAlign: "center" }}>
                <div className="news-i" style={{ fontSize: 18, color: T.faded, marginBottom: 16 }}>"Nothing booked yet."</div>
                <Btn variant="spark" onClick={() => setTab("book")}>Book your first session →</Btn>
              </div>
            ) : (
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel }}>
                {bookings.map((b, i) => (
                  <div key={b.id} className="row-hover" style={{ padding: "16px 18px", borderBottom: i < bookings.length - 1 ? `1px solid ${T.rule}` : "none", display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="mono" style={{ fontSize: 16, color: T.spark, fontWeight: 600, letterSpacing: 0.5 }}>{b.slot}</span>
                    <div style={{ width: 1, height: 28, background: T.rule }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600 }}>{b.location}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5, marginTop: 1 }}>{b.date}</div>
                    </div>
                    <Btn variant="outline" size="sm" onClick={() => setBookings(p => p.filter(x => x.id !== b.id))}>Cancel</Btn>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "access" && (
          <div style={{ animation: "lift 0.3s ease" }}>
            <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section · Door Access</div>
            <h1 className="news" style={{ fontSize: "clamp(32px, 5vw, 44px)", color: T.text, letterSpacing: "-0.02em", fontWeight: 500, marginBottom: 6 }}>
              Tap to unlock
            </h1>
            <p style={{ fontSize: 14, color: T.body, marginBottom: 24 }}>Stand within 50m of any GymFlow location. We verify by GPS.</p>
            <div className="desk-3">
              {LOCATIONS.map(loc => (
                <div key={loc.id} style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span className="mono" style={{ fontSize: 11, color: T.spark, letterSpacing: 1, fontWeight: 600 }}>{loc.short}</span>
                    <Pill tone={loc.open ? "jade" : "flag"}>{loc.open ? "Open" : "Closed"}</Pill>
                  </div>
                  <div style={{ fontSize: 16, color: T.text, fontWeight: 600, marginBottom: 4 }}>{loc.name}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5, marginBottom: 18 }}>{loc.addr}</div>
                  <Btn variant="spark" size="md" fw disabled={!loc.open}>{loc.open ? "Unlock door →" : "Closed"}</Btn>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AFFILIATE LANDING
// ═══════════════════════════════════════════════════════════════════════════

const AffiliateLanding = ({ onBack, onApply }) => (
  <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column" }}>
    <style>{css}</style>

    <div style={{ borderBottom: `1px solid ${T.rule}`, padding: "12px 24px", background: T.ink }}>
      <button onClick={onBack} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        ← Back to homepage
      </button>
    </div>

    <header style={{ borderBottom: `2px solid ${T.text}`, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Pill tone="honey">Section C · Affiliate Program</Pill>
        <h1 className="news" style={{ fontSize: "clamp(48px, 9vw, 96px)", color: T.text, lineHeight: 0.92, letterSpacing: "-0.03em", fontWeight: 400, marginTop: 18 }}>
          Refer a gym.<br/>
          Get paid every<br/>
          single month.
        </h1>
        <p className="news-i" style={{ fontSize: 18, color: T.body, marginTop: 18, fontWeight: 300, lineHeight: 1.5, maxWidth: 580 }}>
          20% recurring commission for every gym you refer.<br/>
          30% at 15 active referrals. 35% at 30. No caps.
        </p>
      </div>
    </header>

    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", flex: 1, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span className="mono" style={{ fontSize: 11, color: T.faded, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>§ Tier Structure</span>
        <span className="mono mob-hide" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.5, textTransform: "uppercase" }}>The more you refer, the higher your cut</span>
      </div>

      <div className="desk-4" style={{ background: T.rule, border: `1px solid ${T.rule}`, marginBottom: 36 }}>
        {[
          { rate: "20%", tier: "Standard", range: "0–4 gyms",   accent: T.body },
          { rate: "25%", tier: "Silver",   range: "5–14 gyms",  accent: T.faded },
          { rate: "30%", tier: "Gold",     range: "15–29 gyms", accent: T.honey },
          { rate: "35%", tier: "Platinum", range: "30+ gyms",   accent: T.spark },
        ].map(t => (
          <div key={t.tier} style={{ background: T.panel, padding: "22px 20px", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: t.accent }} />
            <div className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{t.range}</div>
            <div className="num" style={{ fontSize: "clamp(36px, 5vw, 48px)", color: T.text, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 6 }}>{t.rate}</div>
            <div className="news" style={{ fontSize: 18, color: t.accent, fontWeight: 500 }}>{t.tier}</div>
          </div>
        ))}
      </div>

      <Btn variant="primary" size="lg" onClick={onApply}>Apply for affiliate program →</Btn>
    </main>

    <footer style={{ borderTop: `1px solid ${T.rule}`, padding: "16px 24px", background: T.ink }}>
      <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>Free to join · Paid on results · No caps</span>
    </footer>
  </div>
);


// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS SIGNUP — full flow with credit card for trial
// ═══════════════════════════════════════════════════════════════════════════

const BusinessSignup = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1); // 1 = details, 2 = card, 3 = success
  const [form, setForm] = useState({
    gymName: "", ownerName: "", email: "", password: "",
    plan: "starter",
    cardNum: "", cardExp: "", cardCvc: "", cardName: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const plans = [
    { id: "solo",    name: "Solo Trainer", price: 29,  desc: "Up to 30 clients · 1 trainer" },
    { id: "starter", name: "Starter",      price: 49,  desc: "Up to 100 members · 3 trainers" },
    { id: "pro",     name: "Pro",          price: 99,  desc: "Unlimited members · 10 trainers", featured: true },
    { id: "elite",   name: "Elite",        price: 199, desc: "Multi-location · Priority support" },
  ];

  const validateStep1 = () => {
    const e = {};
    if (!form.gymName) e.gymName = "Required";
    if (!form.ownerName) e.ownerName = "Required";
    if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.password || form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.cardNum || form.cardNum.replace(/\s/g, "").length < 15) e.cardNum = "Invalid card number";
    if (!form.cardExp || !/^\d{2}\/\d{2}$/.test(form.cardExp)) e.cardExp = "Format: MM/YY";
    if (!form.cardCvc || form.cardCvc.length < 3) e.cardCvc = "Invalid CVC";
    if (!form.cardName) e.cardName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) submitForm();
  };

  const submitForm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // Simulate Stripe + Supabase calls
    setLoading(false);
    setStep(3);
  };

  const formatCard = v => v.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  const formatExp = v => {
    const c = v.replace(/\D/g, "").slice(0, 4);
    return c.length >= 2 ? c.slice(0, 2) + (c.length > 2 ? "/" + c.slice(2) : "") : c;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink, padding: "12px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>
            ← Back to homepage
          </button>
          <span className="mono" style={{ fontSize: 10, color: T.spark, letterSpacing: 1.5 }}>STEP {step} OF 2</span>
        </div>
      </div>

      {/* Masthead */}
      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Pill tone="spark">14-Day Free Trial · Sign Up</Pill>
          <h1 className="news" style={{ fontSize: "clamp(32px, 6vw, 48px)", color: T.text, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400, marginTop: 14 }}>
            {step === 1 && "Set up your gym."}
            {step === 2 && "Card on file."}
            {step === 3 && "You're in."}
          </h1>
          <p className="news-i" style={{ fontSize: 15, color: T.body, marginTop: 10, fontWeight: 300, maxWidth: 560 }}>
            {step === 1 && "Tell us about your business. Takes 2 minutes."}
            {step === 2 && "Free for 14 days. We'll auto-charge after that — cancel anytime before."}
            {step === 3 && "Trial active. We've sent your login link to " + form.email + "."}
          </p>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* STEP 1: Business details + plan */}
          {step === 1 && (
            <div style={{ animation: "lift 0.3s ease" }}>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section A · Your Business</div>
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field label="Gym / Studio Name" placeholder="e.g. Alpha Athletics" value={form.gymName} error={errors.gymName} onChange={e => setForm(p => ({ ...p, gymName: e.target.value }))} />
                  <Field label="Your Name" placeholder="e.g. Alex Chen" value={form.ownerName} error={errors.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} />
                  <Field label="Email Address" type="email" placeholder="you@yourgym.sg" value={form.email} error={errors.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  <Field label="Password" type="password" placeholder="At least 6 characters" value={form.password} error={errors.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                </div>
              </div>

              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section B · Choose Your Plan</div>
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel, marginBottom: 24 }}>
                {plans.map((p, i) => {
                  const sel = form.plan === p.id;
                  return (
                    <div key={p.id} onClick={() => setForm(prev => ({ ...prev, plan: p.id }))} style={{
                      padding: "16px 20px",
                      borderBottom: i < plans.length - 1 ? `1px solid ${T.rule}` : "none",
                      borderLeft: sel ? `3px solid ${T.spark}` : "3px solid transparent",
                      background: sel ? T.panel2 : "transparent",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <div style={{
                        width: 18, height: 18, border: `1.5px solid ${sel ? T.spark : T.rule2}`,
                        borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {sel && <div style={{ width: 8, height: 8, background: T.spark, borderRadius: "50%" }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{p.name}</span>
                          {p.featured && <Pill tone="spark">Most popular</Pill>}
                        </div>
                        <div className="mono" style={{ fontSize: 10.5, color: T.faded, letterSpacing: 0.5, marginTop: 2 }}>{p.desc}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span className="num" style={{ fontSize: 22, color: T.text, fontWeight: 600, letterSpacing: "-0.02em" }}>${p.price}</span>
                        <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 0.5, marginLeft: 4 }}>/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Btn variant="primary" onClick={next} fw size="lg">Continue to payment →</Btn>
              <p className="mono" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 14, textAlign: "center" }}>
                14 days free · No charge today · Cancel anytime
              </p>
            </div>
          )}

          {/* STEP 2: Credit card */}
          {step === 2 && (
            <div style={{ animation: "lift 0.3s ease" }}>
              <div style={{ background: `${T.spark}10`, border: `1px solid ${T.spark}30`, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, color: T.spark, marginTop: 2 }}>ⓘ</span>
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600, marginBottom: 4 }}>Why we need your card now</div>
                  <p style={{ fontSize: 12, color: T.body, lineHeight: 1.5 }}>
                    Your card won't be charged today. Free for 14 days. After that, ${plans.find(p => p.id === form.plan).price}/month auto-deducts on the 1st of each month. Cancel anytime in dashboard settings — no questions asked.
                  </p>
                </div>
              </div>

              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section C · Payment Details</div>

              <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field 
                    label="Card Number" 
                    placeholder="1234 5678 9012 3456" 
                    value={form.cardNum}
                    error={errors.cardNum}
                    onChange={e => setForm(p => ({ ...p, cardNum: formatCard(e.target.value) }))}
                    inputMode="numeric"
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field 
                      label="Expires" 
                      placeholder="MM/YY" 
                      value={form.cardExp}
                      error={errors.cardExp}
                      onChange={e => setForm(p => ({ ...p, cardExp: formatExp(e.target.value) }))}
                      inputMode="numeric"
                    />
                    <Field 
                      label="CVC" 
                      placeholder="123" 
                      value={form.cardCvc}
                      error={errors.cardCvc}
                      onChange={e => setForm(p => ({ ...p, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      inputMode="numeric"
                    />
                  </div>
                  <Field 
                    label="Cardholder Name" 
                    placeholder="As shown on card" 
                    value={form.cardName}
                    error={errors.cardName}
                    onChange={e => setForm(p => ({ ...p, cardName: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ border: `1px solid ${T.rule}`, background: T.ink, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>Charged today</span>
                  <span className="num" style={{ fontSize: 18, color: T.spark, fontWeight: 600 }}>$0.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${T.rule}` }}>
                  <span className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase" }}>From {new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}</span>
                  <span className="num" style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>${plans.find(p => p.id === form.plan).price}.00 / month</span>
                </div>
              </div>

              <Btn variant="primary" onClick={next} loading={loading} fw size="lg">
                {loading ? "Securing your card..." : "Start 14-day free trial →"}
              </Btn>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <button onClick={() => setStep(1)} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>← Back</button>
                <span className="mono" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.2, textTransform: "uppercase" }}>🔒 Secured by Stripe · TLS 1.3</span>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div style={{ animation: "lift 0.3s ease", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: `${T.jade}1A`, color: T.jade, border: `1px solid ${T.jade}40`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 20 }}>✓</div>
              <h2 className="news" style={{ fontSize: 32, color: T.text, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>Trial activated.</h2>
              <p style={{ fontSize: 14, color: T.body, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
                Welcome to GymFlow. Your trial runs until <strong style={{ color: T.text }}>{new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-SG", { day: "numeric", month: "long" })}</strong>. Login link sent to {form.email}.
              </p>
              <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 24, marginBottom: 24, textAlign: "left", maxWidth: 480, margin: "0 auto 24px" }}>
                <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ What's Next</div>
                {[
                  "Import your member list (CSV)",
                  "Set up your class schedule",
                  "Configure WhatsApp reminders",
                  "Notify your existing members",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderTop: i > 0 ? `1px solid ${T.rule}` : "none" }}>
                    <span className="mono" style={{ fontSize: 11, color: T.spark, letterSpacing: 0.5, fontWeight: 600, minWidth: 24 }}>0{i + 1}</span>
                    <span style={{ fontSize: 13, color: T.body }}>{step}</span>
                  </div>
                ))}
              </div>
              <Btn variant="primary" onClick={onComplete} size="lg">Continue to dashboard →</Btn>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AFFILIATE APPLICATION — proper form
// ═══════════════════════════════════════════════════════════════════════════

const AffiliateApply = ({ onBack, onComplete }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    audience: "", howRefer: "", expectMonth: "1-5",
    payoutMethod: "paynow", payoutDetail: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.audience) e.audience = "Tell us a bit about your reach";
    if (!form.howRefer) e.howRefer = "Required";
    if (!form.payoutDetail) e.payoutDetail = "Required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // Simulate API
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column" }}>
        <style>{css}</style>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <div style={{ maxWidth: 540, textAlign: "center", animation: "lift 0.3s ease" }}>
            <div style={{ width: 64, height: 64, background: `${T.jade}1A`, color: T.jade, border: `1px solid ${T.jade}40`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 20 }}>✓</div>
            <h2 className="news" style={{ fontSize: 36, color: T.text, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 14 }}>Application received.</h2>
            <p style={{ fontSize: 15, color: T.body, marginBottom: 24, lineHeight: 1.6 }}>
              Thanks {form.name.split(" ")[0]}. We review affiliate applications within <strong style={{ color: T.text }}>2 business days</strong>. You'll hear back at {form.email}.
            </p>
            <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 24, textAlign: "left" }}>
              <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Application Summary</div>
              <div style={{ fontSize: 13, color: T.body, lineHeight: 1.7 }}>
                <div><span className="mono" style={{ color: T.faded, fontSize: 11, marginRight: 8 }}>NAME</span>{form.name}</div>
                <div><span className="mono" style={{ color: T.faded, fontSize: 11, marginRight: 8 }}>EMAIL</span>{form.email}</div>
                <div><span className="mono" style={{ color: T.faded, fontSize: 11, marginRight: 8 }}>PHONE</span>{form.phone}</div>
                <div><span className="mono" style={{ color: T.faded, fontSize: 11, marginRight: 8 }}>EXPECT</span>{form.expectMonth} referrals/mo</div>
              </div>
            </div>
            <Btn variant="primary" onClick={onBack}>Back to homepage →</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.ink, padding: "12px 24px" }}>
        <button onClick={onBack} className="mono" style={{ background: "none", border: "none", color: T.faded, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>
          ← Back
        </button>
      </div>

      <header style={{ borderBottom: `2px solid ${T.text}`, padding: "24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Pill tone="honey">Section C · Affiliate Application</Pill>
          <h1 className="news" style={{ fontSize: "clamp(32px, 6vw, 48px)", color: T.text, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400, marginTop: 14 }}>
            Tell us about you.
          </h1>
          <p className="news-i" style={{ fontSize: 15, color: T.body, marginTop: 10, fontWeight: 300, maxWidth: 540 }}>
            We approve affiliates within 2 business days. Help us understand your reach and we'll get you a referral link fast.
          </p>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section A · About You</div>
          <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Full Name" placeholder="e.g. Marcus Tan" value={form.name} error={errors.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              <Field label="Email Address" type="email" placeholder="you@email.com" value={form.email} error={errors.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Field label="WhatsApp / Phone" placeholder="+65 9XXX XXXX" value={form.phone} error={errors.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>

          <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section B · Your Reach</div>
          <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 4 }}>Tell us about your audience</label>
                <textarea
                  placeholder="e.g. I run a fitness Instagram with 12k followers, mostly Singapore-based gym owners and PTs..."
                  value={form.audience}
                  onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                  rows={3}
                  style={{
                    width: "100%", background: T.ink,
                    border: `1px solid ${errors.audience ? T.flag : T.rule}`,
                    color: T.text, padding: "12px 14px", borderRadius: 0,
                    fontSize: 14, fontFamily: "inherit", resize: "vertical",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = errors.audience ? T.flag : T.spark}
                  onBlur={e => e.target.style.borderColor = errors.audience ? T.flag : T.rule}
                />
                {errors.audience && <span style={{ fontSize: 11, color: T.flag, marginTop: 4, display: "block" }}>↳ {errors.audience}</span>}
              </div>
              <Field label="How will you refer gyms?" placeholder="e.g. Direct outreach to gym owners I know" value={form.howRefer} error={errors.howRefer} onChange={e => setForm(p => ({ ...p, howRefer: e.target.value }))} />
              <div>
                <label className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>How many referrals per month do you expect?</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {["1-5", "6-15", "15+"].map(opt => (
                    <button key={opt} type="button" onClick={() => setForm(p => ({ ...p, expectMonth: opt }))} className="mono" style={{
                      padding: "10px",
                      background: form.expectMonth === opt ? T.text : "transparent",
                      color: form.expectMonth === opt ? T.ink : T.body,
                      border: `1px solid ${form.expectMonth === opt ? T.text : T.rule}`,
                      fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0,
                      letterSpacing: 0.5,
                    }}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mono" style={{ fontSize: 10, color: T.faded, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>§ Section C · Payout</div>
          <div style={{ border: `1px solid ${T.rule}`, background: T.panel, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="mono" style={{ fontSize: 9.5, color: T.faded, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>Payout method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {[{ k: "paynow", l: "PayNow" }, { k: "bank", l: "Bank" }, { k: "paypal", l: "PayPal" }].map(opt => (
                    <button key={opt.k} type="button" onClick={() => setForm(p => ({ ...p, payoutMethod: opt.k, payoutDetail: "" }))} className="mono" style={{
                      padding: "10px",
                      background: form.payoutMethod === opt.k ? T.text : "transparent",
                      color: form.payoutMethod === opt.k ? T.ink : T.body,
                      border: `1px solid ${form.payoutMethod === opt.k ? T.text : T.rule}`,
                      fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0,
                      letterSpacing: 0.5,
                    }}>{opt.l}</button>
                  ))}
                </div>
              </div>
              <Field 
                label={form.payoutMethod === "paynow" ? "PayNow phone or UEN" : form.payoutMethod === "bank" ? "Bank account number" : "PayPal email"}
                placeholder={form.payoutMethod === "paynow" ? "+65 9XXX XXXX or 12345678X" : form.payoutMethod === "bank" ? "DBS · 123-456789-0" : "you@email.com"}
                value={form.payoutDetail}
                error={errors.payoutDetail}
                onChange={e => setForm(p => ({ ...p, payoutDetail: e.target.value }))}
              />
            </div>
          </div>

          <Btn variant="primary" onClick={submit} loading={loading} fw size="lg">
            {loading ? "Submitting application..." : "Submit application →"}
          </Btn>
          <p className="mono" style={{ fontSize: 10, color: T.ghost, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 14, textAlign: "center" }}>
            Reviewed within 2 business days · You'll hear back via email
          </p>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  const logout = () => { setUser(null); setScreen("landing"); };

  if (screen === "landing") return <Landing
    onBiz={() => setScreen("biz-login")}
    onMember={() => setScreen("member-login")}
    onAffiliate={() => setScreen("affiliate")}
    onSignup={() => setScreen("biz-signup")}
  />;
  if (screen === "biz-login") return <BizLogin
    onBack={() => setScreen("landing")}
    onLogin={u => { setUser(u); setScreen(u.role === "Owner" ? "owner" : "trainer"); }}
    onSignup={() => setScreen("biz-signup")}
  />;
  if (screen === "biz-signup") return <BusinessSignup
    onBack={() => setScreen("landing")}
    onComplete={() => {
      setUser({ name: "New Owner", role: "Owner", gym: "Your Gym", since: new Date().toLocaleDateString("en-SG", { month: "short", year: "numeric" }) });
      setScreen("owner");
    }}
  />;
  if (screen === "member-login") return <MemberLogin
    onBack={() => setScreen("landing")}
    onLogin={u => { setUser(u); setScreen("member"); }}
    onSignup={() => setScreen("landing")}
  />;
  if (screen === "affiliate") return <AffiliateLanding 
    onBack={() => setScreen("landing")}
    onApply={() => setScreen("affiliate-apply")}
  />;
  if (screen === "affiliate-apply") return <AffiliateApply
    onBack={() => setScreen("affiliate")}
    onComplete={() => setScreen("landing")}
  />;
  if (screen === "owner") return <OwnerDash user={user} onLogout={logout} />;
  if (screen === "trainer") return <TrainerDash user={user} onLogout={logout} />;
  if (screen === "member") return <MemberDash user={user} onLogout={logout} />;
  return null;
}

