import { useState, useEffect } from "react";

export default function App() {
   const [dots, setDots] = useState("");

  useEffect(() => {
       const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 600);
       return () => clearInterval(t);
  }, []);

  return (
       <div style={{ minHeight:"100vh", background:"#080808", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", color:"#F0F0EB", padding:24, position:"relative", overflow:"hidden" }}>

        {/* Background grid */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(#1e1e1e55 1px,transparent 1px),linear-gradient(90deg,#1e1e1e55 1px,transparent 1px)", backgroundSize:"60px 60px", opacity:.4 }} />

        {/* Glow */}
              <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(circle,#C8FF0012 0%,transparent 70%)", pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:560 }}>

               {/* Logo */}
                       <div style={{ fontFamily:"'Segoe UI Black','Arial Black',sans-serif", fontSize:"clamp(52px,10vw,88px)", fontWeight:900, letterSpacing:4, marginBottom:8 }}>
                                  GYM<span style={{ color:"#C8FF00" }}>FLOW</span>span>
                       </div>div>

               {/* Tagline */}
                       <div style={{ fontSize:13, letterSpacing:4, color:"#555", textTransform:"uppercase", marginBottom:56 }}>
                                  Gym Management · Singapore & SEA
                       </div>div>

               {/* Main message */}
                       <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:16, padding:"40px 32px", marginBottom:32 }}>
                                  <div style={{ fontSize:40, marginBottom:16 }}>🔧</div>div>
                                  <div style={{ fontFamily:"'Segoe UI Black','Arial Black',sans-serif", fontSize:"clamp(22px,4vw,30px)", fontWeight:900, color:"#F0F0EB", marginBottom:12 }}>
                                               We're Making Improvements
                                  </div>div>
                                  <div style={{ fontSize:15, color:"#666", lineHeight:1.8, marginBottom:28 }}>
                                               GymFlow is currently being updated with new features.<br />
                                               We'll be back shortly — better than ever.
                                  </div>div>

                        {/* Animated loading bar */}
                                  <div style={{ height:4, background:"#1e1e1e", borderRadius:2, overflow:"hidden", marginBottom:20 }}>
                                               <div style={{ height:"100%", width:"65%", background:"linear-gradient(90deg,#C8FF00,#96BF00)", borderRadius:2, animation:"progress 2s ease-in-out infinite alternate" }} />
                                  </div>div>

                                  <div style={{ fontSize:13, color:"#444", fontFamily:"monospace", letterSpacing:2 }}>
                                               LOADING UPDATES{dots}
                                  </div>div>
                       </div>div>

               {/* Contact */}
                       <div style={{ fontSize:13, color:"#444" }}>
                                  Questions? Reach us at{" "}
                                  <span style={{ color:"#C8FF00", cursor:"pointer" }}>hello@gymflow.sg</span>span>
                       </div>div>

               {/* Bottom badges */}
                       <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:32, flexWrap:"wrap" }}>
                        {["🇸🇬 Singapore","🇲🇾 Malaysia","🇵🇭 Philippines"].map(b => (
                    <div key={b} style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:20, padding:"6px 16px", fontSize:12, color:"#555" }}>{b}</div>div>
                  ))}
                       </div>div>
              </div>div>

              <style>{`
                      @keyframes progress {
                                from { width: 20%; }
                                          to { width: 85%; }
                                                  }
                                                        `}</style>style>
       </div>div>
     );
}</style>
