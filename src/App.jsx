import { useState, useEffect, useRef } from "react";
 
// ─── DEMO DATA ────────────────────────────────────────────────
const LOCATIONS = [
  {
    id: "loc1", name: "GymFlow Tanjong Pagar", address: "12 Tanjong Pagar Rd, S088332",
    lat: 1.2756, lng: 103.8454, distance: null,
    slots: ["06:00","06:30","07:00","07:30","08:00","09:00","10:00","17:00","18:00","19:00","20:00"],
    capacity: 20, booked: 14, color: "#C8FF00", open: true,
    trainer: "Coach Ryan", phone: "+65 9100 1111"
  },
  {
    id: "loc2", name: "GymFlow Orchard", address: "313 Orchard Rd, S238895",
    lat: 1.3009, lng: 103.8389, distance: null,
    slots: ["07:00","08:00","09:00","10:00","11:00","18:00","19:00","20:00","21:00"],
    capacity: 15, booked: 15, color: "#00D4FF", open: false,
    trainer: "Coach Sarah", phone: "+65 9200 2222"
  },
  {
    id: "loc3", name: "GymFlow Tampines", address: "4 Tampines Central 5, S529588",
    lat: 1.3527, lng: 103.9450, distance: null,
    slots: ["06:00","07:00","08:00","12:00","13:00","17:00","18:00","19:00","20:00","21:00"],
    capacity: 25, booked: 8, color: "#B06AFF", open: true,
    trainer: "Coach Hafiz", phone: "+65 9300 3333"
  },
  {
    id: "loc4", name: "GymFlow Novena", address: "238 Thomson Rd, S307683",
    lat: 1.3204, lng: 103.8439, distance: null,
    slots: ["06:30","07:30","08:30","09:30","17:30","18:30","19:30","20:30"],
    capacity: 12, booked: 6, color: "#FF6B35", open: true,
    trainer: "Coach Priya", phone: "+65 9400 4444"
  },
];
 
const BUSINESS_USERS = [
  { id: "b1", email: "owner@gymflow.sg", password: "gym123", name: "Alex Tan", role: "Gym Owner", gyms: 4, members: 312, avatar: "AT" },
  { id: "b2", email: "trainer@gymflow.sg", password: "train123", name: "Coach Ryan", role: "Head Trainer", gyms: 2, members: 87, avatar: "CR" },
];
 
const CUSTOMER_USERS = [
  { id: "c1", email: "marcus@email.com", password: "pass123", name: "Marcus Tan", plan: "Pro Monthly", avatar: "MT", bookings: 3 },
  { id: "c2", email: "priya@email.com", password: "pass123", name: "Priya Sharma", plan: "10-Class Pass", avatar: "PS", bookings: 1 },
];
 
// ─── THEME ────────────────────────────────────────────────────
const T = {
  bg: "#07080A", card: "#0F1117", card2: "#141720",
  border: "#1E2130", lime: "#C8FF00", limeDim: "#96BF00",
  white: "#EEF0F5", mid: "#6B7280", muted: "#3A3F50",
  red: "#FF4558", blue: "#00D4FF", purple: "#B06AFF",
  orange: "#FF6B35", green: "#00E676",
};
 
