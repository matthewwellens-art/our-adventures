import { useState, useRef, useEffect, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TRIPS = [
  { id: "kauai",           name: "Kauai",              emoji: "🌺", dates: "February 2024",  sortOrder: 202402, butters: false, coords: [-159.5, 22.1], color: "#f4845f", photos: ["https://i.imgur.com/K7l8mVn.jpeg","https://i.imgur.com/apDKJ47.jpeg","https://i.imgur.com/zW7aJM9.jpeg","https://i.imgur.com/HAgC6cB.jpeg"] },
  { id: "capecod",         name: "Cape Cod",            emoji: "🦀", dates: "May 2024",        sortOrder: 202405, butters: true,  coords: [-70.3, 41.7],  color: "#5ba4cf", photos: ["https://i.imgur.com/LQVDQPl.jpeg","https://i.imgur.com/hLIvVRf.jpeg","https://i.imgur.com/qfVPOD9.jpeg"] },
  { id: "sandiego",        name: "San Diego",           emoji: "🌊", dates: "June 2024",       sortOrder: 202406, butters: true,  coords: [-117.1, 32.7], color: "#5ba4cf", photos: ["https://i.imgur.com/LSYvuO3.jpeg","https://i.imgur.com/xDbfOtG.jpeg","https://i.imgur.com/uVlDfKk.jpeg"] },
  { id: "oregon",          name: "Oregon",              emoji: "🌲", dates: "June 2024",       sortOrder: 202406, butters: false, coords: [-120.5, 44.0], color: "#57a773", photos: ["https://i.imgur.com/OjYJuFS.jpeg","https://i.imgur.com/8kabrEW.jpeg","https://i.imgur.com/u5p5d3F.jpeg","https://i.imgur.com/YEXvsU5.jpeg","https://i.imgur.com/bN2LdNr.jpeg","https://i.imgur.com/SLWv1wK.jpeg","https://i.imgur.com/IThea6L.jpeg"] },
  { id: "phoenix-2024",    name: "Phoenix",             emoji: "🌵", dates: "June 2024",       sortOrder: 202406, butters: true,  coords: [-112.0, 33.4], color: "#e07b39", photos: ["https://i.imgur.com/LCGXNuc.jpeg","https://i.imgur.com/43s1NoO.jpeg","https://i.imgur.com/x2KDNFT.jpeg"] },
  { id: "austin",          name: "Austin",              emoji: "🤠", dates: "July 2024",       sortOrder: 202407, butters: true,  coords: [-97.7, 30.3],  color: "#b07cc6", photos: ["https://i.imgur.com/kMYkWAu.jpeg","https://i.imgur.com/uyfh2Jt.jpeg","https://i.imgur.com/v25q2ZY.jpeg","https://i.imgur.com/wFqcrOf.jpeg"] },
  { id: "cincinnati-2024-07", name: "Cincinnati",       emoji: "🏟️", dates: "July 2024",      sortOrder: 202407, butters: true,  coords: [-84.5, 39.1],  color: "#d64045", photos: ["https://i.imgur.com/s5Dp9fv.jpeg","https://i.imgur.com/1Spk4hw.jpeg"] },
  { id: "bayarea",         name: "Bay Area",            emoji: "🌉", dates: "August 2024",     sortOrder: 202408, butters: false, coords: [-122.4, 37.7], color: "#e2b04a", photos: ["https://i.imgur.com/exf5WhW.jpeg","https://i.imgur.com/no9bITP.jpeg","https://i.imgur.com/LsB01hb.jpeg"] },
  { id: "chicago",         name: "Chicago",             emoji: "🏙️", dates: "August 2024",    sortOrder: 202408, butters: false, coords: [-87.6, 41.8],  color: "#3aafa9", photos: ["https://i.imgur.com/ZTCFS6G.jpeg","https://i.imgur.com/H5ruBmM.jpeg","https://i.imgur.com/d5OC5x2.jpeg"] },
  { id: "nyc-2024",        name: "New York City",       emoji: "🗽", dates: "November 2024",  sortOrder: 202411, butters: false, coords: [-74.0, 40.7],  color: "#e8c547", photos: ["https://i.imgur.com/uRpXv0o.jpeg","https://i.imgur.com/2TBY18W.jpeg","https://i.imgur.com/E6NGODP.jpeg"] },
  { id: "cincinnati-2024-11", name: "Cincinnati",       emoji: "🏟️", dates: "November 2024",  sortOrder: 202411, butters: true,  coords: [-84.5, 39.1],  color: "#d64045", photos: ["https://i.imgur.com/TjEWsM1.jpeg","https://i.imgur.com/0fqeHIG.jpeg","https://i.imgur.com/uKDncoT.jpeg","https://i.imgur.com/ITtHORk.jpeg"] },
  { id: "parkcity",        name: "Park City",           emoji: "⛷️", dates: "December 2024",  sortOrder: 202412, butters: false, coords: [-111.5, 40.6],  color: "#7eb8d4", photos: ["https://i.imgur.com/feHKADL.jpeg","https://i.imgur.com/RSDT0lc.jpeg"] },
  { id: "assateague",      name: "Assateague Island",   emoji: "🐴", dates: "February 2025",  sortOrder: 202502, butters: true,  coords: [-75.2, 38.0],  color: "#e8a598", photos: ["https://i.imgur.com/FaQAQkC.jpeg","https://i.imgur.com/SgzofGg.jpeg","https://i.imgur.com/TbaYfzT.jpeg","https://i.imgur.com/CHyibR0.jpeg"] },
  { id: "marblehead",      name: "Marblehead, MA",      emoji: "⚓", dates: "June 2025",       sortOrder: 202506, butters: false, coords: [-70.8, 42.5],  color: "#5eabd4", photos: ["https://i.imgur.com/pVb3ZIZ.jpeg","https://i.imgur.com/x9oXtBG.jpeg"] },
  { id: "scotland",        name: "Scotland & Ireland",  emoji: "🏰", dates: "July 2025",       sortOrder: 202507, butters: false, coords: [-4.5, 55.0],   color: "#4c6fbf", photos: ["https://i.imgur.com/z8Xjt5I.jpeg","https://i.imgur.com/UhoqGU0.jpeg","https://i.imgur.com/SRWVO6h.jpeg","https://i.imgur.com/dANavdY.jpeg","https://i.imgur.com/ZgGgusi.jpeg","https://i.imgur.com/vCC8YtZ.jpeg","https://i.imgur.com/SdPmCaI.jpeg","https://i.imgur.com/5Bz63Ip.jpeg","https://i.imgur.com/QJsVVRY.jpeg","https://i.imgur.com/DNP1HMm.jpeg","https://i.imgur.com/7jFJ1ox.jpeg"] },
  { id: "harpersferry",    name: "Harpers Ferry",       emoji: "🏞️", dates: "August 2025",    sortOrder: 202508, butters: true,  coords: [-77.7, 39.3],  color: "#8fb339", photos: ["https://i.imgur.com/wGWYaWL.jpeg","https://i.imgur.com/9PWtQGT.jpeg","https://i.imgur.com/WyPXTl7.jpeg"] },
  { id: "cincinnati-2025", name: "Cincinnati",          emoji: "🏟️", dates: "August 2025",    sortOrder: 202508, butters: true,  coords: [-84.5, 39.1],  color: "#d64045", photos: ["https://i.imgur.com/6RSvTo4.jpeg","https://i.imgur.com/EtVxzYx.jpeg","https://i.imgur.com/Ulq7Uh5.jpeg"] },
  { id: "maine",           name: "Maine",               emoji: "🦞", dates: "October 2025",   sortOrder: 202510, butters: true,  coords: [-69.0, 45.2],  color: "#c1440e", photos: ["https://i.imgur.com/Mo4yNli.jpeg","https://i.imgur.com/Tt9ou5j.jpeg","https://i.imgur.com/fIRbLMW.jpeg","https://i.imgur.com/rf1J5gz.jpeg","https://i.imgur.com/BBA7ZOp.jpeg","https://i.imgur.com/ht6rZrn.jpeg","https://i.imgur.com/lnMwxcR.jpeg","https://i.imgur.com/MN669mD.jpeg","https://i.imgur.com/ssbFQLE.jpeg","https://i.imgur.com/V20VYgo.jpeg","https://i.imgur.com/x9W0KyK.jpeg"] },
  { id: "nyc",             name: "New York City",       emoji: "🗽", dates: "October 2025",   sortOrder: 202510, butters: false, coords: [-74.0, 40.7],  color: "#e8c547", photos: ["https://i.imgur.com/GsBHhMC.jpeg","https://i.imgur.com/YEf3sI6.jpeg","https://i.imgur.com/d1gKXqp.jpeg"] },
  { id: "berkeleysprings", name: "Berkeley Springs",    emoji: "♨️", dates: "November 2025",  sortOrder: 202511, butters: true,  coords: [-79.0, 40.2],  color: "#5eabd4", photos: ["https://i.imgur.com/uRTHij5.jpeg","https://i.imgur.com/cg9CtDa.jpeg","https://i.imgur.com/xnZKg98.jpeg"] },
  { id: "cincinnati-2025-11", name: "Cincinnati",       emoji: "🏟️", dates: "November 2025",  sortOrder: 202511, butters: false, coords: [-84.5, 39.1],  color: "#d64045", photos: ["https://i.imgur.com/LWvkEOY.jpeg"] },
  { id: "jordan",          name: "Jordan",              emoji: "🕌", dates: "November 2025",  sortOrder: 202511, butters: false, coords: [35.9, 31.9],   color: "#c8924a", photos: ["https://i.imgur.com/8LVDsP1.jpeg","https://i.imgur.com/MB5wrgh.jpeg","https://i.imgur.com/bXupcME.jpeg","https://i.imgur.com/NWVaRRv.jpeg","https://i.imgur.com/9S9By4C.jpeg","https://i.imgur.com/k7Cle79.jpeg","https://i.imgur.com/qdM2dDl.jpeg"] },
  { id: "bangalore",       name: "Bangalore, India",    emoji: "🪷", dates: "November 2025",  sortOrder: 202511, butters: false, coords: [77.6, 12.9],   color: "#c2557a", photos: ["https://i.imgur.com/962RcTt.jpeg","https://i.imgur.com/V2hBtuj.jpeg","https://i.imgur.com/G6KEkgb.jpeg","https://i.imgur.com/l4XcLKO.jpeg"] },
  { id: "phoenix-2025",    name: "Phoenix",             emoji: "🌵", dates: "December 2025",  sortOrder: 202512, butters: false, coords: [-112.0, 33.4], color: "#e07b39", photos: ["https://i.imgur.com/LLYMBbU.jpeg","https://i.imgur.com/bw6bfg4.jpeg","https://i.imgur.com/FMVZ3uY.jpeg"] },
  { id: "moorestown",      name: "Moorestown, NJ",      emoji: "🎄", dates: "December 2025",  sortOrder: 202512, butters: false, coords: [-74.9, 39.9],  color: "#7ab87a", photos: ["https://i.imgur.com/Cy8Mus7.jpeg","https://i.imgur.com/Neztmdk.jpeg","https://i.imgur.com/2aOckNl.jpeg","https://i.imgur.com/HBHPZmn.jpeg"] },
  { id: "cincinnati-2026", name: "Cincinnati",          emoji: "🏟️", dates: "January 2026",  sortOrder: 202601, butters: false, coords: [-84.5, 39.1],  color: "#d64045", photos: ["https://i.imgur.com/djizLIj.jpeg"] },
];

const DESTINATIONS = Object.values(
  TRIPS.reduce((acc, t) => {
    const key = t.coords.toString();
    if (!acc[key]) acc[key] = { ...t, visits: [] };
    acc[key].visits.push(t);
    return acc;
  }, {})
).map(d => ({ ...d, visits: d.visits.sort((a, b) => a.sortOrder - b.sortOrder) }));

function distanceMiles([lng1, lat1], [lng2, lat2]) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const TOTAL_MILES = (() => {
  const sorted = [...TRIPS].sort((a, b) => a.sortOrder - b.sortOrder);
  let total = 0;
  for (let i = 1; i < sorted.length; i++) total += distanceMiles(sorted[i-1].coords, sorted[i].coords);
  return Math.round(total).toLocaleString();
})();

const TRIPS_BY_YEAR = [...TRIPS].sort((a,b) => a.sortOrder - b.sortOrder).reduce((acc, t) => {
  const year = String(t.sortOrder).slice(0,4);
  if (!acc[year]) acc[year] = [];
  acc[year].push(t);
  return acc;
}, {});

function PawPrints({ size = 22 }) {
  return (
    <svg width={size * 1.8} height={size} viewBox="0 0 36 20" fill="none">
      <ellipse cx="7"  cy="13"  rx="4" ry="5"   fill="#d4a843"/>
      <ellipse cx="3"  cy="8"   rx="2" ry="2.5" fill="#d4a843"/>
      <ellipse cx="7"  cy="6.5" rx="2" ry="2.5" fill="#d4a843"/>
      <ellipse cx="11" cy="8"   rx="2" ry="2.5" fill="#d4a843"/>
      <ellipse cx="24" cy="11"  rx="4" ry="5"   fill="#d4a843"/>
      <ellipse cx="20" cy="6"   rx="2" ry="2.5" fill="#d4a843"/>
      <ellipse cx="24" cy="4.5" rx="2" ry="2.5" fill="#d4a843"/>
      <ellipse cx="28" cy="6"   rx="2" ry="2.5" fill="#d4a843"/>
    </svg>
  );
}

function useAutoScroll(ref, paused) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let animId, pos = 0;
    const speed = 0.5;
    const step = () => {
      if (!paused.current) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [ref, paused]);
}

