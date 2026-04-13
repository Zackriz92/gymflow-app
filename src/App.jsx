export default function App() {
  return (
    <div style={{minHeight:"100vh",background:"#080808",display:"flex",
    flexDirection:"column",alignItems:"center",justifyContent:"center",
    fontFamily:"sans-serif",color:"#F0F0EB",textAlign:"center",padding:24}}>
      <div style={{fontSize:72,fontWeight:900,letterSpacing:4,marginBottom:8}}>
        GYM<span style={{color:"#C8FF00"}}>FLOW</span>
      </div>
      <div style={{fontSize:13,letterSpacing:4,color:"#555",
      textTransform:"uppercase",marginBottom:48}}>
        Gym Management · Singapore & SEA
      </div>
      <div style={{background:"#111",border:"1px solid #222",
      borderRadius:16,padding:"40px 32px",maxWidth:480}}>
        <div style={{fontSize:40,marginBottom:16}}>🔧</div>
        <div style={{fontSize:26,fontWeight:800,marginBottom:12}}>
          Under Maintenance
        </div>
        <div style={{fontSize:15,color:"#666",lineHeight:1.8}}>
          We're making improvements.<br/>
          Back shortly — better than ever.
        </div>
      </div>
    </div>
  );
}