// ─── SHARED UI ────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&family=Nunito:wght@300;400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${T.bg};color:${T.white};font-family:'Nunito',sans-serif;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0a0b0e;} ::-webkit-scrollbar-thumb{background:#1e2130;border-radius:2px;}
  input,select,textarea{outline:none;font-family:'Nunito',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes ping{0%{transform:scale(1);opacity:.8}80%,100%{transform:scale(2.2);opacity:0}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes unlockPop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
`;
 
const Inp = ({ label, icon, error, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, color: T.mid, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, textTransform: "uppercase" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: .6 }}>{icon}</span>}
      <input {...p} style={{ width: "100%", background: T.card2, border: `1px solid ${error ? T.red : T.border}`, color: T.white, padding: `12px ${icon ? "14px 12px 40px" : "14px"}`, borderRadius: 8, fontSize: 14, transition: "border-color .2s", ...(p.style || {}) }}
        onFocus={e => e.target.style.borderColor = T.lime}
        onBlur={e => e.target.style.borderColor = error ? T.red : T.border} />
    </div>
    {error && <span style={{ fontSize: 11, color: T.red }}>{error}</span>}
  </div>
);
 
const Btn = ({ children, onClick, variant = "primary", loading, disabled, style = {} }) => {
  const v = {
    primary: { background: T.lime, color: T.bg, border: "none" },
    ghost: { background: "transparent", color: T.mid, border: `1px solid ${T.border}` },
    blue: { background: T.blue, color: T.bg, border: "none" },
    danger: { background: `${T.red}20`, color: T.red, border: `1px solid ${T.red}44` },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{ padding: "12px 24px", borderRadius: 8, cursor: disabled || loading ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: .5, transition: "all .2s", opacity: disabled ? .5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...v[variant], ...style }}>
      {loading ? <span style={{ width: 16, height: 16, border: `2px solid currentColor`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} /> : children}
    </button>
  );
};
 
const Badge = ({ children, color = T.lime }) => (
  <span style={{ background: `${color}18`, color, border: `1px solid ${color}30`, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, whiteSpace: "nowrap" }}>{children}</span>
);
 
const Avatar = ({ initials, size = 38, color = T.lime }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: size * .33, color, flexShrink: 0 }}>{initials}</div>
);
 
// ════════════════════════════════════════════════════════════
// LANDING — DUAL PORTAL SELECTOR
// ════════════════════════════════════════════════════════════
const LandingPortal = ({ onSelect }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Animated background grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}55 1px, transparent 1px), linear-gradient(90deg, ${T.border}55 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: .4 }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, ${T.lime}08 0%, transparent 70%)`, pointerEvents: "none" }} />
 
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "fadeUp .7s ease forwards" }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 48, fontWeight: 800, letterSpacing: 4, marginBottom: 8 }}>
          GYM<span style={{ color: T.lime }}>FLOW</span>
        </div>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 4, color: T.mid, textTransform: "uppercase", marginBottom: 56 }}>
          Choose Your Portal
        </div>
 
        {/* Portal cards */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { type: "business", icon: "🏢", label: "Business Portal", sub: "Gym Owners & Trainers", desc: "Manage your locations, schedules, members, and unlock gym doors remotely.", color: T.lime, badge: "OWNER / TRAINER" },
            { type: "customer", icon: "👤", label: "Member Portal", sub: "Gym Members", desc: "Book classes, choose your location, view schedule, and unlock the gym when you arrive.", color: T.blue, badge: "MEMBER" },
          ].map(p => (
            <div key={p.type} onClick={() => onSelect(p.type)}
              onMouseEnter={() => setHovered(p.type)} onMouseLeave={() => setHovered(null)}
              style={{ width: 300, background: T.card, border: `1.5px solid ${hovered === p.type ? p.color : T.border}`, borderRadius: 16, padding: 32, cursor: "pointer", textAlign: "left", transition: "all .25s", transform: hovered === p.type ? "translateY(-6px)" : "none", boxShadow: hovered === p.type ? `0 20px 40px ${p.color}15` : "none", position: "relative", overflow: "hidden" }}>
              {/* Top glow */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: hovered === p.type ? p.color : T.border, transition: "background .25s" }} />
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
              <Badge color={p.color}>{p.badge}</Badge>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.white, marginTop: 12, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: p.color, marginBottom: 12, fontWeight: 600 }}>{p.sub}</div>
              <div style={{ fontSize: 13, color: T.mid, lineHeight: 1.6 }}>{p.desc}</div>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, color: p.color, fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700 }}>
                Sign In <span style={{ fontSize: 18, transition: "transform .2s", transform: hovered === p.type ? "translateX(4px)" : "none", display: "inline-block" }}>→</span>
              </div>
            </div>
          ))}
        </div>
 
        <div style={{ marginTop: 40, fontSize: 12, color: T.muted }}>
          New to GymFlow? <span onClick={() => onSelect("signup")} style={{ color: T.lime, cursor: "pointer", fontWeight: 600 }}>Create an account</span>
        </div>
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// BUSINESS LOGIN
// ════════════════════════════════════════════════════════════
const BusinessLogin = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
 
  const handle = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const user = BUSINESS_USERS.find(u => u.email === form.email && u.password === form.password);
    setLoading(false);
    if (user) onLogin(user);
    else setError("Invalid email or password. Try owner@gymflow.sg / gym123");
  };
 
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", animation: "fadeUp .5s ease" }}>
      <style>{css}</style>
      {/* Left panel */}
      <div style={{ width: "45%", background: `linear-gradient(135deg, #0A1A0A 0%, #060E06 100%)`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", borderRight: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, background: `radial-gradient(circle, ${T.lime}10 0%, transparent 70%)` }} />
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.mid, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif", marginBottom: 48, display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}>
          ← Back to portal
        </button>
        <Badge color={T.lime}>BUSINESS PORTAL</Badge>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 38, color: T.white, lineHeight: 1.15, marginTop: 16, marginBottom: 12 }}>
          Manage Your<br /><span style={{ color: T.lime }}>Gym Empire</span>
        </div>
        <div style={{ fontSize: 14, color: T.mid, lineHeight: 1.7, marginBottom: 40 }}>
          Full control over all your locations, time slots, member bookings, and smart door access — from one dashboard.
        </div>
        {/* Features list */}
        {[
          { icon: "📍", text: "Manage multiple gym locations" },
          { icon: "🕐", text: "Set & edit booking time slots" },
          { icon: "🔓", text: "Remote door unlock controls" },
          { icon: "👥", text: "View all member bookings live" },
          { icon: "💳", text: "Track payments & revenue" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, animation: `fadeUp .5s ease ${.1 + i * .08}s both` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.lime}15`, border: `1px solid ${T.lime}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{f.icon}</div>
            <span style={{ fontSize: 13, color: T.mid }}>{f.text}</span>
          </div>
        ))}
      </div>
 
      {/* Right panel - form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: T.white, marginBottom: 6 }}>Welcome back 👋</div>
          <div style={{ fontSize: 13, color: T.mid, marginBottom: 36 }}>Sign in to your business account</div>
 
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Inp label="Business Email" icon="✉️" type="email" placeholder="owner@mygym.sg" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <div>
              <Inp label="Password" icon="🔑" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <div onClick={() => setShowPass(p => !p)} style={{ fontSize: 11, color: T.mid, marginTop: 6, cursor: "pointer", textAlign: "right" }}>{showPass ? "Hide" : "Show"} password</div>
            </div>
 
            {error && (
              <div style={{ background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.red }}>{error}</div>
            )}
 
            <Btn variant="primary" onClick={handle} loading={loading} style={{ width: "100%", padding: "14px" }}>
              Sign In to Business Portal →
            </Btn>
 
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono',monospace" }}>DEMO</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>
 
            <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: T.mid, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>DEMO CREDENTIALS</div>
              <div style={{ fontSize: 12, color: T.mid }}>Gym Owner: <span style={{ color: T.lime, fontFamily: "'JetBrains Mono',monospace" }}>owner@gymflow.sg / gym123</span></div>
              <div style={{ fontSize: 12, color: T.mid, marginTop: 4 }}>Trainer: <span style={{ color: T.blue, fontFamily: "'JetBrains Mono',monospace" }}>trainer@gymflow.sg / train123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// CUSTOMER LOGIN
// ════════════════════════════════════════════════════════════
const CustomerLogin = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("email");
 
  const handle = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const user = CUSTOMER_USERS.find(u => u.email === form.email && u.password === form.password);
    setLoading(false);
    if (user) onLogin(user);
    else setError("Invalid credentials. Try marcus@email.com / pass123");
  };
 
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeUp .5s ease" }}>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.mid, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to portal
        </button>
 
        {/* Logo + header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${T.blue}20`, border: `2px solid ${T.blue}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>💪</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: T.white, marginBottom: 4 }}>Member Sign In</div>
          <div style={{ fontSize: 13, color: T.mid }}>Access your bookings, classes & gym unlock</div>
        </div>
 
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32 }}>
          {/* Login method tabs */}
          <div style={{ display: "flex", background: T.card2, borderRadius: 8, padding: 3, marginBottom: 24 }}>
            {[["email","✉️ Email"], ["phone","📱 Phone"]].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px", background: tab === t ? T.blue : "transparent", color: tab === t ? T.bg : T.mid, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, transition: "all .2s" }}>{l}</button>
            ))}
          </div>
 
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tab === "email" ? (
              <>
                <Inp label="Email Address" icon="✉️" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <Inp label="Password" icon="🔑" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </>
            ) : (
              <>
                <Inp label="Phone Number" icon="🇸🇬" placeholder="9123 4567" />
                <Inp label="OTP Code" icon="🔢" placeholder="Enter 6-digit code" />
                <Btn variant="ghost" style={{ fontSize: 11 }}>Send OTP →</Btn>
              </>
            )}
 
            {error && <div style={{ background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.red }}>{error}</div>}
 
            <Btn variant="blue" onClick={handle} loading={loading} style={{ width: "100%", padding: "14px" }}>
              Sign In →
            </Btn>
 
            <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, fontSize: 12 }}>
              <div style={{ color: T.mid, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>DEMO MEMBERS</div>
              <div style={{ color: T.mid }}>Marcus: <span style={{ color: T.blue, fontFamily: "'JetBrains Mono',monospace" }}>marcus@email.com / pass123</span></div>
              <div style={{ color: T.mid, marginTop: 3 }}>Priya: <span style={{ color: T.blue, fontFamily: "'JetBrains Mono',monospace" }}>priya@email.com / pass123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// SMART DOOR UNLOCK COMPONENT
// ════════════════════════════════════════════════════════════
const DoorUnlock = ({ location, onClose }) => {
  const [phase, setPhase] = useState("idle"); // idle | locating | verifying | unlocked | error
  const [userPos, setUserPos] = useState(null);
  const [distance, setDistance] = useState(null);
  const MAX_DIST = 150; // meters
 
  const calcDist = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };
 
  const unlock = () => {
    setPhase("locating");
    if (!navigator.geolocation) {
      // Simulate for demo
      setTimeout(() => {
        setPhase("verifying");
        setTimeout(() => { setDistance(42); setPhase("unlocked"); }, 1500);
      }, 1000);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos(pos.coords);
        setPhase("verifying");
        const dist = calcDist(pos.coords.latitude, pos.coords.longitude, location.lat, location.lng);
        setDistance(Math.round(dist));
        setTimeout(() => {
          setPhase(dist <= MAX_DIST ? "unlocked" : "error");
        }, 1500);
      },
      () => {
        // Demo fallback - simulate being nearby
        setPhase("verifying");
        setTimeout(() => { setDistance(38); setPhase("unlocked"); }, 1500);
      }
    );
  };
 
  const colors = { idle: T.lime, locating: T.orange, verifying: T.blue, unlocked: T.green, error: T.red };
  const phaseColor = colors[phase] || T.lime;
 
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(8px)", padding: 20 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 40, width: "100%", maxWidth: 400, position: "relative", animation: "fadeUp .3s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: T.mid, cursor: "pointer", fontSize: 20 }}>✕</button>
 
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: phaseColor, textTransform: "uppercase", marginBottom: 8, transition: "color .3s" }}>
            {phase === "idle" ? "Smart Door Unlock" : phase === "locating" ? "Getting Location..." : phase === "verifying" ? "Verifying Position..." : phase === "unlocked" ? "Access Granted" : "Too Far Away"}
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.white }}>{location.name}</div>
          <div style={{ fontSize: 12, color: T.mid, marginTop: 4 }}>📍 {location.address}</div>
        </div>
 
        {/* Lock animation */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            {/* Ping ring */}
            {(phase === "locating" || phase === "verifying") && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${phaseColor}`, animation: "ping 1.2s ease-out infinite", opacity: .6 }} />
            )}
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: phase === "unlocked" ? `${T.green}25` : phase === "error" ? `${T.red}20` : `${phaseColor}15`, border: `3px solid ${phaseColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, transition: "all .4s", animation: phase === "unlocked" ? "unlockPop .5s ease" : "none" }}>
              {phase === "unlocked" ? "🔓" : phase === "error" ? "🚫" : phase === "locating" || phase === "verifying" ? "📡" : "🔒"}
            </div>
          </div>
 
          {/* Distance meter */}
          {distance !== null && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 600, color: phaseColor }}>{distance}m</div>
              <div style={{ fontSize: 11, color: T.mid }}>from gym entrance</div>
              {distance <= MAX_DIST && phase !== "error" && (
                <div style={{ fontSize: 11, color: T.green, marginTop: 4 }}>✓ Within range ({MAX_DIST}m required)</div>
              )}
              {phase === "error" && (
                <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>You need to be within {MAX_DIST}m</div>
              )}
            </div>
          )}
 
          {/* Status text */}
          {phase === "unlocked" && (
            <div style={{ background: `${T.green}12`, border: `1px solid ${T.green}30`, borderRadius: 10, padding: "12px 20px", textAlign: "center", animation: "fadeUp .4s ease" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.green, fontSize: 15, marginBottom: 4 }}>Door Unlocked! 🎉</div>
              <div style={{ fontSize: 12, color: T.mid }}>Access valid for 30 seconds. Pull the door handle.</div>
            </div>
          )}
 
          {phase === "error" && (
            <div style={{ background: `${T.red}10`, border: `1px solid ${T.red}25`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.red, fontSize: 14, marginBottom: 4 }}>Out of Range</div>
              <div style={{ fontSize: 12, color: T.mid }}>Please walk closer to the gym entrance and try again.</div>
            </div>
          )}
        </div>
 
        {/* Actions */}
        {phase === "idle" && (
          <Btn variant="primary" onClick={unlock} style={{ width: "100%", padding: "14px" }}>
            🔓 Unlock Gym Door
          </Btn>
        )}
        {(phase === "locating" || phase === "verifying") && (
          <div style={{ textAlign: "center", fontSize: 13, color: T.mid }}>
            {phase === "locating" ? "Detecting your location via GPS..." : "Checking you're at the right location..."}
          </div>
        )}
        {phase === "unlocked" && (
          <Btn variant="ghost" onClick={onClose} style={{ width: "100%" }}>Close</Btn>
        )}
        {phase === "error" && (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setPhase("idle")} style={{ flex: 1 }}>Try Again</Btn>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Close</Btn>
          </div>
        )}
 
        {/* Info */}
        <div style={{ marginTop: 16, padding: "10px 14px", background: T.card2, borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 14 }}>ℹ️</span>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>Uses GPS to verify you're at the gym entrance. Must have an active booking for today. Door auto-locks after 30 seconds.</div>
        </div>
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD — Location + Booking + Door Unlock
// ════════════════════════════════════════════════════════════
const CustomerDashboard = ({ user, onLogout }) => {
  const [tab, setTab] = useState("book");
  const [locations, setLocations] = useState(LOCATIONS);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([
    { id: "bk1", locId: "loc1", locName: "GymFlow Tanjong Pagar", slot: "06:30", date: "Today", status: "Confirmed" },
    { id: "bk2", locId: "loc3", locName: "GymFlow Tampines", slot: "19:00", date: "Tomorrow", status: "Confirmed" },
  ]);
  const [unlockLoc, setUnlockLoc] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [gettingLoc, setGettingLoc] = useState(false);
 
  const getNearby = () => {
    setGettingLoc(true);
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const calcDist = (lat1, lng1, lat2, lng2) => {
          const R = 6371000, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
          const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        };
        setLocations(prev => prev.map(l => ({ ...l, distance: Math.round(calcDist(pos.coords.latitude, pos.coords.longitude, l.lat, l.lng)) })).sort((a,b) => a.distance - b.distance));
        setGettingLoc(false);
      },
      () => {
        // Demo distances
        setLocations(prev => [
          { ...prev[0], distance: 420 },
          { ...prev[1], distance: 1200 },
          { ...prev[2], distance: 3800 },
          { ...prev[3], distance: 800 },
        ].sort((a,b) => a.distance - b.distance));
        setGettingLoc(false);
      }
    );
  };
 
  const confirmBooking = () => {
    if (!selectedLoc || !selectedSlot) return;
    const newB = { id: `bk${Date.now()}`, locId: selectedLoc.id, locName: selectedLoc.name, slot: selectedSlot, date: "Today", status: "Confirmed" };
    setBookings(p => [newB, ...p]);
    setBookingSuccess(true);
    setSelectedSlot(null);
    setTimeout(() => setBookingSuccess(false), 3000);
  };
 
  const tabs = [["book", "📍 Book a Class"], ["mybookings", "📋 My Bookings"], ["unlock", "🔓 Gym Access"]];
 
  return (
    <div style={{ minHeight: "100vh", background: T.bg, animation: "fadeUp .4s ease" }}>
      <style>{css}</style>
      {unlockLoc && <DoorUnlock location={unlockLoc} onClose={() => setUnlockLoc(null)} />}
 
      {/* Top nav */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>GYM<span style={{ color: T.lime }}>FLOW</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Badge color={T.blue}>{user.plan}</Badge>
          <Avatar initials={user.avatar} size={34} color={T.blue} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.white }}>{user.name}</div>
            <div style={{ fontSize: 10, color: T.mid }}>Member</div>
          </div>
          <Btn variant="ghost" onClick={onLogout} style={{ padding: "6px 14px", fontSize: 11 }}>Sign Out</Btn>
        </div>
      </div>
 
      {/* Tab nav */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 28px", display: "flex", gap: 0 }}>
        {tabs.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? T.blue : T.mid, borderBottom: tab === t ? `2px solid ${T.blue}` : "2px solid transparent", transition: "all .2s" }}>{l}</button>
        ))}
      </div>
 
      <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
 
        {/* ── BOOK A CLASS ─────────────────────── */}
        {tab === "book" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Location picker */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.white }}>Choose Location</div>
                <Btn variant="ghost" onClick={getNearby} loading={gettingLoc} style={{ padding: "7px 14px", fontSize: 11 }}>
                  📍 Sort by Distance
                </Btn>
              </div>
 
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {locations.map(loc => {
                  const pct = Math.round(loc.booked / loc.capacity * 100);
                  const isSelected = selectedLoc?.id === loc.id;
                  return (
                    <div key={loc.id} onClick={() => { setSelectedLoc(loc); setSelectedSlot(null); }}
                      style={{ background: T.card, border: `1.5px solid ${isSelected ? loc.color : T.border}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all .2s", boxShadow: isSelected ? `0 0 20px ${loc.color}15` : "none" }}>
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: loc.color, borderRadius: 2 }} />
                        <div style={{ paddingLeft: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                            <div>
                              <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>{loc.name}</div>
                              <div style={{ fontSize: 11, color: T.mid, marginTop: 2 }}>📍 {loc.address}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                              <Badge color={loc.open ? T.green : T.red}>{loc.open ? "OPEN" : "FULL"}</Badge>
                              {loc.distance && <span style={{ fontSize: 10, color: T.blue, fontFamily: "'JetBrains Mono',monospace" }}>{loc.distance < 1000 ? `${loc.distance}m` : `${(loc.distance/1000).toFixed(1)}km`}</span>}
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: T.mid }}>{loc.trainer}</span>
                            <span style={{ fontSize: 11, color: pct >= 100 ? T.red : loc.color, fontWeight: 700 }}>{loc.capacity - loc.booked} spots left</span>
                          </div>
                          <div style={{ height: 3, background: T.border, borderRadius: 2 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? T.red : loc.color, borderRadius: 2, transition: "width .5s" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* Time slot picker */}
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.white, marginBottom: 16 }}>
                {selectedLoc ? `Available Slots — ${selectedLoc.name.split(" ").slice(-2).join(" ")}` : "Select a location first"}
              </div>
 
              {!selectedLoc ? (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: T.mid }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📍</div>
                  <div>Pick a gym location on the left to see available time slots</div>
                </div>
              ) : (
                <>
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: T.mid, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Today's Slots</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {selectedLoc.slots.map(slot => {
                        const isBooked = bookings.some(b => b.locId === selectedLoc.id && b.slot === slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button key={slot} onClick={() => !isBooked && setSelectedSlot(slot)} disabled={isBooked || !selectedLoc.open}
                            style={{ padding: "10px 6px", background: isBooked ? T.card2 : isSelected ? selectedLoc.color : T.card2, border: `1px solid ${isBooked ? T.border : isSelected ? selectedLoc.color : T.border}`, borderRadius: 8, color: isBooked ? T.muted : isSelected ? T.bg : T.white, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: isSelected ? 700 : 400, cursor: isBooked ? "not-allowed" : "pointer", transition: "all .15s", textDecoration: isBooked ? "line-through" : "none", opacity: isBooked ? .5 : 1 }}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
 
                  {selectedSlot && (
                    <div style={{ background: `${selectedLoc.color}10`, border: `1.5px solid ${selectedLoc.color}40`, borderRadius: 12, padding: 20, animation: "fadeUp .3s ease" }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.white, marginBottom: 6 }}>Confirm Booking</div>
                      <div style={{ fontSize: 13, color: T.mid, marginBottom: 16 }}>
                        📍 {selectedLoc.name}<br />
                        🕐 Today at <strong style={{ color: T.white }}>{selectedSlot}</strong><br />
                        👨‍🏫 {selectedLoc.trainer}
                      </div>
                      {bookingSuccess ? (
                        <div style={{ textAlign: "center", padding: "10px", color: T.green, fontWeight: 700, fontSize: 14 }}>✅ Booking confirmed!</div>
                      ) : (
                        <Btn variant="primary" onClick={confirmBooking} style={{ width: "100%", background: selectedLoc.color }}>Confirm Booking →</Btn>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
 
        {/* ── MY BOOKINGS ───────────────────────── */}
        {tab === "mybookings" && (
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.white, marginBottom: 20 }}>My Bookings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookings.length === 0 ? (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: T.mid }}>No bookings yet. Book a class to get started!</div>
              ) : bookings.map(b => {
                const loc = LOCATIONS.find(l => l.id === b.locId) || LOCATIONS[0];
                return (
                  <div key={b.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 4, height: 56, background: loc.color, borderRadius: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>{b.locName}</div>
                      <div style={{ fontSize: 12, color: T.mid, marginTop: 3 }}>🕐 {b.date} at {b.slot}</div>
                    </div>
                    <Badge color={T.green}>{b.status}</Badge>
                    <Btn variant="primary" onClick={() => setUnlockLoc(loc)} style={{ padding: "8px 16px", fontSize: 12, background: loc.color }}>
                      🔓 Unlock Door
                    </Btn>
                    <button onClick={() => setBookings(p => p.filter(x => x.id !== b.id))} style={{ background: `${T.red}15`, border: `1px solid ${T.red}30`, color: T.red, borderRadius: 6, padding: "8px 12px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>Cancel</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
 
        {/* ── GYM ACCESS / DOOR UNLOCK ──────────── */}
        {tab === "unlock" && (
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: T.white, marginBottom: 8 }}>Gym Door Access</div>
            <div style={{ fontSize: 13, color: T.mid, marginBottom: 24 }}>Must be within 150m of the gym entrance with an active booking.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {locations.map(loc => {
                const hasBooking = bookings.some(b => b.locId === loc.id);
                return (
                  <div key={loc.id} style={{ background: T.card, border: `1.5px solid ${hasBooking ? loc.color + "60" : T.border}`, borderRadius: 14, padding: 24, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: loc.color }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>{loc.name}</div>
                        <div style={{ fontSize: 11, color: T.mid, marginTop: 3 }}>📍 {loc.address}</div>
                        <div style={{ fontSize: 11, color: T.mid, marginTop: 2 }}>👨‍🏫 {loc.trainer} · {loc.phone}</div>
                      </div>
                      <Badge color={hasBooking ? T.green : T.muted}>{hasBooking ? "BOOKED" : "NO BOOKING"}</Badge>
                    </div>
                    <Btn onClick={() => setUnlockLoc(loc)} variant={hasBooking ? "primary" : "ghost"}
                      style={{ width: "100%", background: hasBooking ? loc.color : "transparent", color: hasBooking ? T.bg : T.muted, fontSize: 13 }}>
                      {hasBooking ? "🔓 Unlock This Door" : "🔒 Book First to Unlock"}
                    </Btn>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// BUSINESS DASHBOARD — Location + Slots Manager
// ════════════════════════════════════════════════════════════
const BusinessDashboard = ({ user, onLogout }) => {
  const [tab, setTab] = useState("locations");
  const [locations, setLocations] = useState(LOCATIONS);
  const [editLoc, setEditLoc] = useState(null);
  const [unlockLoc, setUnlockLoc] = useState(null);
  const [newSlot, setNewSlot] = useState("");
  const [addingSlot, setAddingSlot] = useState(null);
 
  const toggleSlot = (locId, slot) => {
    setLocations(prev => prev.map(l => l.id !== locId ? l : {
      ...l, slots: l.slots.includes(slot) ? l.slots.filter(s => s !== slot) : [...l.slots, slot].sort()
    }));
  };
 
  const addSlotToLoc = (locId) => {
    if (!newSlot) return;
    setLocations(prev => prev.map(l => l.id !== locId ? l : {
      ...l, slots: [...new Set([...l.slots, newSlot])].sort()
    }));
    setNewSlot(""); setAddingSlot(null);
  };
 
  const allSlots = ["05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"];
 
  return (
    <div style={{ minHeight: "100vh", background: T.bg, animation: "fadeUp .4s ease" }}>
      <style>{css}</style>
      {unlockLoc && <DoorUnlock location={unlockLoc} onClose={() => setUnlockLoc(null)} />}
 
      {/* Top nav */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>GYM<span style={{ color: T.lime }}>FLOW</span></div>
          <Badge color={T.lime}>BUSINESS</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.white }}>{user.name}</div>
            <div style={{ fontSize: 10, color: T.lime }}>{user.role}</div>
          </div>
          <Avatar initials={user.avatar} size={34} color={T.lime} />
          <Btn variant="ghost" onClick={onLogout} style={{ padding: "6px 14px", fontSize: 11 }}>Sign Out</Btn>
        </div>
      </div>
 
      {/* Tabs */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 28px", display: "flex", gap: 0 }}>
        {[["locations","📍 Locations & Slots"], ["bookings","📋 Today's Bookings"], ["access","🔓 Door Access Control"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? T.lime : T.mid, borderBottom: tab === t ? `2px solid ${T.lime}` : "2px solid transparent", transition: "all .2s" }}>{l}</button>
        ))}
      </div>
 
      <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
 
        {/* ── LOCATIONS & TIME SLOTS ─────────── */}
        {tab === "locations" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.white }}>Gym Locations & Time Slots</div>
                <div style={{ fontSize: 13, color: T.mid, marginTop: 2 }}>Manage booking slots for each location</div>
              </div>
            </div>
 
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {locations.map(loc => (
                <div key={loc.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
                  {/* Location header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${T.border}`, background: T.card2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 4, height: 44, background: loc.color, borderRadius: 2 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>{loc.name}</div>
                        <div style={{ fontSize: 11, color: T.mid }}>📍 {loc.address} · 👨‍🏫 {loc.trainer} · {loc.phone}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: loc.booked >= loc.capacity ? T.red : loc.color }}>{loc.booked}/{loc.capacity}</div>
                        <div style={{ fontSize: 9, color: T.mid, textTransform: "uppercase", letterSpacing: 1 }}>booked</div>
                      </div>
                      <Badge color={loc.open ? T.green : T.red}>{loc.open ? "OPEN" : "FULL"}</Badge>
                      <button onClick={() => setLocations(prev => prev.map(l => l.id === loc.id ? {...l, open: !l.open} : l))}
                        style={{ padding: "7px 14px", background: loc.open ? `${T.red}15` : `${T.green}15`, border: `1px solid ${loc.open ? T.red : T.green}30`, color: loc.open ? T.red : T.green, borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
                        {loc.open ? "Close Location" : "Open Location"}
                      </button>
                    </div>
                  </div>
 
                  {/* Time slots */}
                  <div style={{ padding: "16px 22px" }}>
                    <div style={{ fontSize: 11, color: T.mid, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                      Booking Time Slots ({loc.slots.length} active)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {allSlots.map(slot => {
                        const isActive = loc.slots.includes(slot);
                        return (
                          <button key={slot} onClick={() => toggleSlot(loc.id, slot)}
                            style={{ padding: "7px 12px", background: isActive ? `${loc.color}20` : T.card2, border: `1px solid ${isActive ? loc.color : T.border}`, color: isActive ? loc.color : T.muted, borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: isActive ? 700 : 400, transition: "all .15s" }}>
                            {slot}
                          </button>
                        );
                      })}
                      {addingSlot === loc.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <input type="time" value={newSlot} onChange={e => setNewSlot(e.target.value)}
                            style={{ background: T.card2, border: `1px solid ${loc.color}`, color: T.white, padding: "6px 10px", borderRadius: 6, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", outline: "none" }} />
                          <button onClick={() => addSlotToLoc(loc.id)} style={{ background: loc.color, color: T.bg, border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Add</button>
                          <button onClick={() => setAddingSlot(null)} style={{ background: T.card2, color: T.mid, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddingSlot(loc.id)} style={{ padding: "7px 12px", background: "transparent", border: `1px dashed ${T.muted}`, color: T.mid, borderRadius: 6, cursor: "pointer", fontSize: 11 }}>+ Custom</button>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted }}>Click any slot to toggle it on/off. Green = available for booking.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* ── TODAY'S BOOKINGS ──────────────────── */}
        {tab === "bookings" && (
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.white, marginBottom: 20 }}>Today's Bookings</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {locations.map(loc => (
                <div key={loc.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: T.card2, padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 14 }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: T.mid }}>{loc.trainer}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: loc.color }}>{loc.booked}<span style={{ fontSize: 13, color: T.mid }}>/{loc.capacity}</span></div>
                  </div>
                  <div style={{ padding: "12px 18px" }}>
                    <div style={{ height: 4, background: T.border, borderRadius: 2, marginBottom: 12 }}>
                      <div style={{ height: "100%", width: `${(loc.booked/loc.capacity)*100}%`, background: loc.color, borderRadius: 2 }} />
                    </div>
                    {loc.slots.slice(0, 4).map(slot => (
                      <div key={slot} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.white }}>{slot}</span>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: T.mid }}>{Math.floor(Math.random()*5+1)}/{loc.capacity} booked</span>
                          <Badge color={loc.color}>Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* ── DOOR ACCESS CONTROL ──────────────── */}
        {tab === "access" && (
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: T.white, marginBottom: 8 }}>Door Access Control</div>
            <div style={{ fontSize: 13, color: T.mid, marginBottom: 24 }}>Remotely unlock or lock any gym location. Members unlock via their own app using GPS verification.</div>
 
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {locations.map(loc => (
                <div key={loc.id} style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: 24, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: loc.color }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 3 }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: T.mid }}>📍 {loc.address}</div>
                      <div style={{ fontSize: 11, color: T.mid, marginTop: 2 }}>📞 {loc.phone}</div>
                    </div>
                    <Badge color={loc.open ? T.green : T.red}>{loc.open ? "ONLINE" : "CLOSED"}</Badge>
                  </div>
 
                  <div style={{ background: T.card2, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: T.mid, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>DOOR STATUS</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.red, boxShadow: `0 0 8px ${T.red}`, animation: "pulse 2s infinite" }} />
                      <span style={{ color: T.white, fontWeight: 600, fontSize: 13 }}>Locked</span>
                      <span style={{ fontSize: 11, color: T.mid, marginLeft: "auto" }}>Auto-locks after 30s</span>
                    </div>
                  </div>
 
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn onClick={() => setUnlockLoc(loc)} variant="primary" style={{ flex: 1, background: loc.color, fontSize: 13 }}>
                      🔓 Remote Unlock
                    </Btn>
                    <Btn variant="ghost" style={{ padding: "10px 14px", fontSize: 12 }}>
                      📋 Access Log
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Info panel */}
            <div style={{ marginTop: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.white, fontSize: 15, marginBottom: 12 }}>How Smart Door Unlock Works</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[
                  { step: "1", icon: "📋", title: "Member Books", desc: "Member books a time slot via the app" },
                  { step: "2", icon: "📍", title: "GPS Verify", desc: "App detects member is within 150m of gym" },
                  { step: "3", icon: "🔓", title: "Unlock Sent", desc: "Unlock signal sent to smart lock hardware" },
                  { step: "4", icon: "⏱️", title: "Auto-Lock", desc: "Door auto-locks after 30 seconds" },
                ].map(s => (
                  <div key={s.step} style={{ textAlign: "center", padding: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${T.lime}15`, border: `1px solid ${T.lime}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 10px" }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, color: T.white, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: T.mid }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "10px 16px", background: T.card2, borderRadius: 8, fontSize: 12, color: T.mid }}>
                <strong style={{ color: T.lime }}>Hardware required:</strong> Compatible smart locks — Yale Assure, Igloohome, or any Bluetooth/WiFi lock with API support. Contact us to set up smart lock integration for your gym.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// ════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | business-login | customer-login | business-dash | customer-dash
  const [user, setUser] = useState(null);
 
  if (screen === "landing") return <LandingPortal onSelect={s => setScreen(s === "business" ? "business-login" : "customer-login")} />;
  if (screen === "business-login") return <BusinessLogin onBack={() => setScreen("landing")} onLogin={u => { setUser(u); setScreen("business-dash"); }} />;
  if (screen === "customer-login") return <CustomerLogin onBack={() => setScreen("landing")} onLogin={u => { setUser(u); setScreen("customer-dash"); }} />;
  if (screen === "business-dash") return <BusinessDashboard user={user} onLogout={() => { setUser(null); setScreen("landing"); }} />;
  if (screen === "customer-dash") return <CustomerDashboard user={user} onLogout={() => { setUser(null); setScreen("landing"); }} />;
  return null;
}
 