const MIN_ZOOM = 1, MAX_ZOOM = 12;

export default function App() {
  const [selected,    setSelected]    = useState(null);
  const [visitIdx,    setVisitIdx]    = useState(0);
  const [photoIdx,    setPhotoIdx]    = useState(0);
  const [closing,     setClosing]     = useState(false);
  const [zoom,        setZoom]        = useState(1);
  const [center,      setCenter]      = useState([10, 10]);
  const [buttersOnly, setButtersOnly] = useState(false);
  const [hoveredPin,  setHoveredPin]  = useState(null);
  const filmRef      = useRef(null);
  const scrollPaused = useRef(false);
  const touchStartX  = useRef(null);

  useAutoScroll(filmRef, scrollPaused);

  const selectedDest = selected ? DESTINATIONS.find(d => d.coords.toString() === selected.coords.toString()) : null;
  const visits       = selectedDest?.visits ?? [];
  const isMultiVisit = visits.length > 1;

  const visibleTrips = buttersOnly ? TRIPS.filter(t => t.butters) : TRIPS;
  const visibleDests = buttersOnly
    ? Object.values(visibleTrips.reduce((acc, t) => {
        const key = t.coords.toString();
        if (!acc[key]) acc[key] = { ...t, visits: [] };
        acc[key].visits.push(t);
        return acc;
      }, {})).map(d => ({ ...d, visits: d.visits.sort((a,b) => a.sortOrder - b.sortOrder) }))
    : DESTINATIONS;

  const open = useCallback((trip) => {
    const dest = DESTINATIONS.find(d => d.coords.toString() === trip.coords.toString());
    const idx  = dest ? dest.visits.findIndex(v => v.id === trip.id) : 0;
    setSelected(trip);
    setVisitIdx(idx >= 0 ? idx : 0);
    setPhotoIdx(0);
    setClosing(false);
    scrollPaused.current = true;
  }, []);

  const selectVisit = (idx) => { setVisitIdx(idx); setPhotoIdx(0); setSelected(visits[idx]); };
  const close = () => { setClosing(true); setTimeout(() => { setSelected(null); setClosing(false); scrollPaused.current = false; }, 280); };

  const zoomIn    = () => setZoom(z => Math.min(z * 2, MAX_ZOOM));
  const zoomOut   = () => setZoom(z => Math.max(z / 2, MIN_ZOOM));
  const resetZoom = () => { setZoom(1); setCenter([10, 10]); };
  const pinScale  = 1 / Math.sqrt(zoom);

  const prevPhoto = () => setPhotoIdx(i => (i - 1 + selected.photos.length) % selected.photos.length);
  const nextPhoto = () => setPhotoIdx(i => (i + 1) % selected.photos.length);

  const chronological = [...visibleTrips].sort((a, b) => a.sortOrder - b.sortOrder);
  const looped = [...chronological, ...chronological];

  const visibleByYear = Object.entries(TRIPS_BY_YEAR).map(([year, trips]) => ({
    year,
    trips: buttersOnly ? trips.filter(t => t.butters) : trips,
  })).filter(({ trips }) => trips.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:"#18100a", color:"#f0e6d3", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        .pin-group { cursor:pointer; }
        .pin-circle { transform-box:fill-box; transform-origin:center center; transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .pin-group:hover .pin-circle, .pin-group.on .pin-circle { transform:scale(1.7); }

        .ring  { animation:ripple 3s ease-out infinite; }
        .ring2 { animation:ripple 3s ease-out 1.2s infinite; }
        @keyframes ripple { 0%{r:7;opacity:0.5} 100%{r:18;opacity:0} }

        .strip { display:flex; gap:10px; overflow:hidden; padding:14px 0 18px; user-select:none; }
        .card { flex-shrink:0; width:136px; border-radius:10px; overflow:hidden; cursor:pointer; transition:all 0.22s; border:1px solid rgba(240,230,211,0.07); background:rgba(255,255,255,0.03); }
        .card:hover { transform:translateY(-5px); background:rgba(255,255,255,0.07); border-color:rgba(240,230,211,0.2); }
        .card.on { transform:translateY(-5px); box-shadow:0 10px 28px rgba(0,0,0,0.5); }

        .zoom-btn { width:32px; height:32px; border-radius:8px; background:rgba(24,16,10,0.85); border:1px solid rgba(240,230,211,0.2); color:#f0e6d3; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.15s; backdrop-filter:blur(6px); }
        .zoom-btn:hover:not(:disabled) { background:rgba(200,169,110,0.25); border-color:rgba(200,169,110,0.5); }
        .zoom-btn:disabled { opacity:0.3; cursor:default; }

        .tab-btn { padding:5px 11px; border-radius:20px; border:1px solid rgba(240,230,211,0.15); background:rgba(255,255,255,0.04); color:rgba(240,230,211,0.5); font-family:'Jost',sans-serif; font-size:0.67rem; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
        .tab-btn:hover { background:rgba(255,255,255,0.1); color:#f0e6d3; }
        .tab-btn.active { background:rgba(200,169,110,0.18); border-color:rgba(200,169,110,0.5); color:#f0e6d3; }

        .butters-toggle { display:flex; align-items:center; gap:7px; padding:6px 14px; border-radius:20px; border:1px solid rgba(212,168,67,0.3); background:rgba(212,168,67,0.07); color:rgba(240,230,211,0.55); font-family:'Jost',sans-serif; font-size:0.7rem; cursor:pointer; transition:all 0.2s; }
        .butters-toggle:hover { background:rgba(212,168,67,0.14); color:#f0e6d3; }
        .butters-toggle.active { background:rgba(212,168,67,0.2); border-color:#d4a843; color:#d4a843; }

        .mbg { position:fixed; inset:0; background:rgba(12,7,3,0.88); backdrop-filter:blur(12px); z-index:300; display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:fi 0.22s ease; overflow-y:auto; }
        .mbg.out { animation:fo 0.28s ease forwards; }
        .mbox { width:100%; max-width:580px; background:#1f1208; border:1px solid rgba(240,230,211,0.1); border-radius:18px; overflow:hidden; box-shadow:0 32px 90px rgba(0,0,0,0.75); animation:mi 0.28s cubic-bezier(0.34,1.2,0.64,1); }
        .mbg.out .mbox { animation:mo 0.28s ease forwards; }

        @keyframes fi  { from{opacity:0} to{opacity:1} }
        @keyframes fo  { from{opacity:1} to{opacity:0} }
        @keyframes mi  { from{opacity:0;transform:translateY(22px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes mo  { from{opacity:1} to{opacity:0;transform:scale(0.95)} }

        .nbtn { position:absolute; top:50%; transform:translateY(-50%); width:36px; height:36px; border-radius:50%; background:rgba(18,10,4,0.72); border:1px solid rgba(255,255,255,0.18); color:#f0e6d3; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.15s; backdrop-filter:blur(4px); }
        .nbtn:hover { background:rgba(18,10,4,0.92); }
        .xbtn { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.13); color:rgba(240,230,211,0.6); font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
        .xbtn:hover { background:rgba(255,255,255,0.15); color:white; }

        .tl-card { display:flex; gap:12px; align-items:center; padding:8px 10px; border-radius:10px; cursor:pointer; transition:background 0.18s; }
        .tl-card:hover { background:rgba(255,255,255,0.05); }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign:"center", padding:"2.5rem 1rem 1.2rem" }}>
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.65rem", letterSpacing:"0.38em", textTransform:"uppercase", color:"rgba(240,230,211,0.38)", marginBottom:"0.5rem" }}>The adventures of</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,5vw,3.4rem)", fontWeight:600, fontStyle:"italic", color:"#f0e6d3", lineHeight:1.1, textShadow:"0 2px 30px rgba(212,158,67,0.22)" }}>
          Katie, Matt, and Butters
        </h1>
        <div style={{ width:50, height:1, background:"linear-gradient(90deg,transparent,rgba(212,158,67,0.55),transparent)", margin:"0.8rem auto" }} />
        <div style={{ display:"flex", gap:"1.2rem", justifyContent:"center", fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:"rgba(240,230,211,0.38)", flexWrap:"wrap", alignItems:"center" }}>
          <span>🧳 {TRIPS.length} trips</span>
          <span>📍 {DESTINATIONS.length} destinations</span>
          <span>✈️ 3 continents</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}><PawPrints size={12}/> {TRIPS.filter(t=>t.butters).length} Butters adventures</span>
        </div>
        <div style={{ marginTop:"0.9rem", display:"flex", justifyContent:"center" }}>
          <button className={`butters-toggle${buttersOnly ? " active" : ""}`} onClick={() => setButtersOnly(b => !b)}>
            <PawPrints size={13}/> {buttersOnly ? "Showing Butters trips" : "Butters only"}
          </button>
        </div>
      </div>

      {/* MAP */}
      <div style={{ position:"relative", margin:"0 1rem", borderRadius:14, overflow:"hidden", border:"1px solid rgba(240,230,211,0.07)", background:"#1a2535" }}>
        <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale:153, center:[0, -15] }} style={{ width:"100%", height:"auto", display:"block" }}>
          <ZoomableGroup zoom={zoom} center={center} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM}
            onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates); }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map(geo => (
                <Geography key={geo.rsmKey} geography={geo} style={{
                  default: { fill:"#2c3d2a", stroke:"#3d5438", strokeWidth:0.5, outline:"none" },
                  hover:   { fill:"#2c3d2a", stroke:"#3d5438", strokeWidth:0.5, outline:"none" },
                  pressed: { fill:"#2c3d2a", stroke:"#3d5438", strokeWidth:0.5, outline:"none" },
                }}/>
              ))}
            </Geographies>
            {visibleDests.map(dest => {
              const isOn       = dest.visits.some(v => v.id === selected?.id);
              const multiVisit = dest.visits.length > 1;
              return (
                <Marker key={dest.id} coordinates={dest.coords}>
                  <g
                    className={`pin-group${isOn ? " on" : ""}`}
                    onClick={() => { if (isOn) { close(); return; } open(dest.visits[dest.visits.length - 1]); }}
                    onMouseEnter={() => setHoveredPin(dest.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    transform={`scale(${pinScale}) translate(0, 5)`}
                    style={{ transformBox:"fill-box", transformOrigin:"center center" }}
                  >
                    <circle className="ring"  cx="0" cy="0" r="7" fill="none" stroke={dest.color} strokeWidth="1.5" opacity="0"/>
                    <circle className="ring2" cx="0" cy="0" r="7" fill="none" stroke={dest.color} strokeWidth="1.5" opacity="0"/>
                    <circle className="pin-circle" cx="0" cy="0" r="5"
                      fill={dest.color} stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"
                      style={{ filter:`drop-shadow(0 0 3px ${dest.color}bb)` }}
                    />
                    {multiVisit && (
                      <g>
                        <circle cx="5" cy="-5" r="4.5" fill="#18100a" stroke={dest.color} strokeWidth="1"/>
                        <text x="5" y="-2.5" textAnchor="middle" fill={dest.color} fontSize="5" fontFamily="Jost,sans-serif" fontWeight="700">{dest.visits.length}</text>
                      </g>
                    )}
                  </g>
                </Marker>
              );
            })}

            {/* TOOLTIP OVERLAY — rendered last so it's always on top */}
            {hoveredPin && (() => {
              const dest = visibleDests.find(d => d.id === hoveredPin);
              if (!dest) return null;
              const label = dest.name + (dest.visits.some(v=>v.butters) ? " 🐾" : "");
              const boxW = Math.max(90, label.length * 7.5);
              return (
                <Marker coordinates={dest.coords}>
                  <g transform={`scale(${pinScale}) translate(0, 5)`} style={{ pointerEvents:"none" }}>
                    <rect x={-boxW/2} y="-38" width={boxW} height="26" rx="5" fill="rgba(24,16,10,0.97)" stroke="rgba(240,230,211,0.28)" strokeWidth="0.8"/>
                    <text x="0" y="-21" textAnchor="middle" fill="#f0e6d3" fontSize="11" fontFamily="Jost, sans-serif" fontWeight="500">{label}</text>
                  </g>
                </Marker>
              );
            })()}
          </ZoomableGroup>
        </ComposableMap>
        <div style={{ position:"absolute", bottom:14, right:14, display:"flex", flexDirection:"column", gap:6, zIndex:10 }}>
          <button className="zoom-btn" onClick={zoomIn}   disabled={zoom >= MAX_ZOOM} title="Zoom in">+</button>
          <button className="zoom-btn" onClick={zoomOut}  disabled={zoom <= MIN_ZOOM} title="Zoom out">−</button>
          <button className="zoom-btn" onClick={resetZoom} title="Reset view" style={{ fontSize:13 }}>⌂</button>
        </div>
        {zoom > 1 && (
          <div style={{ position:"absolute", bottom:14, left:14, fontFamily:"'Jost',sans-serif", fontSize:"0.6rem", color:"rgba(240,230,211,0.35)", letterSpacing:"0.08em", zIndex:10 }}>
            Drag to pan · Scroll to zoom
          </div>
        )}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, transparent 50%, rgba(24,16,10,0.55) 100%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(24,16,10,0.2) 0%,transparent 20%,transparent 80%,rgba(24,16,10,0.3) 100%)", pointerEvents:"none" }}/>
      </div>

      {/* FILMSTRIP */}
      <div style={{ position:"relative", marginTop:"0.75rem" }}
        onMouseEnter={() => { scrollPaused.current = true; }}
        onMouseLeave={() => { if (!selected) scrollPaused.current = false; }}
        onTouchStart={() => { scrollPaused.current = true; }}
        onTouchEnd={() => { if (!selected) setTimeout(() => { scrollPaused.current = false; }, 1500); }}
      >
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:40, background:"linear-gradient(90deg,#18100a,transparent)", zIndex:5, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:40, background:"linear-gradient(270deg,#18100a,transparent)", zIndex:5, pointerEvents:"none" }}/>
        <div className="strip" ref={filmRef}>
          {looped.map((t, i) => {
            const on = selected?.id === t.id;
            return (
              <div key={`${t.id}-${i}`} className={`card${on?" on":""}`}
                style={{ borderColor: on ? t.color : undefined, boxShadow: on ? `0 0 16px ${t.color}44` : undefined }}
                onClick={() => on ? close() : open(t)}
              >
                <div style={{ width:"100%", height:80, overflow:"hidden", background:"#0e0804" }}>
                  <img src={t.photos[0]} alt={t.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity: on ? 1 : 0.78, transition:"opacity 0.2s" }}/>
                </div>
                <div style={{ height:3, background:t.color, opacity: on?1:0.45, transition:"opacity 0.2s" }}/>
                <div style={{ padding:"8px 10px 10px" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.82rem", fontWeight:600, color:"#f0e6d3", lineHeight:1.25, marginBottom:3 }}>{t.emoji} {t.name}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.62rem", color:"rgba(240,230,211,0.38)", marginBottom: t.butters?5:0 }}>{t.dates}</div>
                  {t.butters && <PawPrints size={13}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ margin:"1.5rem 1rem 0", borderTop:"1px solid rgba(240,230,211,0.07)", paddingTop:"1.5rem" }}>
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.62rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(240,230,211,0.25)", marginBottom:"1.4rem", textAlign:"center" }}>Journey so far</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>
          {visibleByYear.map(({ year, trips: yearTrips }) => (
            <div key={year}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"0.5rem" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.3rem", fontWeight:600, color:"rgba(240,230,211,0.28)" }}>{year}</div>
                <div style={{ flex:1, height:1, background:"rgba(240,230,211,0.07)" }}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {yearTrips.map(t => (
                  <div key={t.id} className="tl-card" onClick={() => selected?.id === t.id ? close() : open(t)}>
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <img src={t.photos[0]} alt={t.name} style={{ width:56, height:56, borderRadius:8, objectFit:"cover", display:"block" }}/>
                      <div style={{ position:"absolute", inset:0, borderRadius:8, border:`2px solid ${t.color}`, opacity: selected?.id === t.id ? 1 : 0.35 }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1rem", fontWeight:600, color:"#f0e6d3", lineHeight:1.2 }}>{t.emoji} {t.name}</div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.63rem", color:"rgba(240,230,211,0.35)", marginTop:2 }}>{t.dates}</div>
                      {t.butters && <div style={{ marginTop:4 }}><PawPrints size={11}/></div>}
                    </div>
                    <div style={{ width:3, borderRadius:2, alignSelf:"stretch", background:t.color, opacity:0.5, flexShrink:0 }}/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign:"center", padding:"2rem 1rem 1.5rem", fontFamily:"'Jost',sans-serif", fontSize:"0.6rem", letterSpacing:"0.12em", color:"rgba(240,230,211,0.18)", textTransform:"uppercase" }}>
        Made with love · Click any pin or card to explore
      </div>

      {/* MODAL */}
      {selected && (
        <div className={`mbg${closing?" out":""}`} onClick={e => e.target===e.currentTarget && close()}>
          <div className="mbox">
            <div style={{ padding:"1.1rem 1.4rem 0.9rem", borderBottom:"1px solid rgba(240,230,211,0.08)", background:`linear-gradient(135deg,${selected.color}18,transparent)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: isMultiVisit ? "0.7rem" : 0 }}>
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.75rem", fontWeight:600, color:selected.color, lineHeight:1, marginBottom:4 }}>
                    {selected.emoji} {selected.name}
                  </h2>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.73rem", color:"rgba(240,230,211,0.42)", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span>{selected.dates}</span>
                    {selected.butters && <span style={{ display:"flex", alignItems:"center", gap:5, color:"#d4a843" }}><PawPrints size={13}/>Butters was there</span>}
                  </div>
                </div>
                <button className="xbtn" onClick={close}>✕</button>
              </div>
              {isMultiVisit && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {visits.map((v, i) => (
                    <button key={v.id} className={`tab-btn${i === visitIdx ? " active" : ""}`} onClick={() => selectVisit(i)}>
                      {v.dates}{v.butters ? " 🐾" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PHOTO — swipe supported */}
            <div style={{ position:"relative", background:"#0e0804" }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchStartX.current === null) return;
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) diff > 0 ? nextPhoto() : prevPhoto();
                touchStartX.current = null;
              }}
            >
              <img key={`${selected.id}-${photoIdx}`} src={selected.photos[photoIdx]} alt={`${selected.name} ${photoIdx+1}`}
                style={{ width:"100%", maxHeight:"60vh", objectFit:"contain", display:"block", background:"#0e0804", animation:"fi 0.2s ease" }}
              />
              {selected.photos.length > 1 && <>
                <button className="nbtn" style={{ left:12 }} onClick={prevPhoto}>‹</button>
                <button className="nbtn" style={{ right:12 }} onClick={nextPhoto}>›</button>
                <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
                  {selected.photos.map((_,i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)} style={{ width:i===photoIdx?22:8, height:8, borderRadius:4, background:i===photoIdx?selected.color:"rgba(255,255,255,0.32)", border:"none", cursor:"pointer", padding:0, transition:"all 0.2s" }}/>
                  ))}
                </div>
              </>}
            </div>

            <div style={{ padding:"0.7rem 1.4rem", borderTop:"1px solid rgba(240,230,211,0.06)", fontFamily:"'Jost',sans-serif", fontSize:"11px", color:"rgba(240,230,211,0.22)" }}>
              Photo {photoIdx+1} of {selected.photos.length}
            </div>

            {/* MINI MAP */}
            <div style={{ borderTop:"1px solid rgba(240,230,211,0.06)", background:"#160e05" }}>
              <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale:153, center:selected.coords }} style={{ width:"100%", height:150, display:"block" }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo} style={{
                      default: { fill:"#253520", stroke:"#35482f", strokeWidth:0.5, outline:"none" },
                      hover:   { fill:"#253520", stroke:"#35482f", strokeWidth:0.5, outline:"none" },
                      pressed: { fill:"#253520", stroke:"#35482f", strokeWidth:0.5, outline:"none" },
                    }}/>
                  ))}
                </Geographies>
                <Marker coordinates={selected.coords}>
                  <circle r="5" fill={selected.color} stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" style={{ filter:`drop-shadow(0 0 5px ${selected.color})` }}/>
                  <circle r="14" fill="none" stroke={selected.color} strokeWidth="1" opacity="0.35"/>
                </Marker>
              </ComposableMap>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
