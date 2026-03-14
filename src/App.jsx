import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════ STYLES ═══════════════════ */
const GS = () => (<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
  html,body{overflow-x:hidden;width:100%;-webkit-text-size-adjust:100%;}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;font-family:'Cairo',sans-serif;}
  @keyframes drift{0%,100%{transform:translateY(0)scale(1)}50%{transform:translateY(-20px)scale(1.04)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
  @keyframes popIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes blink{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}
  @keyframes cPop{0%{transform:scale(1)}45%{transform:scale(1.03)}100%{transform:scale(1)}}
  @keyframes numPop{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
  @keyframes streakGlow{0%,100%{box-shadow:0 0 0 rgba(249,115,22,0)}50%{box-shadow:0 0 20px rgba(249,115,22,.4)}}
  @keyframes wShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
  @keyframes glowP{0%,100%{box-shadow:0 4px 18px rgba(249,115,22,.35)}50%{box-shadow:0 6px 28px rgba(249,115,22,.55)}}
  @keyframes gridAnim{0%,100%{opacity:.045}50%{opacity:.09}}
  @keyframes drawSVG{from{stroke-dashoffset:600}to{stroke-dashoffset:0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes slideDown{from{opacity:0;transform:translate(-50%,-24px);}to{opacity:1;transform:translate(-50%,0);}}
  @keyframes teacherIn{from{opacity:0;transform:translateY(20px)scale(.96)}to{opacity:1;transform:translateY(0)scale(1)}}
  .au{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
  .si{animation:scaleIn .42s cubic-bezier(.22,1,.36,1) both}
  .pi{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both}
  .d1{animation-delay:.07s}.d2{animation-delay:.14s}.d3{animation-delay:.21s}
  .d4{animation-delay:.28s}.d5{animation-delay:.35s}.d6{animation-delay:.42s}
  .app{min-height:100vh;background:#05091a;color:#fff;direction:rtl;overflow-x:hidden;width:100%;}
  .wrap{max-width:1080px;margin:0 auto;padding:clamp(16px,3vw,30px) clamp(12px,2.5vw,22px);position:relative;z-index:1;overflow-x:hidden;width:100%;}
  .bg-f{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;max-width:100vw;}
  .bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(249,115,22,.055)1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.055)1px,transparent 1px);background-size:52px 52px;animation:gridAnim 5s ease-in-out infinite;}
  .orb{position:absolute;border-radius:50%;filter:blur(90px);animation:drift var(--d,10s) ease-in-out var(--dl,0s) infinite;}
  .gl{background:rgba(10,18,40,.88);border:1px solid rgba(255,255,255,.085);border-radius:22px;}
  .gl2{background:rgba(5,9,26,.78);border:1px solid rgba(255,255,255,.07);border-radius:16px;}
  .gl-o{background:rgba(249,115,22,.07);border:1px solid rgba(249,115,22,.22);border-radius:18px;}
  .gl-c{background:rgba(34,211,238,.06);border:1px solid rgba(34,211,238,.2);border-radius:18px;}
  .gl-g{background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.2);border-radius:18px;}
  .gl-v{background:rgba(167,139,250,.07);border:1px solid rgba(167,139,250,.22);border-radius:18px;}
  .nav{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.06);position:sticky;top:0;z-index:200;background:rgba(5,9,26,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);margin-bottom:0;}
  .logo{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#f97316,#ea580c);display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:900;color:#0a0f1e;box-shadow:0 4px 20px rgba(249,115,22,.42);transition:transform .2s;cursor:default;}
  .logo:hover{transform:rotate(-7deg)scale(1.07);}
  .btn{padding:11px 20px;border-radius:13px;font-size:.855rem;font-weight:800;cursor:pointer;transition:all .2s;border:none;outline:none;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;}
  .btn-p{background:linear-gradient(135deg,#f97316,#fb923c);color:#0a0f1e;animation:glowP 3s ease-in-out infinite;}
  .btn-p:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.08);}
  .btn-p:disabled{opacity:.35;cursor:not-allowed;animation:none;}
  .btn-g{background:rgba(255,255,255,.055);border:1.5px solid rgba(255,255,255,.1)!important;color:#cbd5e1;}
  .btn-g:hover{background:rgba(255,255,255,.1);transform:translateY(-1px);}
  .btn-out{background:transparent;border:1.5px solid rgba(249,115,22,.4)!important;color:#fdba74;}
  .btn-out:hover{background:rgba(249,115,22,.08);}
  .btn-v{background:rgba(167,139,250,.12);border:1.5px solid rgba(167,139,250,.3)!important;color:#c4b5fd;}
  .btn-v:hover{background:rgba(167,139,250,.2);}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:99px;font-size:.69rem;font-weight:700;}
  .b-o{background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.28);color:#fdba74;}
  .b-c{background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.22);color:#67e8f9;}
  .b-g{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.22);color:#86efac;}
  .b-r{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.22);color:#fca5a5;}
  .b-v{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.22);color:#c4b5fd;}
  .b-y{background:rgba(250,204,21,.1);border:1px solid rgba(250,204,21,.22);color:#fde047;}
  .b-ai{background:linear-gradient(135deg,rgba(249,115,22,.15),rgba(34,211,238,.1));border:1px solid rgba(249,115,22,.25);color:#fdba74;}
  .pt{height:5px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;}
  .pt8{height:8px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;}
  .pf{height:100%;border-radius:99px;background:linear-gradient(90deg,#f97316,#22d3ee);transition:width 1s cubic-bezier(.22,1,.36,1);}
  .ans{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 17px;border-radius:15px;border:1.5px solid rgba(255,255,255,.09);background:rgba(5,9,26,.7);color:#e2e8f0;font-size:.88rem;font-weight:600;cursor:pointer;text-align:right;transition:all .18s;line-height:1.7;}
  .ans:hover:not(.lk){border-color:rgba(249,115,22,.35);background:rgba(249,115,22,.07);transform:translateX(-3px);}
  .ans.sel{border-color:rgba(249,115,22,.55);background:rgba(249,115,22,.11);color:#fff;}
  .ans.ok{border-color:rgba(74,222,128,.55);background:rgba(74,222,128,.1);color:#bbf7d0;animation:cPop .4s ease;}
  .ans.bad{border-color:rgba(248,113,113,.55);background:rgba(248,113,113,.1);color:#fecaca;animation:wShake .35s ease;}
  .opt-l{min-width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;background:rgba(255,255,255,.07);color:#475569;flex-shrink:0;transition:all .18s;}
  .sel .opt-l{background:rgba(249,115,22,.3);color:#fed7aa;}
  .ok .opt-l{background:rgba(74,222,128,.3);color:#a7f3d0;}
  .bad .opt-l{background:rgba(248,113,113,.3);color:#fca5a5;}
  .sc{padding:15px 17px;border-radius:17px;border:1.5px solid rgba(255,255,255,.08);background:rgba(5,9,26,.6);cursor:pointer;text-align:right;transition:all .18s;}
  .sc:hover{border-color:rgba(249,115,22,.3);background:rgba(249,115,22,.05);transform:translateX(-3px);}
  .sc.on{border-color:rgba(249,115,22,.55);background:rgba(249,115,22,.1);box-shadow:0 0 0 3px rgba(249,115,22,.08);}
  .inp{width:100%;padding:12px 14px;border-radius:13px;background:rgba(5,9,26,.85);border:1.5px solid rgba(255,255,255,.09);color:#fff;font-size:.88rem;outline:none;text-align:right;transition:all .2s;font-family:'Cairo',sans-serif;}
  .inp:focus{border-color:rgba(249,115,22,.45);box-shadow:0 0 0 3px rgba(249,115,22,.09);}
  .inp::placeholder{color:#475569;}
  .spin{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.15);border-top-color:#f97316;border-radius:50%;animation:spin .7s linear infinite;}
  .spin-lg{width:36px;height:36px;border-width:3.5px;}
  .dots{display:flex;gap:5px;align-items:center;}
  .dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#f97316;animation:blink 1.2s ease-in-out infinite;}
  .dots span:nth-child(2){animation-delay:.2s;}.dots span:nth-child(3){animation-delay:.4s;}
  .step{display:flex;gap:10px;align-items:flex-start;padding:11px 14px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);animation:fadeUp .42s cubic-bezier(.22,1,.36,1) both;}
  .snum{min-width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#f97316,#ea580c);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:900;color:#0a0f1e;flex-shrink:0;margin-top:2px;}
  .shape-box{padding:18px;border-radius:18px;background:rgba(5,9,26,.85);border:1px solid rgba(249,115,22,.18);margin-bottom:20px;}
  .ring-w{display:flex;flex-direction:column;align-items:center;gap:4px;}
  .stat{padding:17px 15px;text-align:right;transition:transform .2s;}
  .stat:hover{transform:translateY(-3px);}
  .teacher-card{animation:teacherIn .6s cubic-bezier(.22,1,.36,1) both;border-radius:22px;overflow:hidden;}
  .teacher-insight{padding:12px 15px;border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(5,9,26,.6);margin-bottom:9px;animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;}
  .review-item{padding:16px 18px;border-radius:16px;border:1.5px solid rgba(248,113,113,.2);background:rgba(248,113,113,.05);margin-bottom:10px;cursor:pointer;transition:all .18s;}
  .review-item:hover{border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.09);transform:translateX(-3px);}
  .review-item.solved{border-color:rgba(74,222,128,.25);background:rgba(74,222,128,.05);}
  .diag-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;background:linear-gradient(135deg,rgba(167,139,250,.2),rgba(34,211,238,.1));border:1px solid rgba(167,139,250,.3);color:#c4b5fd;font-size:.72rem;font-weight:700;animation:float 3s ease-in-out infinite;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:rgba(249,115,22,.35);border-radius:99px;}

  /* ══════════════════════════════════════════
     RESPONSIVE — Mobile First
     breakpoint: 640px
  ══════════════════════════════════════════ */

  /* Utility classes for responsive grids */
  .rg-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .rg-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .rg-4{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}
  .rg-sidebar{display:grid;grid-template-columns:1fr 270px;gap:14px;}
  .rg-sim{display:grid;grid-template-columns:1fr 260px;gap:13px;}
  .rg-lesson{display:grid;grid-template-columns:1fr 1fr;gap:13px;}
  .rg-onboard{display:grid;grid-template-columns:1.2fr .8fr;gap:14px;}

  /* ── Mobile overrides ── */
  /* ══════════════════════════════════════════
     MOBILE ONLY — max 640px (iPhone 11 = 414px)
     ديسكتوب وتابلت ما يتأثرون أبداً
     ══════════════════════════════════════════ */
  @media(max-width:640px){

    /* ── Layout ── */
    .wrap{padding:10px 12px 100px !important;width:100% !important;overflow-x:hidden !important;}
    @supports(padding-bottom:env(safe-area-inset-bottom)){
      .wrap{padding-bottom:calc(100px + env(safe-area-inset-bottom)) !important;}
    }

    /* ── Grids → عمود واحد ── */
    .rg-2,.rg-3,.rg-4,.rg-sidebar,.rg-sim,.rg-lesson,.rg-onboard{
      grid-template-columns:1fr !important;
    }
    .rg-4{grid-template-columns:1fr 1fr !important;}
    .pricing-grid,.bank-grid,.sim-running,.lesson-cols,.sim-tracks,.teacher-grid{
      grid-template-columns:1fr !important;
    }
    .placement-stats,.landing-features,.landing-stats,.topic-btn-grid,.sim-grid{
      grid-template-columns:1fr 1fr !important;
    }

    /* ── Nav ── */
    .nav{padding:10px 14px !important;margin-bottom:0;}
    /* ── Nav موبايل ── */
    .nav-desktop{display:none !important;}
    .nav-mob-row{display:flex !important;}

    /* ── Buttons — minimum 48px touch target (Apple HIG) ── */
    .btn{
      min-height:48px !important;
      padding:13px 18px !important;
      font-size:.92rem !important;
      border-radius:14px !important;
    }
    .landing-hero-btns .btn{
      width:100% !important;
      justify-content:center !important;
      font-size:1rem !important;
      padding:16px !important;
    }
    .landing-hero-btns{flex-direction:column !important;align-items:stretch !important;gap:10px !important;}

    /* ── Cards ── */
    .gl{border-radius:16px;padding:14px !important;}
    .gl2{border-radius:12px;}

    /* ── Typography ── */
    h1{font-size:1.45rem !important;line-height:1.3 !important;}
    h2{font-size:1.1rem !important;line-height:1.4 !important;}
    h3{font-size:.95rem !important;}

    /* ── Answers — راحة في الضغط ── */
    .ans{
      padding:17px 14px !important;
      font-size:.93rem !important;
      line-height:1.7 !important;
      border-radius:14px !important;
    }
    .opt-l{min-width:34px !important;height:34px !important;font-size:.76rem !important;border-radius:9px !important;}

    /* ── Session sidebar مخفي على موبايل ── */
    .mob-hide{display:none !important;}
    .mob-show{display:flex !important;}

    /* ── Mobile stats bar (يظهر بدل السايدبار) ── */
    .mob-stats-bar{
      display:flex !important;
      align-items:center;
      gap:10px;
      padding:10px 14px;
      border-radius:14px;
      background:rgba(10,18,40,.95);
      border:1px solid rgba(255,255,255,.08);
      margin-bottom:10px;
      flex-wrap:wrap;
    }

    /* ── Session question card ── */
    .si{padding:18px !important;}

    /* ── Roadmap tabs scrollable ── */
    .roadmap-tabs{
      overflow-x:auto;
      -webkit-overflow-scrolling:touch;
      white-space:nowrap;
      padding-bottom:4px;
      scrollbar-width:none;
    }
    .roadmap-tabs::-webkit-scrollbar{display:none;}
    .topic-btn-grid .sc{padding:12px 10px !important;}

    /* ── Override large inline paddings on mobile ── */
    .gl-pad-lg{padding:18px !important;}
    /* ── Landing page mobile overhaul ── */

    /* Stats bar → 2x2 */
    .landing-stats-bar{grid-template-columns:1fr 1fr !important;}
    .landing-stats-bar>div{border-left:none !important;border-bottom:1px solid rgba(255,255,255,.06);}

    /* Features → 1 col, hide demo panel */
    .landing-feat-grid{grid-template-columns:1fr !important;}
    .feat-demo{display:none !important;}

    /* Feature buttons — more compact */
    .landing-feat-grid button{padding:12px 14px !important;}
    .landing-feat-grid button>div:first-child{width:36px !important;height:36px !important;}

    /* Steps → 1 col horizontal cards */
    .landing-steps{grid-template-columns:1fr !important;gap:10px !important;}
    .landing-step-card{
      display:flex !important;
      align-items:center !important;
      gap:14px !important;
      padding:16px !important;
    }
    .landing-step-card>div:first-child{
      position:static !important;
      font-size:1.6rem !important;
      opacity:1 !important;
      color:inherit !important;
      flex-shrink:0;
    }

    /* CTA buttons full width */
    .landing-cta-btns{flex-direction:column !important;align-items:stretch !important;}
    .landing-cta-btns .btn{width:100% !important;justify-content:center !important;}

    /* ── Misc ── */
    .mob-full{width:100% !important;justify-content:center !important;}
    .next-cd-btn{width:100% !important;justify-content:center !important;}
    .orb{display:none;}

    /* ── Fix cards overflow on mobile ── */
    .gl,.gl2,.gl-o,.gl-c,.gl-g,.gl-v{
      min-width:0 !important;
      max-width:100% !important;
    }
    /* ── Fix tables overflow ── */
    table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;}
    /* ── Fix any flex row overflow ── */
    .rg-2,.rg-3,.rg-4{gap:9px !important;}
    /* ── Paywall grid → stack on small mobile ── */
    .paywall-grid{grid-template-columns:1fr !important;}
    .mob-cta{position:sticky;bottom:14px;z-index:100;display:flex;gap:9px;justify-content:center;flex-wrap:wrap;}

    /* ── Large paddings → ضغط على موبايل فقط ── */
    [style*="padding:"32px"],[style*="padding:"34px"],[style*="padding:"36px"],
    [style*="padding:"38px"],[style*="padding:"48px"],[style*="padding:"60px"]{
      padding:16px !important;
    }
  }

  /* ── iPhone SE / صغير جداً ── */
  @media(max-width:375px){
    .btn{font-size:.84rem !important;padding:12px 14px !important;}
    h1{font-size:1.25rem !important;}
    .ans{font-size:.85rem !important;padding:14px 12px !important;}
    .wrap{padding:8px 10px 100px !important;}
  }

  /* ── Tablet (641-900px) ── */
  @media(min-width:641px) and (max-width:900px){
    .rg-sidebar{grid-template-columns:1fr 220px;}
    .rg-4{grid-template-columns:1fr 1fr;}
    .rg-3{grid-template-columns:1fr 1fr;}
    .pricing-grid{grid-template-columns:1fr 1fr !important;}
    .rg-sim{grid-template-columns:1fr 200px;}
    .landing-feat-grid{grid-template-columns:1fr !important;}
    .feat-demo{display:none !important;}
  }
  /* ── Toast ── */
  @keyframes slideUp{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 22px;border-radius:14px;background:rgba(10,18,40,.97);border:1px solid rgba(249,115,22,.4);color:#fff;font-size:.85rem;font-weight:700;z-index:9999;white-space:nowrap;animation:slideUp .3s cubic-bezier(.22,1,.36,1);box-shadow:0 8px 32px rgba(0,0,0,.5);display:flex;align-items:center;gap:8px;min-width:200px;justify-content:center;}
  .toast.success{border-color:rgba(74,222,128,.45);color:#86efac;background:rgba(5,20,12,.97);}
  .toast.error{border-color:rgba(248,113,113,.45);color:#fca5a5;background:rgba(20,5,5,.97);}
  .toast.info{border-color:rgba(34,211,238,.3);color:#67e8f9;background:rgba(5,12,20,.97);}
  /* ── Skeleton ── */
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 100%);background-size:800px 100%;animation:shimmer 1.4s ease-in-out infinite;border-radius:10px;display:block;}
  /* ── Dashboard action grid ── */
  .dash-action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}
  @media(max-width:640px){.dash-action-grid{grid-template-columns:1fr 1fr !important;gap:9px !important;}}
  /* ── Placement quiz ── */
  .placement-grid{display:grid;grid-template-columns:1fr 290px;gap:16px;}
  @media(max-width:640px){.placement-grid{grid-template-columns:1fr !important;}.placement-sidebar{display:none !important;}}
`}</style>);

/* ═══════════════════ NATURE SOUNDS (Web Audio API) ═══════════════════ */
function useNatureSounds(){
  const ctxRef=useRef(null),nodesRef=useRef({});
  const[active,setActive]=useState(null),[vol,setVol]=useState(0.42);
  const getCtx=()=>{if(!ctxRef.current)ctxRef.current=new(window.AudioContext||window.webkitAudioContext)();if(ctxRef.current.state==="suspended")ctxRef.current.resume();return ctxRef.current;};
  const mkNoise=(ctx,sec=3)=>{const buf=ctx.createBuffer(1,ctx.sampleRate*sec,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;return s;};
  const buildRain=ctx=>{const m=ctx.createGain();m.connect(ctx.destination);const n1=mkNoise(ctx),f1=ctx.createBiquadFilter();f1.type="bandpass";f1.frequency.value=2800;f1.Q.value=0.8;const g1=ctx.createGain();g1.gain.value=0.55;n1.connect(f1);f1.connect(g1);g1.connect(m);const n2=mkNoise(ctx,5),f2=ctx.createBiquadFilter();f2.type="lowpass";f2.frequency.value=1400;const g2=ctx.createGain();g2.gain.value=0.28;n2.connect(f2);f2.connect(g2);g2.connect(m);n1.start();n2.start();return{m,stop:()=>{try{n1.stop();n2.stop();}catch(e){}}};};
  const buildWind=ctx=>{const m=ctx.createGain();m.connect(ctx.destination);const n=mkNoise(ctx,4),bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=360;bp.Q.value=0.4;const g=ctx.createGain();g.gain.value=0.5;const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=0.08;lg.gain.value=0.28;lfo.connect(lg);lg.connect(g.gain);n.connect(bp);bp.connect(g);g.connect(m);n.start();lfo.start();return{m,stop:()=>{try{n.stop();lfo.stop();}catch(e){}}};};
  const buildOcean=ctx=>{const m=ctx.createGain();m.connect(ctx.destination);const n=mkNoise(ctx,6),lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=700;const g=ctx.createGain();g.gain.value=0.55;const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=0.065;lg.gain.value=0.32;lfo.connect(lg);lg.connect(g.gain);n.connect(lp);lp.connect(g);g.connect(m);n.start();lfo.start();return{m,stop:()=>{try{n.stop();lfo.stop();}catch(e){}}};};
  const buildForest=ctx=>{const m=ctx.createGain();m.connect(ctx.destination);const n=mkNoise(ctx,3),bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=2200;bp.Q.value=3;const g=ctx.createGain();g.gain.value=0.06;n.connect(bp);bp.connect(g);g.connect(m);n.start();let cid;const chirp=()=>{const t=ctx.currentTime,freq=2400+Math.random()*1800,osc=ctx.createOscillator(),og=ctx.createGain();osc.type="sine";osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(freq*1.35,t+0.07);osc.frequency.exponentialRampToValueAtTime(freq,t+0.16);og.gain.setValueAtTime(0.001,t);og.gain.linearRampToValueAtTime(0.28,t+0.04);og.gain.linearRampToValueAtTime(0.001,t+0.22);osc.connect(og);og.connect(m);osc.start(t);osc.stop(t+0.28);};const sched=()=>{chirp();if(Math.random()>.45)setTimeout(chirp,130+Math.random()*120);cid=setTimeout(sched,900+Math.random()*2200);};cid=setTimeout(sched,300);return{m,stop:()=>{try{n.stop();clearTimeout(cid);}catch(e){}}};};
  const buildFire=ctx=>{const m=ctx.createGain();m.connect(ctx.destination);const n=mkNoise(ctx,3),f1=ctx.createBiquadFilter(),f2=ctx.createBiquadFilter();f1.type="bandpass";f1.frequency.value=600;f1.Q.value=1.2;f2.type="highpass";f2.frequency.value=200;const g=ctx.createGain();g.gain.value=0.45;const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=0.25;lg.gain.value=0.18;lfo.connect(lg);lg.connect(g.gain);n.connect(f1);f1.connect(f2);f2.connect(g);g.connect(m);n.start();lfo.start();return{m,stop:()=>{try{n.stop();lfo.stop();}catch(e){}}};};
  const BUILDERS={rain:buildRain,wind:buildWind,ocean:buildOcean,forest:buildForest,fire:buildFire};
  const play=type=>{if(nodesRef.current.cur){nodesRef.current.cur.stop();nodesRef.current.cur=null;}if(active===type){setActive(null);return;}const ctx=getCtx(),node=BUILDERS[type](ctx);node.m.gain.value=vol;nodesRef.current.cur=node;setActive(type);};
  const changeVol=v=>{setVol(v);if(nodesRef.current.cur)nodesRef.current.cur.m.gain.value=v;};
  useEffect(()=>()=>{if(nodesRef.current.cur)nodesRef.current.cur.stop();},[]);
  return{active,vol,play,changeVol};
}
const SOUND_LIST=[{id:"rain",e:"🌧️",l:"مطر"},{id:"wind",e:"🌬️",l:"ريح"},{id:"ocean",e:"🌊",l:"أمواج"},{id:"forest",e:"🦜",l:"طيور"},{id:"fire",e:"🔥",l:"نار"}];
function SoundPanel({sounds}){
  const{active,vol,play,changeVol}=sounds;
  const[open,setOpen]=useState(false);
  const wrapRef=useRef(null);

  useEffect(()=>{
    if(!open)return;
    const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[open]);

  return(
    <div ref={wrapRef} style={{position:"relative"}}>
      <button onClick={()=>setOpen(p=>!p)} style={{
        padding:"7px 13px",borderRadius:11,
        border:`1.5px solid ${active?"rgba(249,115,22,.5)":"rgba(255,255,255,.1)"}`,
        background:active?"rgba(249,115,22,.12)":"rgba(5,9,26,.7)",
        cursor:"pointer",display:"flex",alignItems:"center",gap:6,
        color:active?"#fdba74":"#64748b",fontWeight:700,fontSize:".76rem",
        fontFamily:"Cairo,sans-serif",transition:"all .2s"
      }}>
        {active?SOUND_LIST.find(s=>s.id===active)?.e:"🔇"}
        <span>{active?"صوت الطبيعة":"صامت"}</span>
      </button>

      {open&&(
        <div style={{
          position:"absolute",top:"calc(100% + 8px)",left:0,
          zIndex:9999,width:252,
          background:"#080f1e",
          border:"1.5px solid rgba(249,115,22,.3)",
          borderRadius:18,padding:"16px",
          boxShadow:"0 24px 70px rgba(0,0,0,.85)",
          fontFamily:"Cairo,sans-serif",direction:"rtl",
          animation:"scaleIn .2s cubic-bezier(.22,1,.36,1) both"
        }}>
          <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:12}}>🌿 أصوات الطبيعة</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7,marginBottom:14}}>
            {SOUND_LIST.map(s=>(
              <button key={s.id} onClick={()=>play(s.id)} style={{
                padding:"9px 4px",borderRadius:11,
                border:`1.5px solid ${active===s.id?"rgba(249,115,22,.6)":"rgba(255,255,255,.09)"}`,
                background:active===s.id?"rgba(249,115,22,.18)":"rgba(255,255,255,.04)",
                cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                transition:"all .2s",fontFamily:"Cairo,sans-serif",
                boxShadow:active===s.id?"0 0 12px rgba(249,115,22,.3)":"none"
              }}>
                <span style={{fontSize:"1.3rem"}}>{s.e}</span>
                <span style={{fontSize:".56rem",color:active===s.id?"#fdba74":"#64748b",fontWeight:700}}>{s.l}</span>
              </button>
            ))}
          </div>
          {active&&(
            <div style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <p style={{fontSize:".67rem",color:"#64748b"}}>المستوى</p>
                <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700}}>{Math.round(vol*100)}%</p>
              </div>
              <input type="range" min="0.05" max="0.9" step="0.05" value={vol}
                onChange={e=>changeVol(+e.target.value)}
                style={{width:"100%",accentColor:"#f97316",cursor:"pointer"}}/>
            </div>
          )}
          <button onClick={()=>setOpen(false)} style={{
            width:"100%",padding:"8px",borderRadius:10,
            background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
            color:"#94a3b8",fontSize:".76rem",fontWeight:700,cursor:"pointer",
            fontFamily:"Cairo,sans-serif"
          }}>إغلاق ✕</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ QUESTION TIMER ═══════════════════ */
function QuestionTimer({seconds=90,onExpire,paused=false}){
  const[left,setLeft]=useState(seconds);
  const pct=Math.round((left/seconds)*100),warn=left<=15,r=22,c=2*Math.PI*r;
  useEffect(()=>{setLeft(seconds);},[seconds]);
  useEffect(()=>{if(paused||left<=0){if(left<=0)onExpire?.();return;}const id=setTimeout(()=>setLeft(p=>p-1),1000);return()=>clearTimeout(id);},[left,paused]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return(<div style={{padding:"8px 13px",borderRadius:12,background:warn?"rgba(248,113,113,.1)":"rgba(255,255,255,.04)",border:`1.5px solid ${warn?"rgba(248,113,113,.4)":"rgba(255,255,255,.08)"}`,display:"flex",alignItems:"center",gap:10,transition:"all .3s",animation:warn?"timerWarn 1s ease-in-out infinite":"none"}}>
    <svg width={56} height={56} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={5}/>
      <circle cx={28} cy={28} r={r} fill="none" stroke={warn?"#f87171":pct>50?"#4ade80":"#f97316"} strokeWidth={5} strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear,stroke .5s"}}/>
      <text x={28} y={28} textAnchor="middle" dominantBaseline="middle" fill={warn?"#f87171":"#fff"} fontSize={10} fontWeight={900} fontFamily="Cairo" transform="rotate(90,28,28)">{fmt(left)}</text>
    </svg>
    <div><p style={{fontSize:".67rem",color:warn?"#f87171":"#64748b",fontWeight:700}}>{warn?"⚡ وقت قليل!":"⏱ الوقت"}</p><p style={{fontSize:".74rem",color:"#94a3b8",marginTop:2}}>90 ثانية/سؤال</p></div>
  </div>);
}

/* ═══════════════════ RESULT CARD ═══════════════════ */
function ResultCard({stats,onClose}){
  const{topic,section,correct,total,avgTime}=stats;
  const acc=total?Math.round((correct/total)*100):0;
  const grade=acc>=90?"ممتاز 🏆":acc>=75?"جيد جداً ⭐":acc>=60?"جيد 📈":"واصل التدريب 💪";
  const gradeC=acc>=90?"#fde047":acc>=75?"#86efac":acc>=60?"#fdba74":"#fca5a5";
  const[copied,setCopied]=useState(false);
  const[shared,setShared]=useState(false);

  const shareText="🎯 فهمني — نتيجة جلستي\n\n📚 الباب: "+topic+" ("+section+")\n✅ الصح: "+correct+"/"+total+"\n🎯 الدقة: "+acc+"%\n⏱ متوسط: "+avgTime+" ثانية\n📊 التقييم: "+grade+"\n\nجرّب فهمني — أذكى طريقة للقدرات 🧠\nfahmni.sa";
  const shareUrl="https://fahmni.sa";

  const doWebShare=async()=>{
    if(navigator.share){
      try{
        await navigator.share({title:"فهمني — نتيجتي",text:shareText,url:shareUrl});
        setShared(true);
      }catch(e){}
    }else{
      navigator.clipboard?.writeText(shareText+"\n"+shareUrl).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
    }
  };
  const shareWA=()=>window.open("https://wa.me/?text="+encodeURIComponent(shareText+"\n"+shareUrl),"_blank");
  const shareX=()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,"_blank");

  const r=32,cv=2*Math.PI*r;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",backdropFilter:"blur(16px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:"16px"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{width:"100%",maxWidth:420,borderRadius:24,overflow:"hidden",animation:"scaleIn .45s cubic-bezier(.22,1,.36,1) both"}}>

        {/* ── بطاقة النتيجة — قابلة للمشاركة ── */}
        <div style={{padding:"28px 26px 22px",background:"linear-gradient(145deg,#0c1528,#180a00)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(249,115,22,.2) 0%,transparent 70%)",
            top:-70,right:-60,pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:160,height:160,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(34,211,238,.1) 0%,transparent 70%)",
            bottom:-40,left:-40,pointerEvents:"none"}}/>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div className="logo" style={{width:34,height:34,fontSize:".9rem"}}>ف</div>
                <div>
                  <p style={{fontSize:".78rem",fontWeight:800,color:"#fff"}}>فهمني</p>
                  <p style={{fontSize:".58rem",color:"#475569"}}>نتيجة الجلسة</p>
                </div>
              </div>
              <p style={{fontSize:"clamp(2rem,6vw,2.8rem)",fontWeight:900,
                background:"linear-gradient(135deg,#f97316,#fdba74,#22d3ee)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                lineHeight:1}}>{acc}%</p>
              <p style={{fontSize:".85rem",color:gradeC,fontWeight:800,marginTop:6}}>{grade}</p>
              <p style={{fontSize:".7rem",color:"#475569",marginTop:3}}>{topic} · {section}</p>
            </div>
            <svg width={80} height={80} style={{transform:"rotate(-90deg)",flexShrink:0}}>
              <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={7}/>
              <circle cx={40} cy={40} r={r} fill="none"
                stroke={acc>=75?"#4ade80":acc>=50?"#f97316":"#f87171"}
                strokeWidth={7} strokeDasharray={cv}
                strokeDashoffset={cv*(1-acc/100)} strokeLinecap="round"/>
              <text x={40} y={40} textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize={13} fontWeight={900} fontFamily="Cairo"
                transform="rotate(90,40,40)">{acc}%</text>
            </svg>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:18}}>
            {[["✅","الصح",`${correct}/${total}`],["⏱","متوسط",`${avgTime}ث`],["📊","القسم",section==="كمي"?"كمي":"لفظي"]]
              .map(([ic,l,v],i)=>(
              <div key={i} style={{padding:"9px 10px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",textAlign:"center"}}>
                <p style={{fontSize:".65rem",color:"#475569",marginBottom:2}}>{ic} {l}</p>
                <p style={{fontSize:".82rem",fontWeight:800,color:"#e2e8f0"}}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── أزرار المشاركة ── */}
        <div style={{padding:"18px 20px",background:"#060d1d",borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <p style={{fontSize:".72rem",color:"#475569",fontWeight:700,marginBottom:12,textAlign:"center"}}>📤 شارك نتيجتك</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {/* واتساب */}
            <button onClick={shareWA} style={{
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,
              padding:"12px 8px",borderRadius:13,cursor:"pointer",
              background:"rgba(37,211,102,.08)",border:"1px solid rgba(37,211,102,.2)",
              color:"#25d366",fontFamily:"Cairo,sans-serif",fontSize:".68rem",fontWeight:700,
              transition:"all .18s"
            }}>
              <span style={{fontSize:"1.3rem"}}>📱</span> واتساب
            </button>
            {/* تويتر */}
            <button onClick={shareX} style={{
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,
              padding:"12px 8px",borderRadius:13,cursor:"pointer",
              background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",
              color:"#e2e8f0",fontFamily:"Cairo,sans-serif",fontSize:".68rem",fontWeight:700,
              transition:"all .18s"
            }}>
              <span style={{fontSize:"1.3rem"}}>🐦</span> تويتر/X
            </button>
            {/* نسخ / Web Share */}
            <button onClick={doWebShare} style={{
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,
              padding:"12px 8px",borderRadius:13,cursor:"pointer",
              background:"rgba(249,115,22,.08)",border:"1px solid rgba(249,115,22,.2)",
              color:"#f97316",fontFamily:"Cairo,sans-serif",fontSize:".68rem",fontWeight:700,
              transition:"all .18s"
            }}>
              <span style={{fontSize:"1.3rem"}}>{copied?"✅":shared?"🎉":"🔗"}</span>
              {copied?"تم النسخ":shared?"شكراً!":"مشاركة"}
            </button>
          </div>

          <button className="btn btn-g" style={{width:"100%",justifyContent:"center",fontSize:".85rem"}} onClick={onClose}>
            إغلاق
          </button>
          <p style={{marginTop:10,fontSize:".62rem",color:"#1e293b",textAlign:"center"}}>fahmni.sa · ذاكر بذكاء على اختبار القدرات</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ BACKGROUND ═══════════════════ */
const Bg = () => (
  <div className="bg-f">
    <div className="bg-grid"/>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% -5%,rgba(249,115,22,.11) 0%,transparent 60%)"}}/>
    <div className="orb" style={{width:"min(560px,100vw)",height:"min(560px,100vw)",top:"-8%",left:"60%",background:"radial-gradient(circle,rgba(249,115,22,.08) 0%,transparent 70%)","--d":"12s"}}/>
    <div className="orb" style={{width:"min(400px,90vw)",height:"min(400px,90vw)",top:"55%",left:"-6%",background:"radial-gradient(circle,rgba(34,211,238,.065) 0%,transparent 70%)","--d":"14s","--dl":"4s"}}/>
    <div className="orb" style={{width:"min(280px,80vw)",height:"min(280px,80vw)",top:"78%",left:"78%",background:"radial-gradient(circle,rgba(139,92,246,.06) 0%,transparent 70%)","--d":"10s","--dl":"2s"}}/>
  </div>
);

/* ═══════════════════ CONFETTI + MILESTONES ═══════════════════ */
function Confetti({active,onDone}){
  const[particles,setParticles]=useState([]);
  useEffect(()=>{
    if(!active)return;
    const cols=["#f97316","#22d3ee","#a78bfa","#4ade80","#fde047","#f87171","#fdba74"];
    const p=Array.from({length:60},(_,i)=>({
      id:i,
      x:Math.random()*100,
      y:-10,
      vx:(Math.random()-0.5)*4,
      vy:Math.random()*6+4,
      r:Math.random()*7+3,
      c:cols[Math.floor(Math.random()*cols.length)],
      rot:Math.random()*360,
      vrot:(Math.random()-0.5)*15,
      shape:Math.random()>0.5?"circle":"rect"
    }));
    setParticles(p);
    const interval=setInterval(()=>{
      setParticles(prev=>prev.map(p=>({...p,y:p.y+p.vy,x:p.x+p.vx,rot:p.rot+p.vrot,vy:p.vy+0.3})).filter(p=>p.y<115));
    },30);
    const timer=setTimeout(()=>{clearInterval(interval);setParticles([]);onDone&&onDone();},2800);
    return()=>{clearInterval(interval);clearTimeout(timer);};
  },[active]);
  if(!particles.length)return null;
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.shape==="circle"?p.r*2:p.r*2.5,
          height:p.shape==="circle"?p.r*2:p.r,
          borderRadius:p.shape==="circle"?"50%":2,
          background:p.c,opacity:.9,
          transform:`rotate(${p.rot}deg)`,
          transition:"none"
        }}/>
      ))}
    </div>
  );
}

/* Milestone popup */
const MILESTONES={
  first_correct:{icon:"🎯",title:"أول إجابة صح!",msg:"البداية دائماً أصعب — وأنت تجاوزتها 💪",color:"#4ade80"},
  daily_goal:{icon:"🎯",title:"حققت هدف اليوم!",msg:"ممتاز! وصلت لهدفك اليومي — واصل الضغط 💪",color:"#4ade80"},
  streak_5:{icon:"🔥",title:"5 صح متتالية!",msg:"ما شاء الله — تركيزك ممتاز",color:"#f97316"},
  streak_10:{icon:"⚡",title:"10 صح متتالية!!",msg:"أداء احترافي — واصل",color:"#fde047"},
  solved_10:{icon:"📚",title:"10 أسئلة مكتملة",msg:"إنجاز حقيقي — استمر على هذا المستوى",color:"#22d3ee"},
  solved_25:{icon:"🏆",title:"25 سؤال!",msg:"ربع المئة — أنت تذاكر فعلاً",color:"#a78bfa"},
  solved_50:{icon:"🌟",title:"50 سؤال!",msg:"مذاكر جاد — المنافسة ستعبك صعبة",color:"#f97316"},
  perfect_session:{icon:"💎",title:"جلسة مثالية!",msg:"كل الأجوبة صحيحة — ما شاء الله",color:"#22d3ee"},
};

function MilestonePopup({milestone,onClose}){
  const m=MILESTONES[milestone];
  if(!m)return null;
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[onClose]);
  return(
    <div style={{
      position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",
      zIndex:9998,animation:"slideDown .45s cubic-bezier(.22,1,.36,1) both",
      width:"calc(100% - 32px)",maxWidth:360
    }}>
      <div style={{
        borderRadius:18,overflow:"hidden",
        background:"rgba(4,7,20,.97)",
        border:`1.5px solid ${m.color}40`,
        boxShadow:`0 20px 60px rgba(0,0,0,.7), 0 0 30px ${m.color}20`,
        backdropFilter:"blur(20px)"
      }}>
        <div style={{height:3,background:`linear-gradient(90deg,${m.color},${m.color}88)`}}/>
        <div style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{
            width:52,height:52,borderRadius:14,flexShrink:0,
            background:`${m.color}15`,border:`1.5px solid ${m.color}30`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem"
          }}>{m.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontWeight:900,color:m.color,fontSize:".92rem",marginBottom:3}}>{m.title}</p>
            <p style={{fontSize:".78rem",color:"#94a3b8",lineHeight:1.55}}>{m.msg}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#334155",fontSize:"1rem",padding:4,flexShrink:0}}>✕</button>
        </div>
      </div>
    </div>
  );
}

/* slideDown animation */

/* ═══════════════════ SVG SHAPES ═══════════════════ */
const Tx=({x,y,children,anchor="middle",size=11,color="#22d3ee",bold=false})=>(
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fill={color} fontSize={size} fontWeight={bold?800:600} fontFamily="Cairo,sans-serif">{children}</text>
);
const RM=({x,y,s=14})=><path d={`M${x+s},${y} L${x+s},${y-s} L${x},${y-s}`} fill="none" stroke="#f97316" strokeWidth={1.5}/>;
const Tick=({x1,y1,x2,y2,n=1})=>{const mx=(x1+x2)/2,my=(y1+y2)/2,ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI;return Array.from({length:n}).map((_,i)=><line key={i} x1={mx+(i-(n-1)/2)*6*Math.cos((ang+90)*Math.PI/180)-7*Math.cos(ang*Math.PI/180)} y1={my+(i-(n-1)/2)*6*Math.sin((ang+90)*Math.PI/180)-7*Math.sin(ang*Math.PI/180)} x2={mx+(i-(n-1)/2)*6*Math.cos((ang+90)*Math.PI/180)+7*Math.cos(ang*Math.PI/180)} y2={my+(i-(n-1)/2)*6*Math.sin((ang+90)*Math.PI/180)+7*Math.sin(ang*Math.PI/180)} stroke="#f97316" strokeWidth={1.8}/>);};
const ArcSVG=({cx,cy,r,start,end,color="#f97316"})=>{const s={x:cx+r*Math.cos(start*Math.PI/180),y:cy+r*Math.sin(start*Math.PI/180)};const e={x:cx+r*Math.cos(end*Math.PI/180),y:cy+r*Math.sin(end*Math.PI/180)};return <path d={`M${s.x},${s.y} A${r},${r} 0 ${Math.abs(end-start)>180?1:0} 1 ${e.x},${e.y}`} fill="none" stroke={color} strokeWidth={1.8} strokeDasharray="4 3"/>;};

function RightTriSVG({labels={},unknown=""}){const W=230,H=170,Ax=26,Ay=142,Bx=192,By=142,Cx=26,Cy=22;const u=s=>unknown===s?"#f97316":"#22d3ee";return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:220}}><path d={`M${Ax},${Ay} L${Bx},${By} L${Cx},${Cy} Z`} fill="rgba(249,115,22,.07)" stroke="#f97316" strokeWidth={2} style={{strokeDasharray:600,animation:"drawSVG 1s cubic-bezier(.22,1,.36,1) both"}}/><RM x={Ax} y={Ay}/><Tx x={(Ax+Bx)/2} y={Ay+15} color={u("base")} bold>{labels.lBase||"القاعدة"}</Tx><Tx x={Ax-10} y={(Ay+Cy)/2} anchor="end" color={u("height")} bold>{labels.lHeight||"الارتفاع"}</Tx><Tx x={(Bx+Cx)/2+14} y={(By+Cy)/2} anchor="start" color={u("hyp")} bold>{labels.lHyp||"وتر"}</Tx>{labels.lAngleB&&<Tx x={Bx-18} y={By-13} color="#a78bfa" size={10}>{labels.lAngleB}</Tx>}<Tx x={Ax-5} y={Ay+13} color="#64748b" size={10}>أ</Tx><Tx x={Bx+5} y={By+13} color="#64748b" size={10}>ب</Tx><Tx x={Cx-9} y={Cy-5} color="#64748b" size={10}>ج</Tx></svg>);}
function IsoTriSVG({labels={},unknown=""}){const W=230,H=170,Ax=18,Ay=148,Bx=212,By=148,Cx=115,Cy=18;const u=s=>unknown===s?"#f97316":"#22d3ee";return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:220}}><polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(249,115,22,.07)" stroke="#f97316" strokeWidth={2}/><Tick x1={Ax} y1={Ay} x2={Cx} y2={Cy} n={1}/><Tick x1={Bx} y1={By} x2={Cx} y2={Cy} n={1}/><Tx x={(Ax+Bx)/2} y={Ay+15} color={u("base")}>{labels.lBase||"القاعدة"}</Tx><Tx x={(Ax+Cx)/2-14} y={(Ay+Cy)/2} anchor="end" color={u("side")}>{labels.lSide||"الضلع"}</Tx>{labels.lAngleTop&&<Tx x={Cx} y={Cy+20} color="#a78bfa" size={10}>{labels.lAngleTop}</Tx>}</svg>);}
function RectSVG({labels={},isSquare=false,unknown=""}){const W=230,H=155,x1=20,y1=20,x2=210,y2=132;const u=s=>unknown===s?"#f97316":"#22d3ee";return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:220}}><rect x={x1} y={y1} width={x2-x1} height={y2-y1} fill="rgba(34,211,238,.06)" stroke="#22d3ee" strokeWidth={2}/>{[[x1,y1,1,1],[x2,y1,-1,1],[x2,y2,-1,-1],[x1,y2,1,-1]].map(([px,py,dx,dy],i)=><path key={i} d={`M${px+dx*11},${py} L${px+dx*11},${py+dy*11} L${px},${py+dy*11}`} fill="none" stroke="#22d3ee" strokeWidth={1.5}/>)}{isSquare&&<><Tick x1={x1} y1={y1} x2={x2} y2={y1} n={2}/><Tick x1={x1} y1={y1} x2={x1} y2={y2} n={2}/></>}<Tx x={(x1+x2)/2} y={y2+15} color={u("width")} bold>{labels.lW||"الطول"}</Tx><Tx x={x1-9} y={(y1+y2)/2} anchor="end" color={u("height")} bold>{labels.lH||"العرض"}</Tx></svg>);}
function AngleSVG({degrees=60,labels={}}){const W=200,H=155,Ax=38,Ay=124,r=115,a1=-18*Math.PI/180,a2=(-18-degrees)*Math.PI/180,Bx=Ax+r*Math.cos(a1),By=Ay+r*Math.sin(a1),Cx=Ax+r*Math.cos(a2),Cy=Ay+r*Math.sin(a2),aM=(-18-degrees/2)*Math.PI/180,arcR=36;return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:200}}><line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#f97316" strokeWidth={2} strokeLinecap="round"/><line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="#f97316" strokeWidth={2} strokeLinecap="round"/><ArcSVG cx={Ax} cy={Ay} r={arcR} start={-18} end={-18-degrees}/><Tx x={Ax+(arcR+17)*Math.cos(aM)} y={Ay+(arcR+17)*Math.sin(aM)} color="#f97316" size={12} bold>{labels.lDeg||`${degrees}°`}</Tx><Tx x={Ax-9} y={Ay+11} color="#64748b" size={11}>{labels.lVertex||"أ"}</Tx><Tx x={Bx+7} y={By} color="#94a3b8" size={11}>{labels.lRay1||"ب"}</Tx><Tx x={Cx+4} y={Cy-7} color="#94a3b8" size={11}>{labels.lRay2||"ج"}</Tx></svg>);}
function CircleSVG({labels={},unknown=""}){const W=195,H=175,cx=97,cy=87,r=64,u=s=>unknown===s?"#f97316":"#22d3ee";return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:200}}><circle cx={cx} cy={cy} r={r} fill="rgba(34,211,238,.05)" stroke="#22d3ee" strokeWidth={2}/><line x1={cx} y1={cy} x2={cx+r} y2={cy} stroke="#f97316" strokeWidth={1.8} strokeDasharray="5 3"/><circle cx={cx} cy={cy} r={3.5} fill="#f97316"/><Tx x={(cx+cx+r)/2} y={cy-11} color={u("radius")} bold size={10}>{labels.lRadius||"نصف القطر"}</Tx></svg>);}

function ShapeRender({shape}){
  if(!shape||shape.type==="none"||!shape.type)return null;
  const{type,labels={},degrees,unknown=""}=shape;
  return(<div className="shape-box"><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>▸ الشكل الهندسي</p><div style={{display:"flex",justifyContent:"center"}}>{type==="right_triangle"&&<RightTriSVG labels={labels} unknown={unknown}/>}{type==="iso_triangle"&&<IsoTriSVG labels={labels} unknown={unknown}/>}{type==="rectangle"&&<RectSVG labels={labels} unknown={unknown}/>}{type==="square"&&<RectSVG labels={labels} isSquare unknown={unknown}/>}{type==="angle"&&<AngleSVG degrees={degrees||60} labels={labels}/>}{type==="circle"&&<CircleSVG labels={labels} unknown={unknown}/>}</div></div>);
}

/* ═══════════════════ RING ═══════════════════ */
function Ring({pct=0,size=88,color="#f97316",label=""}){
  const r=(size-8)/2,c=2*Math.PI*r,off=c-(pct/100)*c;
  return(<div className="ring-w"><svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={7}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)"}}/><text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={size*.19} fontWeight={900} fontFamily="Cairo" transform={`rotate(90,${size/2},${size/2})`}>{pct}%</text></svg>{label&&<span style={{fontSize:".67rem",color:"#64748b",fontWeight:600}}>{label}</span>}</div>);
}

/* ═══════════════════ DATA ═══════════════════ */
const GEO=["المثلثات","المربعات والمستطيلات","الزوايا والأضلاع","الدوائر"];

/* ── الأقسام الرسمية في اختبار قياس (موثّقة من ويكيبيديا + قياس) ── */
const TOPICS={
  "باب 0":[
    "جمع وطرح الأعداد","الضرب والقسمة",
    "الكسور","النسب الأساسية",
    "تحويل الوحدات","المتشابهات",
    "التأسيس الهندسي البسيط",
  ],
  كمي:[
    // حساب ~40%
    "النسبة والتناسب","الأعمار","المتوسط الحسابي",
    "السرعة والمسافة والزمن","الأرباح والنسب المئوية",
    // جبر ~23%
    "الجبر والمعادلات","المتتاليات والأنماط",
    // هندسة ~24%
    "المثلثات","المربعات والمستطيلات","الزوايا والأضلاع","الدوائر",
    // تحليل بيانات ~13%
    "تحليل البيانات والإحصاء",
    // مقارنة
    "المقارنة الكمية",
  ],
  لفظي:[
    "إكمال الجمل",       // ~30% من اللفظي
    "التناظر اللفظي",    // ~25%
    "استيعاب المقروء",   // ~30%
    "الخطأ السياقي",     // ~15% — أُضيف رسمياً منذ 2013
  ]
};

/* ── تقسيم الأبواب لمجموعات فرعية للعرض في الخريطة ── */
const TOPIC_GROUPS={
  "باب 0":[
    {sub:"العمليات الأساسية",icon:"➕",color:"#a78bfa",pct:"التأسيس",topics:["جمع وطرح الأعداد","الضرب والقسمة"]},
    {sub:"الكسور والنسب",icon:"½",color:"#818cf8",pct:"التأسيس",topics:["الكسور","النسب الأساسية"]},
    {sub:"القياس والتحويل",icon:"📏",color:"#6366f1",pct:"التأسيس",topics:["تحويل الوحدات","المتشابهات"]},
    {sub:"الهندسة التأسيسية",icon:"🔷",color:"#7c3aed",pct:"التأسيس",topics:["التأسيس الهندسي البسيط"]},
  ],
  كمي:[
    {sub:"الحساب",icon:"🔢",color:"#f97316",pct:"~40%",topics:["النسبة والتناسب","الأعمار","المتوسط الحسابي","السرعة والمسافة والزمن","الأرباح والنسب المئوية"]},
    {sub:"الجبر",icon:"🔣",color:"#fb923c",pct:"~23%",topics:["الجبر والمعادلات","المتتاليات والأنماط"]},
    {sub:"الهندسة",icon:"📐",color:"#f59e0b",pct:"~24%",topics:["المثلثات","المربعات والمستطيلات","الزوايا والأضلاع","الدوائر"]},
    {sub:"تحليل البيانات",icon:"📊",color:"#f97316",pct:"~13%",topics:["تحليل البيانات والإحصاء"]},
    {sub:"المقارنة",icon:"⚡",color:"#fbbf24",pct:"موجود",topics:["المقارنة الكمية"]},
  ],
  لفظي:[
    {sub:"إكمال الجمل",icon:"✏️",color:"#22d3ee",pct:"~30%",topics:["إكمال الجمل"]},
    {sub:"التناظر اللفظي",icon:"🔗",color:"#38bdf8",pct:"~25%",topics:["التناظر اللفظي"]},
    {sub:"استيعاب المقروء",icon:"📖",color:"#67e8f9",pct:"~30%",topics:["استيعاب المقروء"]},
    {sub:"الخطأ السياقي",icon:"🔍",color:"#22d3ee",pct:"~15%",topics:["الخطأ السياقي"]},
  ]
};

const ICON_LABELS={
  "جمع وطرح الأعداد":"±",
  "الضرب والقسمة":"×÷",
  "الكسور":"½",
  "النسب الأساسية":"∶",
  "تحويل الوحدات":"⇄",
  "المتشابهات":"≅",
  "التأسيس الهندسي البسيط":"⬡",
  
  "النسبة والتناسب":"نسبة",
  "الأعمار":"عمر",
  "المتوسط الحسابي":"وسط",
  "السرعة والمسافة والزمن":"سرعة",
  "الأرباح والنسب المئوية":"ربح%",
  "الجبر والمعادلات":"جبر",
  "المتتاليات والأنماط":"نمط",
  "المثلثات":"△",
  "المربعات والمستطيلات":"□",
  "الزوايا والأضلاع":"∠",
  "الدوائر":"○",
  "تحليل البيانات والإحصاء":"بيان",
  "المقارنة الكمية":"قارن",
  "إكمال الجمل":"جمل",
  "التناظر اللفظي":"تناظر",
  "استيعاب المقروء":"قراءة",
  "الخطأ السياقي":"سياق",
};
const CONCEPTS={"جمع وطرح الأعداد":{formula:"الجمع: أ+ب=ج | الطرح: أ-ب=ج",trap:"⚠ الفخ: انتبه لترتيب الطرح — ترتيب الأعداد مهم"},
  "الضرب والقسمة":{formula:"الضرب: أ×ب | القسمة: أ÷ب",trap:"⚠ الفخ: القسمة على صفر غير ممكنة"},
  "الكسور":{formula:"أ/ب + ج/د = (أد+بج)/بد",trap:"⚠ الفخ: وحّد المقام قبل الجمع"},
  "النسب الأساسية":{formula:"النسبة: أ:ب = أ/ب",trap:"⚠ الفخ: النسبة ليست كسراً عادياً — احترس من الترتيب"},
  "تحويل الوحدات":{formula:"1كم=1000م | 1م=100سم | 1كغ=1000غ",trap:"⚠ الفخ: وحّد الوحدات قبل الحل"},
  "المتشابهات":{formula:"إذا أ/ب=ج/د فـ أ×د=ب×ج",trap:"⚠ الفخ: التأكد من تشابه الأشكال قبل تطبيق النسبة"},
  "التأسيس الهندسي البسيط":{formula:"محيط المربع=4×ض | مساحة=ض²",trap:"⚠ الفخ: الفرق بين المحيط والمساحة"},
  
  "النسبة والتناسب":{icon:"⚖️",formula:"إذا زاد شيء → زاد الثاني (طردي) | إذا زاد شيء → نقص الثاني (عكسي)",rules:["طردي: كلما زاد أحدهما زاد الآخر","عكسي: كلما زاد أحدهما نقص الآخر","ضعف العمال = ضعف الإنتاج بنفس الوقت"],trap:"⚠ الفخ: هل العلاقة طردية أم عكسية؟ حدّدها أولاً"},
  "الأعمار":{icon:"🎂",formula:"الفرق بين عمرين لا يتغير أبداً مع الزمن",rules:["الفرق اليوم = الفرق بعد 10 سنوات","للمستقبل: أضف نفس الرقم للجميع","للماضي: اطرح نفس الرقم من الجميع"],trap:"⚠ الفخ: لا تنسَ تغيير عمر كلا الشخصين"},
  "المتوسط الحسابي":{icon:"📊",formula:"المتوسط = مجموع الأرقام ÷ عددها",rules:["المجموع = المتوسط × العدد","لإيجاد مجهول: اطرح المعروفين من المجموع الكلي","إضافة رقم جديد تغيّر المجموع والعدد معاً"],trap:"⚠ الفخ: لا تنسَ تحديث عدد الأرقام عند الإضافة"},
  "السرعة والمسافة والزمن":{icon:"🚗",formula:"المسافة = السرعة × الزمن",rules:["السرعة = المسافة ÷ الزمن","الزمن = المسافة ÷ السرعة","وحّد الوحدات قبل الحل"],trap:"⚠ الفخ: كيلومتر/ساعة ≠ متر/ثانية — وحّد أولاً"},
  "الأرباح والنسب المئوية":{icon:"💰",formula:"زيادة 20% = اضرب في 1.2 | خصم 20% = اضرب في 0.8",rules:["زيادة بنسبة = الأصل × (1 + النسبة/100)","خصم بنسبة = الأصل × (1 - النسبة/100)","خصم 20 ثم زيادة 20 لا يعيد الأصل"],trap:"⚠ الفخ: خصم 20% ثم زيادة 20% لا تساوي الرقم الأصلي"},
  "الجبر والمعادلات":{icon:"🧮",formula:"ما تفعله بطرف المعادلة تفعله بالطرف الآخر",rules:["نقّل الأرقام للطرف الأيمن والمجاهيل للأيسر","عند القسمة على سالب اقلب اتجاه المتباينة","وزّع الأقواس أولاً قبل الحل"],trap:"⚠ الفخ: لا تنسَ توزيع المعامل على كل حدود القوس"},
  "المتتاليات والأنماط":{icon:"🔄",formula:"حسابية: تجمع رقماً ثابتاً | هندسية: تضرب رقماً ثابتاً",rules:["اكتشف النمط من أول 3 أرقام","حسابية: الفرق بين كل حدين متجاورين ثابت","هندسية: النسبة بين كل حدين متجاورين ثابتة"],trap:"⚠ الفخ: لا تفترض أنها حسابية قبل التحقق"},
  "المثلثات":{icon:"📐",formula:"مجموع زوايا أي مثلث = 180° | المساحة = القاعدة × الارتفاع ÷ 2",rules:["المثلث القائم: الوتر² = مجموع مربعَي الضلعين","الارتفاع هو العمود على القاعدة — ليس الضلع المائل","المحيط = مجموع الأضلاع الثلاثة"],trap:"⚠ الفخ: الضلع المائل ليس الارتفاع"},
  "المربعات والمستطيلات":{icon:"🔲",formula:"مساحة المستطيل = الطول × العرض | مساحة المربع = الضلع × الضلع",rules:["محيط المستطيل = 2 × (الطول + العرض)","محيط المربع = 4 × الضلع","المساحة والمحيط شيئان مختلفان تماماً"],trap:"⚠ الفخ: لا تخلط بين المساحة (م²) والمحيط (م)"},
  "الزوايا والأضلاع":{icon:"📏",formula:"زاويتان على خط مستقيم = 180° | زاويتان في زاوية قائمة = 90°",rules:["الزوايا المتقابلة بالرأس دائماً متساوية","مجموع زوايا الشكل ذي n ضلع = (n-2) × 180","الخطوط المتوازية تُكوّن زوايا متناظرة متساوية"],trap:"⚠ الفخ: لا تخلط بين المتكاملة (180°) والمتتامة (90°)"},
  "الدوائر":{icon:"⭕",formula:"المحيط = 2 × π × نصف القطر | المساحة = π × نصف القطر²",rules:["القطر = ضعف نصف القطر","القوس = (الزاوية ÷ 360) × المحيط","القطاع = (الزاوية ÷ 360) × المساحة"],trap:"⚠ الفخ: استخدم نصف القطر وليس القطر في المعادلة"},
  "تحليل البيانات والإحصاء":{icon:"📈",formula:"المتوسط = المجموع ÷ العدد | الوسيط = الرقم الأوسط بعد الترتيب",rules:["المنوال = الرقم الأكثر تكراراً","الوسيط: رتّب الأرقام أولاً ثم خذ الأوسط","المدى = أكبر رقم ناقص أصغر رقم"],trap:"⚠ الفخ: المتوسط والوسيط والمنوال ثلاثة أشياء مختلفة"},
  "المقارنة الكمية":{icon:"⚔️",formula:"قارن الطرفين: أيهما أكبر؟ أم متساويان؟ أم لا يمكن التحديد؟",rules:["لا تحسب القيمة الكاملة — قارن فقط","احذف المشترك من الطرفين لتبسيط المقارنة","إذا تغيّرت النتيجة بتغيير المتغير → لا يمكن التحديد"],trap:"⚠ الفخ: الحساب الكامل مضيعة للوقت — قارن مباشرة"},
  "إكمال الجمل":{icon:"✏️",formula:"اقرأ الجملة كاملة → حدّد الفكرة → ابحث عن الكلمة التي تكمل المعنى",rules:["اقرأ الجملة قبل النظر للخيارات","ابحث عن أدوات الربط: لكن / بل / لأن / إذن","جرّب كل خيار في الجملة واختر الأنسب للمعنى"],trap:"⚠ الفخ: الكلمة الأشهر ليست دائماً الأنسب للسياق"},
  "التناظر اللفظي":{icon:"🔀",formula:"سيف : قتال = قلم : ؟ — نفس العلاقة بين الزوجين",rules:["حدّد العلاقة بين الكلمتين الأوليين أولاً","ابحث عن نفس العلاقة بالضبط في الزوج الثاني","العلاقة: أداة ووظيفة / جزء وكل / مضاد / فئة ونوع"],trap:"⚠ الفخ: كلمة مرتبطة ≠ كلمة تحمل نفس العلاقة"},
  "استيعاب المقروء":{icon:"📖",formula:"الإجابة موجودة في النص — لا تعتمد على معلوماتك الشخصية",rules:["اقرأ السؤال أولاً ثم ابحث عنه في النص","كل كلمة في السؤال تقودك للفقرة الصحيحة","الخيار الصحيح مذكور أو مستنبط من النص فقط"],trap:"⚠ الفخ: المعلومة صحيحة عموماً لكن غير مذكورة في هذا النص"},
  "الخطأ السياقي":{icon:"🔍",formula:"جملة صحيحة إملائياً لكن فيها كلمة واحدة تكسر المعنى",rules:["اقرأ الجملة وتصوّر معناها الكامل","ابحث عن الكلمة التي لا تنتمي للسياق","الخطأ واحد فقط — لا أكثر"],trap:"⚠ الفخ: الكلمة مكتوبة صح إملائياً لكنها خطأ في المعنى"},
};

const PLACEMENT_Q=[
  {id:1,sec:"كمي",q:"إذا كان 4 طلاب ينهون 10 سؤالاً في 10 دقائق، فكم سؤالاً ينجز 8 طلاب في نفس الوقت؟",opts:["20","30","40","80"],correct:2,why:"عدد العمال تضاعف والوقت ثابت → الإنجاز يتضاعف: 20×2=40"},
  {id:2,sec:"لفظي",q:"أكمل الجملة: النجاح لا يأتي من الحظ، بل من ____.",opts:["الاجتهاد","النسيان","الانتظار","التردد"],correct:0,why:"السياق يطلب ضد الحظ = الاجتهاد"},
  {id:3,sec:"كمي",q:"متوسط ثلاثة أعداد هو 15، وعددان منها 12 و18. ما العدد الثالث؟",opts:["13","15","17","18"],correct:1,why:"المجموع=15×3=45 → الثالث=45−12−18=15"},
  {id:4,sec:"لفظي",q:"كتاب : قراءة = قلم : ___",opts:["كتابة","مسح","ورق","حبر"],correct:0,why:"أداة→وظيفتها: الكتاب للقراءة، القلم للكتابة"},
  {id:5,sec:"كمي",q:"سيارة تسير بسرعة 90 كم/ساعة. في كم ساعة تقطع 270 كم؟",opts:["2","2.5","3","4"],correct:2,why:"ز=م÷س=270÷90=3 ساعات"},
  {id:6,sec:"لفظي",q:"ما مترادف كلمة 'وَجِل'؟",opts:["خائف","شجاع","هادئ","فرحان"],correct:0,why:"وَجِل = خائف / مرتعش"},
];
function getRec({goal,confidence,minutes,section,score,answers}){
  const vC=answers.filter(a=>a.sec==="لفظي"&&a.ok).length;
  const qC=answers.filter(a=>a.sec==="كمي"&&a.ok).length;
  const weak=qC<vC?"كمي":vC<qC?"لفظي":section, m=+minutes;
  if(score<=2||confidence==="ضعيف"||goal==="أبدأ من الأساس")
    return{level:"تأسيس",topic:weak==="لفظي"?"إكمال الجمل":"النسبة والتناسب",plan:m<=20?"خطة خفيفة":"خطة متوازنة",msg:"سنبدأ بالأساسيات خطوة بخطوة. لا ضغط، فقط فهم واضح وتدرج ثابت."};
  if(score<=4||confidence==="متوسط")
    return{level:"متوسط",topic:weak==="لفظي"?"التناظر اللفظي":"الأعمار",plan:m<=20?"خطة خفيفة":"خطة متوازنة",msg:"عندك أساس جيد. سنثبّت بعض المهارات ونضيف اختبارًا بعد كل باب."};
  return{level:"متقدم",topic:weak==="لفظي"?"استيعاب المقروء":"المقارنة الكمية",plan:m>=60?"خطة مكثفة":"خطة متوازنة",msg:"نتيجتك واعدة. سنركّز على التطبيق والأبواب الأصعب وزنًا في الاختبار."};
}

/* ═══════════════════ AI HELPERS ═══════════════════ */
const SUPABASE_URL="https://esdralrxesslaxvpyypa.supabase.co";
const IS_ARTIFACT=typeof window!=="undefined"&&(window.location.hostname.includes("claude.ai")||window.location.hostname==="localhost");

// ── حساب المؤسس — غيّر هذا الإيميل لإيميلك ──
const OWNER_EMAIL="sirfaisalalshehri@gmail.com"; // ← غيّره لإيميلك في Supabase
const isOwner=(email)=>email&&email.toLowerCase()===OWNER_EMAIL.toLowerCase();


/* ═══ PLAN HELPERS ═══════════════════════════════════════════
 *  free  → 10 سؤال مجاني فقط
 *  month → أسئلة غير محدودة + شرح + محاكاة + تتبع
 *  exam  → كل شيء + تحليل الضعف + خطة مذاكرة
 * ══════════════════════════════════════════════════════════ */
const PLAN_ACCESS={
  free:   {unlimitedQ:false, deepAnalysis:false, studyPlan:false, simulation:false},
  month:  {unlimitedQ:true,  deepAnalysis:false, studyPlan:false, simulation:true},
  exam:   {unlimitedQ:true,  deepAnalysis:true,  studyPlan:true,  simulation:true},
};
const canAccess=(trial,feature)=>{
  if(!trial) return false;
  if(trial.isSubscribed){
    const access=PLAN_ACCESS[trial.plan]||PLAN_ACCESS.month;
    return access[feature]??true;
  }
  return false;
};
const SUPABASE_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZHJhbHJ4ZXNzbGF4dnB5eXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzE0NTgsImV4cCI6MjA4ODc0NzQ1OH0.WiHlteyRHs8SUch4Q9msuZb5pWwLi9IWx9L_f5Fp_Ho";

/* استخدام Anthropic API مباشرة — يعمل داخل artifacts */
const callClaude=async(prompt,maxTok=800,userId=null)=>{
  const IS_ART=typeof window!=="undefined"&&window.location.hostname.includes("claude.ai");
  const url=IS_ART?"https://api.anthropic.com/v1/messages":"/api/claude";
  const headers={"Content-Type":"application/json"};
  const body=IS_ART
    ?JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:maxTok,messages:[{role:"user",content:prompt}]})
    :JSON.stringify({prompt,maxTokens:maxTok,userId});
  let lastErr;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const r=await fetch(url,{method:"POST",headers,body});
      const d=await r.json();
      // حد يومي تجاوز
      if(r.status===429||d.limitReached) throw Object.assign(new Error(d.error||"حد يومي"),{limitReached:true});
      if(!r.ok||d.error) throw new Error(d.error?.message||d.error||`HTTP ${r.status}`);
      if(IS_ART){
        if(!d.content?.length) throw new Error("empty response");
        return d.content.map(b=>b.text||"").join("").trim();
      }else{
        if(!d.text) throw new Error("no text in response");
        return d.text.trim();
      }
    }catch(e){
      lastErr=e;
      if(e.limitReached) throw e; // لا تعيد المحاولة
      if(attempt<2)await new Promise(r=>setTimeout(r,800*(attempt+1)));
    }
  }
  throw lastErr;
};

/* ═══════════════════ SUPABASE CACHE ═══════════════════ */

async function getCachedQuestion(topicName, difficulty){
  return null; // cache table not yet created
  try{
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_question_cache?topic_id=eq.${encodeURIComponent(topicName)}&difficulty=eq.${encodeURIComponent(difficulty)}&is_active=eq.true&order=used_count.asc&limit=5`,
      {headers:{"apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}`}}
    );
    const rows = await res.json();
    if(!Array.isArray(rows)||rows.length===0) return null;
    const row = rows[Math.floor(Math.random()*rows.length)];
    fetch(`${SUPABASE_URL}/rest/v1/ai_question_cache?id=eq.${row.id}`,{
      method:"PATCH",
      headers:{"apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}`,"Content-Type":"application/json"},
      body:JSON.stringify({used_count:(row.used_count||0)+1})
    }).catch(()=>{});
    return {
      question:row.question_text, options:row.options,
      correct:row.correct_index, explanation_title:row.explanation_title||"",
      steps:row.steps||[], tip:row.tip||"", shape:row.shape||null,
      topic:topicName, _fromCache:true
    };
  }catch(e){ return null; }
}

async function saveCachedQuestion(topicName, difficulty, q){
  return; // cache table not yet created
  try{
    const tres = await fetch(
      `${SUPABASE_URL}/rest/v1/topics?name=eq.${encodeURIComponent(topicName)}&select=id`,
      {headers:{"apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}`}}
    );
    const topics = await tres.json();
    if(!Array.isArray(topics)||topics.length===0) return;
    await fetch(`${SUPABASE_URL}/rest/v1/ai_question_cache`,{
      method:"POST",
      headers:{
        "apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}`,
        "Content-Type":"application/json","Prefer":"return=minimal"
      },
      body:JSON.stringify({
        topic_id:topics[0].id, difficulty,
        question_text:q.question, options:q.options,
        correct_index:q.correct, explanation_title:q.explanation_title||"",
        steps:q.steps||[], tip:q.tip||"", shape:q.shape||null, used_count:1
      })
    });
  }catch(e){}
}

/* ── اشتق القسم من الموضوع دائماً — لا تثق بـ settings.section ── */
function deriveSec(topic){
  if(TOPICS.لفظي.includes(topic))     return "لفظي";
  if(TOPICS["باب 0"].includes(topic)) return "كمي"; // تأسيسي = كمي للـ AI
  if(TOPICS.كمي.includes(topic))      return "كمي";
  return "كمي"; // fallback
}

const VERBAL_INSTRUCTIONS = {
  "إكمال الجمل":
    "اكتب جملة عربية كاملة حُذف منها كلمة أو عبارة. الخيارات الأربعة متقاربة. الصحيحة هي الأنسب سياقياً ولغوياً — لا مجرد الأشهر.",
  "التناظر اللفظي":
    "سؤال تناظر بصيغة (أ:ب = ج:؟). حدد العلاقة الدقيقة بين الزوج الأول (فئة/وظيفة/جزء/مضاد...) ثم طبّقها على الزوج الثاني. العلاقة متطابقة لا متشابهة.",
  "استيعاب المقروء":
    "اكتب فقرة عربية أصيلة (4-6 جمل) متماسكة، ثم اطرح سؤالاً واحداً استيعابياً عنها. الإجابة الصحيحة مستنبطة من النص حصراً — لا من المعرفة العامة.",
  "الخطأ السياقي":
    "اكتب جملة عربية سليمة إملائياً لكن تحتوي على كلمة واحدة خاطئة سياقياً (تكسر المنطق أو المعنى). الخيارات الأربعة تمثل كلمات مختلفة من الجملة، والمطلوب تحديد الكلمة الخاطئة.",
};

/* قائمة جميع الأبواب للعشوائية */
const ALL_TOPICS=[...TOPICS["باب 0"],...TOPICS.كمي,...TOPICS.لفظي];

async function genQuestion({topic, difficulty, avoidQuestion="", userId=null, userToken=null}){
  const section = deriveSec(topic);
  const isGeo   = GEO.includes(topic);
  const shapeHint = isGeo
    ? `"shape":{"type":"right_triangle"|"iso_triangle"|"rectangle"|"square"|"angle"|"circle","degrees":number,"unknown":"base"|"height"|"hyp"|"side"|"width"|"radius","labels":{"lBase":"...","lHeight":"...","lHyp":"...","lW":"...","lH":"...","lRadius":"...","lSide":"...","lDeg":"..."}}`
    : `"shape":null`;
  const verbalNote = VERBAL_INSTRUCTIONS[topic]?`\n${VERBAL_INSTRUCTIONS[topic]}`:"";
  const avoidNote  = avoidQuestion?`\n⛔ لا تعيد هذا السؤال: "${avoidQuestion.slice(0,40)}"`:"";

  // ══ 1. ابحث في قاعدة البيانات أولاً ══
  if(userId && userId!=="guest" && userToken){
    const cached=await sbGetQuestion(userId,userToken,{topic,section,difficulty});
    if(cached){
      // سجّل أن المستخدم رأى هذا السؤال
      sbMarkSeen(userId,userToken,cached.id);
      // حوّل من شكل DB إلى شكل الـ app
      let dbOptions,dbSteps;
      try{dbOptions=Array.isArray(cached.options)?cached.options:JSON.parse(cached.options||"[]");}catch(e){dbOptions=[];}
      try{dbSteps=Array.isArray(cached.steps)?cached.steps:JSON.parse(cached.steps||"[]");}catch(e){dbSteps=[];}
      if(Array.isArray(dbOptions)&&dbOptions.length===4) return {
        question         : cached.question_text,
        options          : dbOptions,
        correct          : typeof cached.correct==="number"?cached.correct:0,
        explanation_title: cached.explanation_title||"الحل",
        steps            : dbSteps,
        tip              : cached.tip||"",
        shape            : cached.shape||null,
        topic,
        _fromDB          : true,
        _dbId            : cached.id,
      };
    }
  }

  // ══ 2. DB فارغة أو مستخدم guest → استدعِ Claude ══
  const raw = await callClaude(
`أنت مدرس قدرات محترف. اكتب سؤالاً قياسياً في باب: ${topic} | مستوى: ${difficulty}${verbalNote}${avoidNote}
القواعد:
- السؤال باللغة العربية الفصحى
- استخدم الأرقام دائماً (25 وليس خمسة وعشرون)
- الخيارات الأربعة واضحة ومختلفة
- الشرح خطوة بخطوة بأسلوب تعليمي واضح
- كل خطوة جملة كاملة مفيدة (لا اختصار)
- النصيحة تكتيكية تساعد في حل مشابه
JSON فقط بلا أي نص إضافي:
{"question":"...","options":["...","...","...","..."],"correct":0,"explanation_title":"...","steps":["الخطوة 1: ...","الخطوة 2: ...","الخطوة 3: ...","النتيجة: ..."],"tip":"نصيحة عملية قصيرة","topic":"${topic}",${shapeHint}}`,650,userId
  );

  let parsed;
  try{
    const raw2=raw.replace(/```json|```/g,"").trim();
    const s=raw2.indexOf("{"),e=raw2.lastIndexOf("}");
    if(s===-1||e===-1) throw new Error("no JSON in response");
    parsed = JSON.parse(raw2.slice(s,e+1));
  }catch(err){ throw new Error("ردّ غير صالح من AI — أعد المحاولة"); }
  if(typeof parsed.correct!=="number"||parsed.correct<0||parsed.correct>3) parsed.correct=0;
  if(!Array.isArray(parsed.options)||parsed.options.length!==4) throw new Error("invalid options");
  if(!parsed.question||parsed.question.length<5) throw new Error("empty question");
  parsed.steps=Array.isArray(parsed.steps)?parsed.steps:[];
  parsed.tip=parsed.tip||"";
  parsed.explanation_title=parsed.explanation_title||"الحل";
  parsed.topic=parsed.topic||topic;
  parsed.shape=parsed.shape||null;

  // ══ 3. احفظ السؤال الجديد في DB (async — لا يبطئ المستخدم) ══
  if(userId && userId!=="guest" && userToken){
    sbSaveQuestion(userToken,parsed,{topic,section,difficulty})
      .then(newId=>{
        if(newId) sbMarkSeen(userId,userToken,newId);
      })
      .catch(()=>{});
  }

  return parsed;
}

async function genDiagnostic({section,topic}){
  const raw=await callClaude(`اكتب سؤال تشخيصي واحد لباب "${topic}" (${section}) لتحديد مستوى الطالب.
السؤال يجب أن يكشف إذا كان الطالب يملك الأساس أم لا.
JSON فقط: {"question":"...","options":["...","...","...","..."],"correct":0,"levelIfCorrect":"متقدم","levelIfWrong":"تأسيس","explanation":"جملة واحدة تشرح المفهاهيم الأساسية"}`);
  try{
    const clean=raw.replace(/```json|```/g,"").trim();
    const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
    if(s===-1||e===-1) throw new Error("no JSON");
    const p=JSON.parse(clean.slice(s,e+1));
    if(!p.question||!Array.isArray(p.options)||p.options.length!==4) throw new Error("invalid shape");
    if(typeof p.correct!=="number"||p.correct<0||p.correct>3) p.correct=0;
    p.levelIfCorrect=p.levelIfCorrect||"متقدم";
    p.levelIfWrong=p.levelIfWrong||"تأسيس";
    p.explanation=p.explanation||"";
    return p;
  }catch(err){ throw new Error("تعذّر توليد سؤال التشخيص"); }
}

async function genTeacherSummary({topic,history,userId=null}){
  const wrong=history.filter(h=>!h.ok).map(h=>`السؤال: "${h.q}" — أجاب: "${h.chosen}" والصحيح: "${h.correct}"`).join("\n");
  const raw=await callClaude(`أنت معلم ذكي تحلل أداء طالب في باب "${topic}".

نتيجته: ${history.filter(h=>h.ok).length}/${history.length} صحيح

الأخطاء:
${wrong||"لا أخطاء — أداء ممتاز!"}

اكتب تقييم شخصي دقيق وصريح (3 نقاط + خلاصة عملية).
JSON فقط: {"grade":"ممتاز"|"جيد"|"يحتاج مراجعة","headline":"جملة مميزة تلخص وضعه","insights":["ملاحظة 1","ملاحظة 2","ملاحظة 3"],"action":"توصية عملية واحدة للخطوة التالية","encourage":"جملة تشجيعية شخصية"}`,450);
  try{
    const clean=raw.replace(/```json|```/g,"").trim();
    const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
    if(s===-1||e===-1) throw new Error("no JSON");
    const p=JSON.parse(clean.slice(s,e+1));
    p.grade=p.grade||"جيد";
    p.headline=p.headline||"أداء معقول";
    p.insights=Array.isArray(p.insights)?p.insights:["واصل التدريب وستتحسن نتائجك."];
    p.action=p.action||"تابع أسئلة إضافية.";
    p.encourage=p.encourage||"أنت على الطريق الصحيح!";
    return p;
  }catch(err){
    return {grade:"جيد",headline:"تحليل مؤقت",insights:["واصل التدريب وستتحسن نتائجك."],action:"تابع أسئلة إضافية.",encourage:"أنت على الطريق الصحيح!"};
  }
}

/* ═══════════════════ NAV ═══════════════════ */
function Nav({isPub,go,userName,title,onLogout}){
  const[menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    if(!menuOpen) return;
    const close=()=>setMenuOpen(false);
    document.addEventListener("click",close);
    return()=>document.removeEventListener("click",close);
  },[menuOpen]);
  return(
    <>
      <nav style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 16px",height:58,
        borderBottom:"1px solid rgba(255,255,255,.06)",
        position:"sticky",top:0,zIndex:300,
        background:"rgba(5,9,26,.95)",
        backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"
      }}>
        {/* لوغو */}
        <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",flex:1,minWidth:0}}
          onClick={()=>{go(isPub?"landing":"dashboard");setMenuOpen(false);}}>
          <div className="logo" style={{flexShrink:0}}>ف</div>
          <div style={{minWidth:0}}>
            <p style={{fontSize:".95rem",fontWeight:900,color:"#fff",lineHeight:1}}>فهمني</p>
            <p style={{fontSize:".58rem",color:"#475569",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {isPub?"ذاكر بذكاء على القدرات":title||""}
            </p>
          </div>
        </div>
        {/* ديسكتوب */}
        <div className="nav-desktop" style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
          {isPub?(
            <>
              <button className="btn btn-g" style={{fontSize:".78rem",padding:"8px 14px"}} onClick={()=>go("login")}>دخول</button>
              <button className="btn btn-p" style={{fontSize:".78rem",padding:"8px 14px"}} onClick={()=>go("signup")}>ابدأ مجانًا ←</button>
            </>
          ):(
            <>
              <button className="btn btn-g" style={{fontSize:".72rem",padding:"7px 11px"}} onClick={()=>go("dashboard")}>🏠</button>
              <button className="btn btn-g" style={{fontSize:".72rem",padding:"7px 11px"}} onClick={()=>go("dashboard")}>↩ لوحتي</button>
              <div style={{padding:"5px 10px",borderRadius:9,background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",fontSize:".72rem",fontWeight:700,color:"#fdba74",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
              {onLogout&&<button className="btn btn-g" style={{fontSize:".7rem",padding:"6px 10px",color:"#64748b"}} onClick={onLogout}>خروج</button>}
            </>
          )}
        </div>
        {/* موبايل — زر ابدأ + هامبرقر */}
        <div className="nav-mob-row" style={{display:"none",alignItems:"center",gap:8,flexShrink:0}}>
          {isPub&&<button onClick={()=>go("signup")} style={{
            background:"linear-gradient(135deg,#f97316,#fb923c)",border:"none",
            borderRadius:10,padding:"9px 14px",cursor:"pointer",color:"#0a0f1e",
            fontSize:".82rem",fontWeight:800,fontFamily:"Cairo,sans-serif",whiteSpace:"nowrap"
          }}>ابدأ ←</button>}
          <button onClick={e=>{e.stopPropagation();setMenuOpen(p=>!p);}} style={{
            background:menuOpen?"rgba(249,115,22,.12)":"rgba(255,255,255,.06)",
            border:`1.5px solid ${menuOpen?"rgba(249,115,22,.35)":"rgba(255,255,255,.1)"}`,
            borderRadius:10,width:40,height:40,cursor:"pointer",
            color:menuOpen?"#f97316":"#94a3b8",fontSize:"1rem",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all .18s"
          }}>{menuOpen?"✕":"☰"}</button>
        </div>
      </nav>
      {/* قائمة موبايل — تظهر أسفل النافبار مباشرة */}
      {menuOpen&&(
        <div className="nav-mob-row" onClick={e=>e.stopPropagation()} style={{
          display:"none",flexDirection:"column",gap:8,padding:"14px 16px 18px",
          background:"rgba(4,7,20,.98)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(249,115,22,.12)",
          position:"sticky",top:58,zIndex:299,
          boxShadow:"0 10px 40px rgba(0,0,0,.7)"
        }}>
          {isPub?(
            <>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:".92rem"}}
                onClick={()=>{go("login");setMenuOpen(false);}}>تسجيل الدخول</button>
              <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:".92rem"}}
                onClick={()=>{go("signup");setMenuOpen(false);}}>ابدأ مجانًا — 10 سؤال ←</button>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:".85rem",color:"#64748b"}}
                onClick={()=>{go("pricing");setMenuOpen(false);}}>عرض الأسعار</button>
            </>
          ):(
            <>
              {userName&&<div style={{padding:"11px",borderRadius:11,background:"rgba(249,115,22,.07)",border:"1px solid rgba(249,115,22,.15)",fontSize:".85rem",fontWeight:700,color:"#fdba74",textAlign:"center"}}>👤 {userName}</div>}
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:".88rem"}} onClick={()=>{go("dashboard");setMenuOpen(false);}}>↩ لوحة التحكم</button>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:".88rem"}} onClick={()=>{go("roadmap");setMenuOpen(false);}}>🗺️ خريطة المسار</button>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:".88rem"}} onClick={()=>{go("session");setMenuOpen(false);}}>📝 ابدأ جلسة</button>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:".88rem"}} onClick={()=>{go("dashboard");setMenuOpen(false);}}>🏠 الرئيسية</button>
              {onLogout&&<button className="btn btn-g" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:".88rem",color:"#f87171"}} onClick={()=>{onLogout();setMenuOpen(false);}}>تسجيل الخروج</button>}
            </>
          )}
        </div>
      )}
    </>
  );
}

function PlacementQuiz({profile,onFinish}){
  const[idx,setIdx]=useState(0);
  const[sel,setSel]=useState(null);
  const[revealed,setRevealed]=useState(false);
  const[answers,setAnswers]=useState([]);
  const q=PLACEMENT_Q[idx],pct=Math.round((idx/PLACEMENT_Q.length)*100),isLast=idx===PLACEMENT_Q.length-1;
  const check=()=>{if(sel!==null)setRevealed(true);};
  const advance=()=>{
    const upd=[...answers,{sec:q.sec,ok:sel===q.correct}];
    if(isLast){onFinish(upd);return;}
    setAnswers(upd);setIdx(p=>p+1);setSel(null);setRevealed(false);
  };
  const ok=sel===q.correct;
  return(<div className="placement-grid">
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="gl" style={{padding:"18px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:".75rem",color:"#64748b"}}><span style={{color:"#f97316",fontWeight:700}}>{pct}%</span><span>السؤال {idx+1} من {PLACEMENT_Q.length}</span></div>
        <div className="pt"><div className="pf" style={{width:`${pct}%`}}/></div>
      </div>
      <div className="gl si gl-pad-lg" style={{padding:"28px"}}>
        <div style={{display:"flex",gap:8,marginBottom:18}}><span className={`badge ${q.sec==="كمي"?"b-o":"b-c"}`}>{q.sec}</span>{revealed&&<span className={`badge pi ${ok?"b-g":"b-r"}`}>{ok?"✓ صحيح":"✗ خطأ"}</span>}</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:"#fff",lineHeight:1.8,marginBottom:22}}>{q.q}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {q.opts.map((opt,i)=>{const chosen=sel===i,showOk=revealed&&i===q.correct,showBad=revealed&&chosen&&i!==q.correct;return(<button key={i} className={`ans ${showOk?"ok":showBad?"bad":chosen?"sel":""} ${revealed?"lk":""}`} onClick={()=>{if(!revealed)setSel(i);}}><span>{opt}</span><div className="opt-l">{String.fromCharCode(0x0627+i)}</div></button>);})}
        </div>
        {revealed&&<div className="au" style={{marginTop:14,padding:"13px 16px",borderRadius:14,background:ok?"rgba(74,222,128,.07)":"rgba(248,113,113,.07)",border:`1px solid ${ok?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"}`}}><p style={{fontSize:".72rem",fontWeight:700,color:ok?"#86efac":"#fca5a5",marginBottom:4}}>{ok?"✓ ممتاز!":"✗ الإجابة الصحيحة: "+q.opts[q.correct]}</p><p style={{fontSize:".82rem",lineHeight:1.8,color:"#94a3b8"}}>{q.why}</p></div>}
        <div style={{marginTop:20,display:"flex",justifyContent:"flex-end"}}>{!revealed?<button className="btn btn-p" disabled={sel===null} onClick={check}>تحقق</button>:<button className="btn btn-p" onClick={advance}>{isLast?"اعرض النتيجة ←":"التالي →"}</button>}</div>
      </div>
    </div>
    <div className="gl placement-sidebar" style={{padding:"20px",alignSelf:"start"}}>
      <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:13}}>ملف الطالب</p>
      {[["الهدف",profile.goal],["الثقة",profile.confidence],["القسم",profile.section],["الوقت",`${profile.minutes} دقيقة`]].map(([k,v])=>(<div key={k} className="gl2" style={{padding:"9px 13px",display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:".77rem",color:"#94a3b8"}}>{k}</span><span style={{fontSize:".77rem",fontWeight:700,color:"#f97316"}}>{v}</span></div>))}
      <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:7}}>{PLACEMENT_Q.map((_,i)=>{const a=answers[i],cur=i===idx;return(<div key={i} style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:25,height:25,borderRadius:7,fontSize:".68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:a?a.ok?"rgba(74,222,128,.12)":"rgba(248,113,113,.1)":cur?"rgba(249,115,22,.2)":"rgba(255,255,255,.04)",border:`1px solid ${a?a.ok?"rgba(74,222,128,.3)":"rgba(248,113,113,.25)":cur?"rgba(249,115,22,.4)":"rgba(255,255,255,.08)"}`,color:a?a.ok?"#86efac":"#fca5a5":cur?"#fdba74":"#475569"}}>{a?(a.ok?"✓":"✗"):i+1}</div><span style={{fontSize:".74rem",color:cur?"#fff":"#475569",fontWeight:cur?700:400}}>سؤال {i+1} ({PLACEMENT_Q[i].sec})</span></div>);})}</div>
    </div>
  </div>);
}

/* ═══════════════════ DIAGNOSTIC QUESTION ═══════════════════ */
function DiagnosticQ({topic,section,onResult,onSkip}){
  const[q,setQ]=useState(null);
  const[loading,setLoading]=useState(true);
  const[sel,setSel]=useState(null);
  const[revealed,setRevealed]=useState(false);
  useEffect(()=>{genDiagnostic({section,topic}).then(setQ).catch(()=>setQ(null)).finally(()=>setLoading(false));},[]);
  if(loading)return(<div className="gl" style={{padding:"48px",textAlign:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}><div className="spin spin-lg"/><p style={{color:"#a78bfa",fontSize:".9rem"}}>🧠 فهمني يشخّص مستواك في {topic}...</p></div></div>);
  if(!q)return(<div className="gl" style={{padding:"28px",textAlign:"center"}}><p style={{color:"#64748b",marginBottom:14}}>تعذّر توليد سؤال التشخيص</p><button className="btn btn-p" onClick={onSkip}>تخطى وابدأ مباشرة</button></div>);
  const ok=sel===q.correct;
  return(<div style={{display:"grid",gap:14}}>
    <div className="gl" style={{padding:"28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:18}}>
        <div><div className="diag-badge">🧪 سؤال التشخيص</div><p style={{marginTop:8,fontSize:".8rem",color:"#64748b"}}>سؤال واحد يحدد من أين تبدأ في <strong style={{color:"#c4b5fd"}}>{topic}</strong></p></div>
        <button className="btn btn-g" style={{fontSize:".78rem"}} onClick={onSkip}>تخطى</button>
      </div>
      <h2 style={{fontSize:"1.1rem",fontWeight:800,color:"#fff",lineHeight:1.8,marginBottom:22}}>{q.question}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>{q.options.map((opt,i)=>{const chosen=sel===i,showOk=revealed&&i===q.correct,showBad=revealed&&chosen&&i!==q.correct;return(<button key={i} className={`ans ${showOk?"ok":showBad?"bad":chosen?"sel":""} ${revealed?"lk":""}`} onClick={()=>{if(!revealed)setSel(i);}}><span>{opt}</span><div className="opt-l">{String.fromCharCode(0x0627+i)}</div></button>);})}</div>
      {revealed&&(<div className="au" style={{marginTop:14,padding:"14px 18px",borderRadius:14,background:ok?"rgba(74,222,128,.07)":"rgba(248,113,113,.06)",border:`1px solid ${ok?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"}`}}>
        <p style={{fontSize:".8rem",lineHeight:1.8,color:"#94a3b8",marginBottom:12}}>{q.explanation}</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <span className={`badge ${ok?"b-g":"b-v"}`}>{ok?`✓ مستواك: ${q.levelIfCorrect}`:`⭐ سنبدأ من: ${q.levelIfWrong}`}</span>
          <button className="btn btn-p" style={{fontSize:".82rem",padding:"9px 18px"}} onClick={()=>onResult(ok?q.levelIfCorrect:q.levelIfWrong)}>ابدأ الجلسة بهذا المستوى ←</button>
        </div>
      </div>)}
      {!revealed&&<div style={{marginTop:20,display:"flex",justifyContent:"flex-end"}}><button className="btn btn-p" disabled={sel===null} onClick={()=>setRevealed(true)}>تحقق من الإجابة</button></div>}
    </div>
  </div>);
}


/* ═══════════════════ TEACHER SUMMARY ═══════════════════ */
function TeacherSummary({topic,history,onContinue,onReview,plan="free"}){
  const[summary,setSummary]=useState(null);
  const[loading,setLoading]=useState(true);
  const correct=history.filter(h=>h.ok).length;
  const acc=Math.round((correct/history.length)*100);
  const gradeColor=acc>=80?"#4ade80":acc>=60?"#f97316":"#f87171";
  useEffect(()=>{genTeacherSummary({topic,history}).then(setSummary).catch(()=>setSummary({grade:"—",headline:"تحليل غير متاح حاليًا",insights:["واصل التدريب وستتحسن نتائجك."],action:"تابع أسئلة إضافية.",encourage:"أنت على الطريق الصحيح!"})).finally(()=>setLoading(false));},[]);
  return(<div className="teacher-card">
    {/* Header */}
    <div style={{padding:"32px 30px",background:"linear-gradient(135deg,rgba(249,115,22,.15),rgba(139,92,246,.12))",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
        <div>
          <span className="badge b-v" style={{marginBottom:12}}>🎓 وضع المعلم — بعد 5 أسئلة</span>
          <h2 style={{fontSize:"1.6rem",fontWeight:900,color:"#fff",marginBottom:6}}>تقييمك في <span style={{color:"#f97316"}}>{topic}</span></h2>
          <p style={{fontSize:".82rem",color:"#64748b"}}>فهمني حلّل إجاباتك بالتفصيل</p>
        </div>
        <Ring pct={acc} size={96} color={gradeColor}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:22}}>
        {[["الصحيح",`${correct}/${history.length}`,"#4ade80"],["الدقة",`${acc}%`,gradeColor],["الجلسة","5 أسئلة","#a78bfa"]].map(([l,v,c],i)=>(<div key={i} className="gl2" style={{padding:"13px",textAlign:"center"}}><p style={{fontSize:".68rem",color:"#64748b"}}>{l}</p><p style={{fontSize:"1.25rem",fontWeight:900,color:c,marginTop:5}}>{v}</p></div>))}
      </div>
    </div>
    {/* AI analysis */}
    <div style={{padding:"26px 28px",background:"rgba(5,9,26,.8)"}}>
      {loading?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"24px 0"}}><div className="dots"><span/><span/><span/></div><p style={{color:"#64748b",fontSize:".85rem"}}>المعلم يحلل أداءك...</p></div>):summary&&(<>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"14px 18px",borderRadius:16,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
          <span style={{fontSize:"1.5rem"}}>{(summary?.grade==="ممتاز"?"🏆":summary?.grade==="جيد"?"⭐":"📌")}</span>
          <div><p style={{fontSize:".68rem",color:gradeColor,fontWeight:700,marginBottom:3}}>{summary?.grade||"—"}</p><p style={{fontSize:".92rem",fontWeight:800,color:"#fff"}}>{summary?.headline||""}</p></div>
        </div>
        <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:12}}>▸ ملاحظات المعلم</p>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {(summary?.insights||[]).map((ins,i)=>(<div key={i} className="teacher-insight" style={{animationDelay:`${i*.1}s`}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:22,height:22,borderRadius:7,background:"rgba(249,115,22,.2)",border:"1px solid rgba(249,115,22,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".64rem",fontWeight:900,color:"#f97316",flexShrink:0,marginTop:2}}>{i+1}</div><p style={{fontSize:".84rem",lineHeight:1.75,color:"#cbd5e1"}}>{ins}</p></div></div>))}
        </div>
        <div className="gl-o" style={{padding:"14px 17px",marginBottom:18}}>
          <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,marginBottom:5}}>⚡ الخطوة التالية</p>
          <p style={{fontSize:".85rem",lineHeight:1.75,color:"#fdba74"}}>{summary?.action||""}</p>
        </div>
        <div className="gl-v" style={{padding:"13px 17px",marginBottom:22}}>
          <p style={{fontSize:".83rem",lineHeight:1.75,color:"#c4b5fd"}}>💪 {summary?.encourage||""}</p>
        </div>
        {/* تحليل الضعف — exam فقط */}
        {plan==="exam"?(
          <div style={{padding:"14px 18px",borderRadius:14,marginBottom:18,
            background:"rgba(167,139,250,.07)",border:"1px solid rgba(167,139,250,.2)"}}>
            <p style={{fontSize:".68rem",color:"#a78bfa",fontWeight:700,marginBottom:8}}>🔬 تحليل نقاط الضعف</p>
            <p style={{fontSize:".8rem",color:"#cbd5e1",lineHeight:1.7}}>{summary?.headline||""}</p>
          </div>
        ):(
          <div style={{padding:"13px 18px",borderRadius:14,marginBottom:18,
            background:"rgba(255,255,255,.03)",border:"1px dashed rgba(167,139,250,.2)",
            display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:"1.1rem"}}>🔒</span>
            <div>
              <p style={{fontSize:".75rem",color:"#a78bfa",fontWeight:700}}>تحليل نقاط الضعف</p>
              <p style={{fontSize:".68rem",color:"#475569"}}>متاح في باقة المميز 99 ريال</p>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
          <button className="btn btn-v" onClick={onReview}>📋 راجع أخطائك</button>
          <button className="btn btn-p" style={{padding:"12px 24px"}} onClick={onContinue}>واصل التدريب ←</button>
        </div>
      </>)}
    </div>
  </div>);
}

/* ═══════════════════ REVIEW MODE ═══════════════════ */
function ReviewMode({mistakes,go,onRedo}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);
  const[active,setActive]=useState(null);
  const[redone,setRedone]=useState([]);
  const total=mistakes.length,solved=redone.length;
  return(<div style={{display:"grid",gap:16}}>
    <div className="gl gl-pad-lg" style={{padding:"32px"}}>
      <span className="badge b-r" style={{marginBottom:12}}>📋 وضع المراجعة</span>
      <h1 style={{fontSize:"1.8rem",fontWeight:900,color:"#fff",marginBottom:8}}>الأسئلة التي أخطأت فيها</h1>
      <p style={{color:"#64748b",lineHeight:1.8}}>راجع كل سؤال بهدوء وافهم لماذا أخطأت.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:20}}>
        {[["إجمالي الأخطاء",total,"#f87171"],["راجعت",solved,"#4ade80"],["متبقي",total-solved,"#f97316"]].map(([l,v,c],i)=>(<div key={i} className="gl2" style={{padding:"15px",textAlign:"center"}}><p style={{fontSize:".68rem",color:"#64748b"}}>{l}</p><p style={{fontSize:"1.4rem",fontWeight:900,color:c,marginTop:5}}>{v}</p></div>))}
      </div>
      {solved===total&&total>0&&(<div className="gl-g au" style={{padding:"16px 20px",marginTop:16}}><p style={{fontWeight:800,color:"#86efac",fontSize:"1rem"}}>🎉 أنهيت مراجعة كل الأخطاء! ممتاز.</p></div>)}
    </div>
    <div style={{display:"grid",gap:10}}>
      {mistakes.length===0&&(<div className="gl" style={{padding:"32px",textAlign:"center"}}><p style={{fontSize:"1.8rem",marginBottom:12}}>🎯</p><p style={{fontWeight:800,color:"#fff",marginBottom:8}}>ما عندك أخطاء!</p><p style={{color:"#64748b"}}>أداؤك ممتاز — كل إجاباتك كانت صحيحة.</p></div>)}
      {mistakes.map((m,i)=>{
        const isOpen=active===i,isDone=redone.includes(i);
        return(<div key={i}>
          <div className={`review-item ${isDone?"solved":""}`} onClick={()=>setActive(isOpen?null:i)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:7,marginBottom:8,flexWrap:"wrap"}}>
                  <span className={`badge ${m.section==="كمي"?"b-o":"b-c"}`}>{m.section}</span>
                  <span className="badge b-v">{m.topic}</span>
                  {isDone&&<span className="badge b-g">✓ راجعت</span>}
                </div>
                <p style={{fontSize:".88rem",fontWeight:700,color:isDone?"#86efac":"#fca5a5",lineHeight:1.75}}>{m.q}</p>
              </div>
              <span style={{color:"#64748b",fontSize:"1rem",flexShrink:0,marginTop:2}}>{isOpen?"▲":"▼"}</span>
            </div>
          </div>
          {isOpen&&(<div className="gl si" style={{padding:"20px",marginTop:4}}>
            <p style={{fontSize:".68rem",color:"#f87171",fontWeight:700,marginBottom:8}}>إجابتك: <span style={{color:"#fca5a5"}}>{m.chosen}</span></p>
            <p style={{fontSize:".68rem",color:"#4ade80",fontWeight:700,marginBottom:14}}>الصحيحة: <span style={{color:"#86efac"}}>{m.correctAns}</span></p>
            {m.steps&&(<><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>▸ خطوات الحل</p><div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>{m.steps.map((s,si)=>(<div key={si} className="step"><div className="snum">{si+1}</div><p style={{fontSize:".83rem",lineHeight:1.75,color:"#cbd5e1"}}>{s}</p></div>))}</div></>)}
            {m.tip&&(<div className="gl-o" style={{padding:"12px 16px",marginBottom:14}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,marginBottom:4}}>💡 النصيحة</p><p style={{fontSize:".82rem",color:"#fdba74"}}>{m.tip}</p></div>)}
            {!isDone&&(<button className="btn btn-g" style={{fontSize:".82rem"}} onClick={()=>{setRedone(p=>[...p,i]);setActive(null);}}>✓ فهمت هذا السؤال</button>)}
          </div>)}
        </div>);
      })}
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
      <button className="btn btn-g" onClick={()=>go("dashboard")}>↩ لوحة الطالب</button>
      {onRedo&&<button className="btn btn-p" onClick={onRedo}>تدريب على نفس الباب ←</button>}
    </div>
  </div>);
}

/* ═══════════════════ SIMULATION MODE ═══════════════════ */
/*
  اختبار قياس الحقيقي:
  علمي  → 110 سؤال (52 كمي + 68 لفظي) · 150 دقيقة
  أدبي  → 110 سؤال (30 كمي + 90 لفظي) · 150 دقيقة
  توليد الأسئلة: سؤال بسؤال (prefetch التالي أثناء الإجابة)
*/
const QIYYAS={
  علمي: {total:120, quant:52, verbal:68, minutes:150, label:"المسار العلمي"},
  أدبي: {total:120, quant:30, verbal:90, minutes:150, label:"المسار الأدبي"},
};

function buildTopicPlan(track){
  const{quant,verbal}=QIYYAS[track];
  const qTopics=TOPICS.كمي, vTopics=TOPICS.لفظي;
  const plan=[];
  for(let i=0;i<quant;i++) plan.push({sec:"كمي",topic:qTopics[i%qTopics.length]});
  for(let i=0;i<verbal;i++) plan.push({sec:"لفظي",topic:vTopics[i%vTopics.length]});
  /* خلط عشوائي (Fisher-Yates) */
  for(let i=plan.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[plan[i],plan[j]]=[plan[j],plan[i]];}
  return plan;
}

function SimMode({settings,go,updateUser,addMistake,trial={}}){  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});if(!trial.isSubscribed&&trial.used>=trial.limit){go("paywall");}},[]); 
  const[phase,setPhase]=useState("setup");
  const[difficulty,setDifficulty]=useState("متوسط");
  const[track,setTrack]=useState("علمي");
  const[plan,setPlan]=useState([]);      // [{sec,topic}] × 120
  const[idx,setIdx]=useState(0);
  const[curQ,setCurQ]=useState(null);    // السؤال الحالي
  const[nextQData,setNextQData]=useState(null); // prefetch
  const[loadingQ,setLoadingQ]=useState(false);
  const[sel,setSel]=useState(null);
  const[answers,setAnswers]=useState([]); // [{chosen,correct,ok,topic,q,options,steps,tip}]
  const[qTimes,setQTimes]=useState([]);
  const[qStart,setQStart]=useState(0);
  const[timeLeft,setTimeLeft]=useState(9000);
  const[showCard,setShowCard]=useState(false);
  const[startLoading,setStartLoading]=useState(false);
  const sounds=useNatureSounds();
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const totalQ=QIYYAS[track].total;
  const timeTotal=QIYYAS[track].minutes*60;

  /* ── countdown timer ── */
  useEffect(()=>{
    if(phase!=="running")return;
    if(timeLeft<=0){doFinish();return;}
    const id=setTimeout(()=>setTimeLeft(p=>p-1),1000);
    return()=>clearTimeout(id);
  },[phase,timeLeft]);

  /* ── fetch a single question for given plan item ── */
  const fetchOne=async(item,diff)=>{
    return await genQuestion({topic:item.topic,difficulty:diff});
  };

  /* ── start exam ── */
  const startSim=async()=>{
    setStartLoading(true);
    const p=buildTopicPlan(track);
    setPlan(p);
    try{
      const first=await fetchOne(p[0],difficulty);
      setCurQ({...first,topic:p[0].topic,sec:p[0].sec});
      /* prefetch second */
      if(p.length>1) fetchOne(p[1],difficulty).then(q=>setNextQData({...q,topic:p[1].topic,sec:p[1].sec}));
    }catch(e){setStartLoading(false);return;}
    setIdx(0);setSel(null);setAnswers([]);setQTimes([]);
    setTimeLeft(timeTotal);setQStart(Date.now());
    setPhase("running");setStartLoading(false);
  };

  /* ── move to next question ── */
  const goNext=async(chosenSel,curPlan,curIdx,curAnswers,curTimes)=>{
    const t=Math.round((Date.now()-qStart)/1000);
    const ok=chosenSel===curQ.correct;
    const entry={chosen:chosenSel,correct:curQ.correct,ok,topic:curQ.topic,sec:curQ.sec,
      q:curQ.question,options:curQ.options,steps:curQ.steps,tip:curQ.tip};
    const newAnswers=[...curAnswers,entry];
    const newTimes=[...curTimes,t];
    setAnswers(newAnswers);setQTimes(newTimes);
    if(!ok) addMistake({ok,q:curQ.question,topic:curQ.topic,section:curQ.sec,
      chosen:curQ.options[chosenSel],correctAns:curQ.options[curQ.correct],
      steps:curQ.steps,tip:curQ.tip});
    updateUser(ok);

    const next=curIdx+1;
    if(next>=totalQ){doFinish(newAnswers);return;}
    setIdx(next);setSel(null);setQStart(Date.now());
    setLoadingQ(false);

    /* use prefetched or fetch fresh */
    if(nextQData){
      setCurQ(nextQData);setNextQData(null);
      /* prefetch next+1 */
      if(next+1<curPlan.length)
        fetchOne(curPlan[next+1],difficulty).then(q=>setNextQData({...q,topic:curPlan[next+1].topic,sec:curPlan[next+1].sec})).catch(()=>{});
    } else {
      setLoadingQ(true);
      try{
        const q=await fetchOne(curPlan[next],difficulty);
        setCurQ({...q,topic:curPlan[next].topic,sec:curPlan[next].sec});
        if(next+1<curPlan.length)
          fetchOne(curPlan[next+1],difficulty).then(q2=>setNextQData({...q2,topic:curPlan[next+1].topic,sec:curPlan[next+1].sec})).catch(()=>{});
      }catch(e){}finally{setLoadingQ(false);}
    }
  };

  const doFinish=(ans=answers)=>{setPhase("done");};

  const correct=answers.filter(a=>a.ok).length;
  const acc=answers.length?Math.round((correct/answers.length)*100):0;
  const avgT=qTimes.length?Math.round(qTimes.reduce((a,b)=>a+b,0)/qTimes.length):0;

  /* ══════ SETUP ══════ */
  if(phase==="setup")return(
    <div style={{display:"grid",gap:16}}>
      <div className="gl" style={{padding:"34px 32px"}}>
        <span className="badge b-v" style={{marginBottom:13}}>⚡ وضع المحاكاة</span>
        <h1 style={{fontSize:"1.8rem",fontWeight:900,color:"#fff",marginBottom:8}}>
          محاكاة اختبار قياس الحقيقي
        </h1>
        <p style={{color:"#64748b",lineHeight:1.85,maxWidth:520}}>
          نفس عدد الأسئلة ونفس الوقت — بدون شرح أثناء الاختبار.
          التحليل الكامل يظهر بعد الانتهاء.
        </p>
      </div>

      {/* Track info cards */}
      <div className="rg-2 sim-tracks" style={{gap:12}}>
        {Object.entries(QIYYAS).map(([k,v])=>(
          <button key={k} onClick={()=>setTrack(k)} style={{
            padding:"20px",borderRadius:16,cursor:"pointer",textAlign:"right",
            border:`2px solid ${track===k?"rgba(249,115,22,.5)":"rgba(255,255,255,.07)"}`,
            background:track===k?"rgba(249,115,22,.08)":"rgba(255,255,255,.03)",
            transition:"all .2s"
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <span style={{
                padding:"3px 10px",borderRadius:99,fontSize:".65rem",fontWeight:700,
                background:track===k?"rgba(249,115,22,.2)":"rgba(255,255,255,.06)",
                border:`1px solid ${track===k?"rgba(249,115,22,.4)":"rgba(255,255,255,.1)"}`,
                color:track===k?"#f97316":"#64748b"
              }}>{track===k?"✓ محدد":k}</span>
              <span style={{fontSize:"1.5rem"}}>{k==="علمي"?"🔬":"📚"}</span>
            </div>
            <p style={{fontWeight:900,color:"#fff",fontSize:"1.1rem",marginBottom:10}}>{v.label}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              {[["الأسئلة",`${v.total} سؤال`],["الوقت",`${v.minutes} دقيقة`],["التوزيع",`${v.quant}ك·${v.verbal}ل`]].map(([lbl,val])=>(
                <div key={lbl} style={{padding:"8px",borderRadius:10,background:"rgba(255,255,255,.04)",textAlign:"center"}}>
                  <p style={{fontSize:".6rem",color:"#475569",marginBottom:3}}>{lbl}</p>
                  <p style={{fontSize:".78rem",fontWeight:800,color:"#e2e8f0"}}>{val}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Difficulty only */}
      <div className="gl" style={{padding:"22px"}}>
        <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:14}}>
          مستوى الصعوبة
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[
            {v:"سهل",d:"للمراجعة والتأسيس",icon:"🌱",color:"#4ade80"},
            {v:"متوسط",d:"مثل قياس الفعلي",icon:"⚡",color:"#f97316"},
            {v:"صعب",d:"للمتحدي والتميز",icon:"🔥",color:"#f87171"},
          ].map(({v,d,icon,color})=>(
            <button key={v} onClick={()=>setDifficulty(v)} style={{
              padding:"18px 14px",borderRadius:14,cursor:"pointer",textAlign:"center",
              border:`2px solid ${difficulty===v?color+"55":"rgba(255,255,255,.07)"}`,
              background:difficulty===v?color+"0d":"rgba(255,255,255,.03)",
              transition:"all .2s"
            }}>
              <div style={{fontSize:"1.6rem",marginBottom:8}}>{icon}</div>
              <p style={{fontWeight:900,color:difficulty===v?color:"#fff",fontSize:".9rem",marginBottom:4}}>{v}</p>
              <p style={{fontSize:".72rem",color:"#475569",lineHeight:1.5}}>{d}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div style={{
        padding:"22px 26px",borderRadius:18,
        background:"linear-gradient(135deg,rgba(167,139,250,.1),rgba(249,115,22,.06))",
        border:"1px solid rgba(167,139,250,.2)",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14
      }}>
        <div>
          <p style={{fontWeight:900,color:"#c4b5fd",fontSize:"1rem"}}>
            {QIYYAS[track].total} سؤال · {QIYYAS[track].minutes} دقيقة · {difficulty}
          </p>
          <p style={{fontSize:".78rem",color:"#475569",marginTop:4}}>
            {QIYYAS[track].quant} كمي + {QIYYAS[track].verbal} لفظي — مخلوطة عشوائياً
          </p>
        </div>
        <button className="btn btn-p" style={{padding:"13px 30px",fontSize:"1rem"}}
          disabled={startLoading} onClick={startSim}>
          {startLoading?<><div className="spin"/> يحضّر أول سؤال...</>:"ابدأ الاختبار ←"}
        </button>
      </div>
    </div>
  );

  /* ══════ RUNNING ══════ */
  if(phase==="running"){
    const secColor=curQ?.sec==="كمي"?"#f97316":"#22d3ee";
    const timePct=(timeLeft/timeTotal)*100;
    const timeWarning=timeLeft<600; // أقل من 10 دقائق
    return(
      <div className="rg-sim" style={{gap:13}}>

        {/* Main */}
        <div style={{display:"flex",flexDirection:"column",gap:13}}>

          {/* Top bar */}
          <div className="gl mob-compact" style={{padding:"13px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9,marginBottom:10}}>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span className="badge b-v">⚡ قياس</span>
                {curQ&&<span className={`badge ${curQ.sec==="كمي"?"b-o":"b-c"}`}>{curQ.sec}</span>}
                {curQ&&<span className="badge b-ai">{curQ.topic}</span>}
              </div>
              <div style={{display:"flex",gap:9,alignItems:"center"}}>
                <SoundPanel sounds={sounds}/>
                <span style={{fontSize:".8rem",fontWeight:700,color:"#94a3b8"}}>
                  {idx+1} <span style={{color:"#475569"}}>/ {totalQ}</span>
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="pt">
              <div style={{height:"100%",borderRadius:99,
                background:`linear-gradient(90deg,${secColor},${secColor}88)`,
                width:`${Math.round((idx/totalQ)*100)}%`,transition:"width .4s ease"}}/>
            </div>
          </div>

          {/* Question */}
          {loadingQ?(
            <div className="gl" style={{padding:"60px",textAlign:"center"}}>
              <div className="spin spin-lg" style={{margin:"0 auto 14px"}}/>
              <p style={{color:"#64748b"}}>يولّد السؤال التالي...</p>
            </div>
          ):(
            <div className="gl si" style={{padding:"28px",minHeight:280}}>
              {curQ?.shape&&<ShapeRender shape={curQ.shape}/>}
              <p style={{fontSize:".7rem",color:"#475569",marginBottom:10,fontWeight:600}}>
                سؤال {idx+1} من {totalQ}
              </p>
              <h2 style={{fontSize:"1.12rem",fontWeight:800,color:"#fff",lineHeight:1.9,marginBottom:22}}>
                {curQ?.question}
              </h2>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {curQ?.options?.map((opt,i)=>(
                  <button key={i} className={`ans ${sel===i?"sel":""}`}
                    onClick={()=>setSel(i)}
                    style={{transition:"all .15s"}}>
                    <span>{opt}</span>
                    <div className="opt-l">{String.fromCharCode(0x0627+i)}</div>
                  </button>
                ))}
              </div>
              <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{fontSize:".73rem",color:"#334155"}}>
                  {sel===null?"اختر إجابة للمتابعة":""}
                </p>
                <button className="btn btn-p"
                  disabled={sel===null||loadingQ}
                  style={{padding:"11px 24px"}}
                  onClick={()=>goNext(sel,plan,idx,answers,qTimes)}>
                  {idx===totalQ-1?"أنهِ الاختبار ←":"التالي →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:11,alignSelf:"start",position:"sticky",top:20}}>

          {/* Timer */}
          <div className="gl" style={{padding:"18px 16px",textAlign:"center",
            border:`1.5px solid ${timeWarning?"rgba(248,113,113,.3)":"rgba(255,255,255,.07)"}`,
            background:timeWarning?"rgba(248,113,113,.05)":"rgba(5,9,26,.8)"}}>
            <p style={{fontSize:".65rem",fontWeight:700,letterSpacing:".08em",
              color:timeWarning?"#f87171":"#f97316",marginBottom:7}}>
              {timeWarning?"⚠ الوقت ينفد":"⏱ الوقت المتبقي"}
            </p>
            <p style={{
              fontSize:"clamp(1.8rem,6vw,2.6rem)",fontWeight:900,letterSpacing:"0.04em",
              fontFamily:"monospace",lineHeight:1,
              color:timeLeft<300?"#f87171":timeWarning?"#f97316":"#fff"
            }}>{fmt(timeLeft)}</p>
            <div className="pt" style={{marginTop:10}}>
              <div style={{height:"100%",borderRadius:99,transition:"width 1s linear",
                width:`${timePct}%`,
                background:timeWarning?"linear-gradient(90deg,#f87171,#fb923c)":"linear-gradient(90deg,#f97316,#22d3ee)"
              }}/>
            </div>
            <p style={{fontSize:".67rem",color:"#334155",marginTop:6}}>
              {QIYYAS[track].minutes} دقيقة إجمالاً
            </p>
          </div>

          {/* Progress stats */}
          <div className="gl" style={{padding:"14px"}}>
            <p style={{fontSize:".65rem",color:"#64748b",fontWeight:700,marginBottom:11}}>التقدم</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[["المجاب",`${answers.length}`,"#f97316"],[`المتبقي`,`${totalQ-answers.length}`,"#475569"]].map(([l,v,c])=>(
                <div key={l} style={{padding:"9px",borderRadius:10,background:"rgba(255,255,255,.04)",textAlign:"center"}}>
                  <p style={{fontSize:".6rem",color:"#475569",marginBottom:3}}>{l}</p>
                  <p style={{fontSize:"1.1rem",fontWeight:900,color:c}}>{v}</p>
                </div>
              ))}
            </div>
            {/* Question grid (mini) */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,maxHeight:100,overflowY:"auto"}}>
              {Array.from({length:Math.min(totalQ,60)}).map((_,i)=>(
                <div key={i} style={{
                  height:18,borderRadius:4,fontSize:".55rem",
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
                  background:i===idx?"rgba(249,115,22,.3)":i<answers.length?"rgba(74,222,128,.1)":"rgba(255,255,255,.03)",
                  border:`1px solid ${i===idx?"rgba(249,115,22,.5)":i<answers.length?"rgba(74,222,128,.2)":"rgba(255,255,255,.05)"}`,
                  color:i===idx?"#f97316":i<answers.length?"#86efac":"#334155"
                }}>{i+1}</div>
              ))}
              {totalQ>60&&<div style={{height:18,borderRadius:4,background:"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".55rem",color:"#334155"}}>…</div>}
            </div>
          </div>

          <button className="btn btn-g" style={{justifyContent:"center",fontSize:".78rem"}}
            onClick={()=>{if(window.confirm("هل تريد إنهاء الاختبار والخروج؟"))doFinish();}}>
            ⏹ إنهاء مبكر
          </button>
        </div>
      </div>
    );
  }

  /* ══════ DONE ══════ */
  if(phase==="done"){
    const qCorrect=answers.filter(a=>a.sec==="كمي"&&a.ok).length;
    const qTotal=answers.filter(a=>a.sec==="كمي").length;
    const vCorrect=answers.filter(a=>a.sec==="لفظي"&&a.ok).length;
    const vTotal=answers.filter(a=>a.sec==="لفظي").length;
    const timeTaken=timeTotal-timeLeft;
    return(
      <div style={{display:"grid",gap:14}}>
        {showCard&&<ResultCard stats={{topic:track,section:"محاكاة",correct,total:answers.length,avgTime:avgT}} onClose={()=>setShowCard(false)}/>}

        {/* Header */}
        <div className="gl gl-pad-lg" style={{padding:"34px 30px"}}>
          <span className="badge b-g" style={{marginBottom:12}}>✓ انتهى الاختبار</span>
          <h1 style={{fontSize:"1.85rem",fontWeight:900,color:"#fff",marginBottom:18}}>
            نتائج محاكاة قياس
          </h1>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:11}}>
            {[
              ["الدقة الكلية",`${acc}%`,acc>=75?"#4ade80":acc>=50?"#f97316":"#f87171","⭐"],
              ["الصحيح/الكلي",`${correct}/${answers.length}`,"#22d3ee","✓"],
              ["الوقت المستغرق",fmt(timeTaken),"#a78bfa","⏱"],
              ["متوسط/سؤال",`${avgT}ث`,"#f97316","⚡"],
            ].map(([l,v,c,ic],i)=>(
              <div key={i} className={`gl2 stat au d${i+1}`} style={{padding:"16px 18px"}}>
                <p style={{fontSize:".65rem",color:"#475569",marginBottom:6}}>{ic} {l}</p>
                <p style={{fontSize:"1.3rem",fontWeight:900,color:c}}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section breakdown */}
        <div className="rg-2" style={{display:"grid",gap:12}}>
          {[
            {sec:"كمي",label:"القسم الكمي",cor:qCorrect,tot:qTotal,color:"#f97316",icon:"🔢"},
            {sec:"لفظي",label:"القسم اللفظي",cor:vCorrect,tot:vTotal,color:"#22d3ee",icon:"📝"},
          ].map(({sec,label,cor,tot,color,icon})=>(
            <div key={sec} className="gl" style={{padding:"20px",border:`1px solid ${color}20`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span>{icon}</span>
                  <p style={{fontWeight:800,color:"#fff",fontSize:".9rem"}}>{label}</p>
                </div>
                <span style={{fontWeight:900,color,fontSize:"1.1rem"}}>
                  {tot?Math.round((cor/tot)*100):0}%
                </span>
              </div>
              <div className="pt" style={{marginBottom:8}}>
                <div style={{height:"100%",borderRadius:99,background:color,
                  width:`${tot?Math.round((cor/tot)*100):0}%`,transition:"width .6s ease"}}/>
              </div>
              <p style={{fontSize:".75rem",color:"#64748b"}}>{cor} صحيح من {tot} سؤال</p>
            </div>
          ))}
        </div>

        {/* Question breakdown */}
        <div className="gl" style={{padding:"22px"}}>
          <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:13}}>
            ▸ تفصيل الأسئلة
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:300,overflowY:"auto"}}>
            {answers.map((a,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",borderRadius:11,
                background:a.ok?"rgba(74,222,128,.06)":"rgba(248,113,113,.06)",
                border:`1px solid ${a.ok?"rgba(74,222,128,.18)":"rgba(248,113,113,.18)"}`
              }}>
                <span style={{fontWeight:900,color:a.ok?"#86efac":"#fca5a5",fontSize:".8rem",flexShrink:0,marginTop:2}}>
                  {a.ok?"✓":"✗"}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:".6rem",padding:"1px 7px",borderRadius:99,
                      background:a.sec==="كمي"?"rgba(249,115,22,.12)":"rgba(34,211,238,.1)",
                      color:a.sec==="كمي"?"#f97316":"#22d3ee",fontWeight:700}}>
                      {a.topic}
                    </span>
                    <span style={{fontSize:".6rem",color:"#334155"}}>{qTimes[i]||"—"}ث</span>
                  </div>
                  <p style={{fontSize:".78rem",color:"#94a3b8",lineHeight:1.5,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {a.q?.slice(0,80)}…
                  </p>
                  {!a.ok&&<p style={{fontSize:".7rem",color:"#6ee7b7",marginTop:4}}>
                    الصحيحة: {a.options?.[a.correct]}
                  </p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
          <button className="btn btn-g" onClick={()=>go("review")}>📋 راجع الأخطاء</button>
          <button className="btn btn-v" onClick={()=>setShowCard(true)}>🎴 بطاقة النتيجة</button>
          <button className="btn btn-p" onClick={()=>{setPhase("setup");setAnswers([]);setIdx(0);setCurQ(null);setNextQData(null);}}>
            محاكاة جديدة ←
          </button>
        </div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════ PRICING PAGE ═══════════════════ */
function Pricing({go,isLoggedIn=false}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]); 
  const PLANS=[
    {
      id:"free",name:"مجاني",price:0,per:"",color:"#22d3ee",
      badge:"ابدأ هنا 🎁",badgeBg:"rgba(34,211,238,.12)",
      features:["10 أسئلة مجانية","بطاقات المفهوم","خريطة المسار","اختبار تحديد المستوى"],
      locked:["أسئلة AI غير محدودة","شرح تفصيلي لكل سؤال","وضع المحاكاة","تحليل التقدم"],
      btn:"ابدأ مجانًا ←",isPaid:false,highlight:false,
    },
    {
      id:"month",name:"الأساسي",price:49,per:"شهر",color:"#f97316",
      badge:"الأكثر شيوعاً ⭐",badgeBg:"rgba(249,115,22,.12)",
      features:["أسئلة AI غير محدودة","شرح مفصّل لكل سؤال","وضع المحاكاة الكامل ⚡","تتبع التقدم والدقة","بنك الأسئلة 18 باب","تايمر 90 ثانية ⏱","وضع المراجعة 📋","بطاقة النتيجة"],
      locked:[],
      btn:"اشترك الآن ←",isPaid:true,highlight:true,
    },
    {
      id:"exam",name:"المميز",price:99,per:"شهر",color:"#a78bfa",
      badge:"⭐ الأكثر اختياراً",badgeBg:"rgba(167,139,250,.12)",
      features:["كل مميزات الأساسي","AI مساعد شخصي متقدم","تحليل نقاط الضعف التفصيلي","خطة مذاكرة ذكية مخصصة","اختبارات غير محدودة","أولوية في الدعم 24/7","أفضل قيمة مقارنة بالشهري 💜"],
      locked:[],
      btn:"اختر المميز ←",isPaid:true,highlight:false,isBest:true,
    },
  ];
  return(
    <div style={{display:"grid",gap:16,maxWidth:900,margin:"0 auto",width:"100%"}}>

      {/* Header */}
      <div className="gl" style={{padding:"clamp(24px,4vw,40px) clamp(16px,3vw,32px)",textAlign:"center"}}>
        <span className="badge b-o" style={{marginBottom:14}}>💰 الباقات</span>
        <h1 style={{fontSize:"clamp(1.5rem,3vw,2.1rem)",fontWeight:900,color:"#fff",marginBottom:10}}>
          بسيط وواضح — بدون مفاجآت
        </h1>
        <p style={{color:"#64748b",lineHeight:1.9,fontSize:".88rem"}}>
          جرّب مجاناً · اشترك لو ناسبك · ألغِ في أي وقت
        </p>
      </div>

      {/* Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
        {PLANS.map((p,i)=>(
          <div key={p.id} className={`gl au d${i+1}`} style={{
            padding:"clamp(20px,3vw,28px) clamp(16px,2.5vw,22px)",
            position:"relative",
            border:`1.5px solid ${p.isBest?"rgba(167,139,250,.55)":p.highlight?"rgba(249,115,22,.4)":`${p.color}25`}`,
            display:"flex",flexDirection:"column",gap:0,
            background:p.isBest?"linear-gradient(160deg,rgba(167,139,250,.07),rgba(5,9,26,.98))":"",
            boxShadow:p.isBest?`0 12px 40px rgba(167,139,250,.18)`:p.highlight?`0 8px 28px rgba(249,115,22,.12)`:"",
            marginTop:p.isBest?0:0,
          }}>
            {/* Best badge */}
            {p.isBest&&(
              <div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                whiteSpace:"nowrap",padding:"5px 16px",borderRadius:99,
                background:"linear-gradient(135deg,#a78bfa,#8b5cf6)",
                fontSize:".65rem",fontWeight:900,color:"#fff",
                boxShadow:"0 4px 14px rgba(139,92,246,.4)"}}>
                ⭐ الأكثر اختياراً
              </div>
            )}

            {/* Plan badge */}
            <div style={{marginBottom:14,marginTop:p.isBest?8:0}}>
              <span style={{
                display:"inline-block",padding:"4px 12px",borderRadius:99,
                background:p.badgeBg,border:`1px solid ${p.color}35`,
                fontSize:".63rem",fontWeight:700,color:p.color
              }}>{p.isBest?"المميز 👑":p.badge}</span>
            </div>

            {/* Name */}
            <p style={{fontSize:"1rem",fontWeight:800,color:"#fff",marginBottom:8}}>{p.name}</p>

            {/* Price */}
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:20}}>
              {p.price===0?(
                <span style={{fontSize:"1.9rem",fontWeight:900,color:p.color}}>مجاني</span>
              ):(
                <>
                  <span style={{fontSize:"clamp(1.8rem,5vw,2.5rem)",fontWeight:900,color:p.color,lineHeight:1}}>{p.price}</span>
                  <div>
                    <p style={{fontSize:".72rem",fontWeight:700,color:"#94a3b8"}}>ريال</p>
                    <p style={{fontSize:".63rem",color:"#475569"}}>/ {p.per}</p>
                  </div>
                  {p.id==="exam"&&(
                    <span style={{fontSize:".65rem",padding:"2px 8px",borderRadius:99,
                      background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.2)",
                      color:"#4ade80",marginRight:"auto",marginTop:4}}>وفّر 18 ريال</span>
                  )}
                </>
              )}
            </div>

            {/* Features */}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20,flex:1}}>
              {p.features.map((f,fi)=>(
                <div key={fi} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <span style={{color:p.color,fontWeight:900,fontSize:".78rem",flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:".8rem",color:"#cbd5e1",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
              {p.locked.map((f,fi)=>(
                <div key={`l${fi}`} style={{display:"flex",alignItems:"flex-start",gap:8,opacity:.35}}>
                  <span style={{color:"#475569",fontWeight:900,fontSize:".78rem",flexShrink:0,marginTop:1}}>✕</span>
                  <span style={{fontSize:".8rem",color:"#475569",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {p.isPaid?(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <button style={{
                  width:"100%",padding:"13px",borderRadius:12,
                  cursor:"not-allowed",opacity:.55,
                  background:p.isBest?"linear-gradient(135deg,rgba(167,139,250,.3),rgba(139,92,246,.2))":
                    p.highlight?"linear-gradient(135deg,#f97316,#fb923c)":"transparent",
                  border:`1.5px solid ${p.color}50`,
                  color:p.highlight&&!p.isBest?"#0a0f1e":p.color,
                  fontSize:".87rem",fontWeight:800,fontFamily:"Cairo,sans-serif"
                }}>🔒 الدفع قريباً</button>
                <p style={{fontSize:".63rem",color:"#334155",textAlign:"center"}}>
                  Moyasar · مدى · Apple Pay
                </p>
              </div>
            ):(
              <button className="btn"
                style={{width:"100%",justifyContent:"center",padding:"13px",borderRadius:12,
                  background:`linear-gradient(135deg,${p.color}18,${p.color}0a)`,
                  border:`1.5px solid ${p.color}50`,color:p.color,
                  cursor:"pointer",fontSize:".88rem",fontWeight:800,
                  transition:"all .2s",fontFamily:"Cairo,sans-serif"}}
                onClick={()=>go(isLoggedIn?"paywall":"signup")}>
                {p.btn}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* مقارنة سريعة */}
      <div className="gl" style={{padding:"22px 24px"}}>
        <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:14}}>مقارنة سريعة</p>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:".8rem"}}>
            <thead>
              <tr>
                {["الميزة","مجاني","49 ريال","99 ريال"].map((h,i)=>(
                  <th key={i} style={{padding:"8px 12px",textAlign:i===0?"right":"center",
                    color:i===3?"#a78bfa":i===2?"#f97316":i===1?"#22d3ee":"#64748b",
                    fontWeight:700,borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["عدد الأسئلة","20","غير محدود ♾️","غير محدود ♾️"],
                ["شرح AI","✗","✓","✓"],
                ["وضع المحاكاة","✗","✓","✓"],
                ["تتبع التقدم","✗","✓","✓"],
                ["تحليل الضعف","✗","✗","✓"],
                ["خطة مذاكرة","✗","✗","✓"],
              ].map((row,ri)=>(
                <tr key={ri} style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  {row.map((cell,ci)=>(
                    <td key={ci} style={{
                      padding:"10px 12px",textAlign:ci===0?"right":"center",
                      color:cell==="✓"?"#4ade80":cell==="✗"?"#ef4444":cell.includes("♾️")?"#f97316":"#e2e8f0",
                      fontWeight:ci===0?600:cell==="✓"||cell==="✗"?700:400
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security */}
      <div className="gl-c" style={{padding:"15px 22px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <span style={{fontSize:"1.1rem"}}>🔒</span>
        <p style={{fontSize:".8rem",color:"#64748b",lineHeight:1.8,flex:1}}>
          الدفع الآمن عبر <strong style={{color:"#67e8f9"}}>Moyasar</strong> المرخصة من ساما ·
          مدى · Visa · Mastercard · Apple Pay · إلغاء في أي وقت
        </p>
      </div>

      <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>go(isLoggedIn?"dashboard":"landing")}>
        {isLoggedIn?"↩ لوحة التحكم":"← الرئيسية"}
      </button>
    </div>
  );
}

function NextCountdown({onNext,seconds=5}){
  const[left,setLeft]=useState(seconds);
  const pct=Math.round((left/seconds)*100);
  const r=14,c=2*Math.PI*r;
  useEffect(()=>{
    if(left<=0){onNext();return;}
    const id=setTimeout(()=>setLeft(p=>p-1),1000);
    return()=>clearTimeout(id);
  },[left]);
  return(
    <button onClick={onNext} style={{
      display:"flex",alignItems:"center",gap:10,padding:"11px 20px",
      borderRadius:13,background:"linear-gradient(135deg,#f97316,#fb923c)",
      border:"none",cursor:"pointer",color:"#0a0f1e",fontWeight:800,
      fontSize:".88rem",fontFamily:"Cairo,sans-serif",
      boxShadow:"0 4px 18px rgba(249,115,22,.4)",transition:"transform .15s"
    }}>
      <svg width={34} height={34} style={{transform:"rotate(-90deg)",flexShrink:0}}>
        <circle cx={17} cy={17} r={r} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={3}/>
        <circle cx={17} cy={17} r={r} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={3}
          strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1s linear"}}/>
        <text x={17} y={17} textAnchor="middle" dominantBaseline="middle"
          fill="#0a0f1e" fontSize={9} fontWeight={900} fontFamily="Cairo"
          transform="rotate(90,17,17)">{left}</text>
      </svg>
      السؤال التالي
    </button>
  );
}

/* ═══════════════════ QUESTION RATING ═══════════════════ */
function QRating({qId,topic}){
  const[rated,setRated]=useState(null);
  const[sent,setSent]=useState(false);
  if(sent)return(
    <div style={{marginTop:10,padding:"8px 12px",borderRadius:11,background:"rgba(74,222,128,.07)",
      border:"1px solid rgba(74,222,128,.15)",display:"flex",alignItems:"center",gap:7}}>
      <span style={{fontSize:".8rem"}}>✅</span>
      <p style={{fontSize:".72rem",color:"#86efac"}}>شكراً على تقييمك — يساعدنا نحسّن الأسئلة!</p>
    </div>
  );
  return(
    <div style={{marginTop:10,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,.03)",
      border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <p style={{fontSize:".68rem",color:"#475569",flex:1}}>هل السؤال واضح ومفيد؟</p>
      <div style={{display:"flex",gap:6}}>
        {[["👍","جيد"],["👎","غير واضح"],["🔄","مكرر"]].map(([ic,label])=>(
          <button key={label} onClick={()=>{
            setRated(label);setSent(true);
            // Save rating to localStorage for now
            try{
              const ratings=JSON.parse(localStorage.getItem("fahmni_ratings")||"[]");
              ratings.push({qId,topic,rating:label,at:Date.now()});
              localStorage.setItem("fahmni_ratings",JSON.stringify(ratings.slice(-100)));
            }catch{}
          }} style={{
            padding:"5px 10px",borderRadius:9,cursor:"pointer",
            fontFamily:"Cairo,sans-serif",fontSize:".72rem",fontWeight:700,
            background:rated===label?"rgba(249,115,22,.15)":"rgba(255,255,255,.05)",
            border:`1px solid ${rated===label?"rgba(249,115,22,.3)":"rgba(255,255,255,.09)"}`,
            color:rated===label?"#f97316":"#64748b",display:"flex",alignItems:"center",gap:4
          }}>{ic} {label}</button>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════ AI SESSION ═══════════════════ */
function Session({settings,go,updateUser,trial,setTrial,addMistake,plan="free",session=null,user={name:"",streak:0,totalSolved:0,correct:0},showToast=()=>{}}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);
  const[qData,setQData]=useState(null);
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[sel,setSel]=useState(null);
  const[checked,setChecked]=useState(false);
  const[steps,setSteps]=useState([]);
  const[showTip,setShowTip]=useState(false);
  const[history,setHistory]=useState([]);
  const[showTeacher,setShowTeacher]=useState(false);
  const[timerKey,setTimerKey]=useState(0);
  const[expired,setExpired]=useState(false);
  const[showCard,setShowCard]=useState(false);
  const[qTimes,setQTimes]=useState([]);
  const[qStart,setQStart]=useState(Date.now());
  const[autoNext,setAutoNext]=useState(false);
  /* Live coach state */
  const[coach,setCoach]=useState(null);
  const[coachLoading,setCoachLoading]=useState(false);
  /* anti-repeat + current topic */
  const[curTopic,setCurTopic]=useState(()=>{
    const all=ALL_TOPICS;
    return all[Math.floor(Math.random()*all.length)];
  });
  const lastQRef=useRef("");
  const explRef=useRef(null);
  const sounds=useNatureSounds();
  const correct=history.filter(h=>h.ok).length;
  const acc=history.length?Math.round((correct/history.length)*100):0;
  const isCorrect=checked&&sel===qData?.correct;
  const TEACHER_TRIGGER=5;
  const avgT=qTimes.length?Math.round(qTimes.reduce((a,b)=>a+b,0)/qTimes.length):0;

  const fetchQ=useCallback(async()=>{
    if(!trial.isSubscribed&&trial.used>=trial.limit){go("paywall");return;}
    // اختر باباً عشوائياً جديداً مختلفاً عن الحالي
    const nextTopic=(()=>{
      const pool=ALL_TOPICS.filter(t=>t!==curTopic);
      const t=pool[Math.floor(Math.random()*pool.length)];
      setCurTopic(t);
      return t;
    })();
    setLoading(true);setErr("");setQData(null);setSel(null);setChecked(false);
    setSteps([]);setShowTip(false);setExpired(false);setAutoNext(false);setCoach(null);setCoachLoading(false);
    try{
      const q=await genQuestion({topic:nextTopic,difficulty:"متوسط",avoidQuestion:lastQRef.current,userId:session?.userId||null,userToken:session?.token||null});
      lastQRef.current=q.question||"";
      setQData({...q,topic:nextTopic});setTimerKey(k=>k+1);setQStart(Date.now());
      if(q._fromDB) showToast("⚡ من بنك الأسئلة","info",1500);
    }catch(e){if(e.limitReached){setErr(e.message);go("paywall");}else{setErr("فشل توليد السؤال. تحقق من الاتصال.");}}
    finally{setLoading(false);}
  },[settings,trial]);

  useEffect(()=>{
    if(!trial.isSubscribed&&trial.used>=trial.limit){go("paywall");return;}
    fetchQ();
  },[]);

  /* ── تشغيل فوري عند اختيار الإجابة ── */
  const pickAnswer=(i)=>{
    if(checked)return;
    setSel(i);
    doCheck(i,false);
  };

  const doCheck=(chosenIdx,isExpired)=>{
    const ok=!isExpired&&chosenIdx===qData?.correct;
    const taken=Math.round((Date.now()-qStart)/1000);
    setChecked(true);
    setQTimes(p=>[...p,taken]);
    const realSec=deriveSec(curTopic||settings.topic);
    const entry={ok,q:qData?.question,topic:curTopic||settings.topic,section:realSec,
      chosen:isExpired?"(انتهى الوقت)":qData?.options[chosenIdx],
      correctAns:qData?.options[qData?.correct],steps:qData?.steps,tip:qData?.tip};
    const nh=[...history,entry];
    setHistory(nh);
    setTrial(p=>{
      const nu=p.isSubscribed?p:{...p,used:p.used+1};
      if(!IS_ARTIFACT&&session?.userId&&!p.isSubscribed)
        sbSaveProgress(session.userId,session.token,{totalSolved:user.totalSolved,correct:user.correct,streak:user.streak,trialUsed:nu.used}).catch(()=>{});
      return nu;
    });
    updateUser(ok);
    if(!ok)addMistake(entry);
    /* ── كل الشرح يظهر فوراً دفعة واحدة ── */
    setSteps(qData?.steps||[]);
    setShowTip(true);
    setAutoNext(false); // يبدأ بعد الكوتش
    /* ── Static Coach (بدون AI — توفير التكلفة) ── */
    const acc2=nh.length?Math.round(nh.filter(h=>h.ok).length/nh.length*100):0;
    const staticMsg=ok
      ?acc2>=80?"🎯 ممتاز! أداء رائع — استمر.":acc2>=60?"✅ صحيح! أنت في المسار الصحيح.":"✅ أحسنت! كل سؤال صحيح يبني ثقتك."
      :acc2<40?"💪 لا تستسلم — راجع الحل وستتحسن.":"💡 راجع الخطوات أسفله لتفهم الأسلوب.";
    setCoach({emoji:ok?"🎯":"💡",msg:staticMsg,tip:qData?.tip||""});
    setCoachLoading(false);setAutoNext(true);
    setTimeout(()=>explRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    if(nh.length>0&&nh.length%TEACHER_TRIGGER===0)setTimeout(()=>setShowTeacher(true),2000);
    // Check daily goal reached
    const ds=getDailyStats();
    if(ds.done===dailyGoal&&dailyGoal>0){
      setTimeout(()=>setMilestone("daily_goal"),1500);
    }
  };

  const handleExpire=()=>{if(!checked){setExpired(true);doCheck(null,true);}};

  if(showTeacher)return(
    <TeacherSummary topic={settings.topic} history={history.slice(-TEACHER_TRIGGER)}
      onContinue={()=>{setShowTeacher(false);fetchQ();}}
      onReview={()=>go("review")}
      plan={plan}/>
  );

  const realSec=deriveSec(settings.topic);

  return(<div className="rg-sidebar" style={{gap:14}}>
    {showCard&&<ResultCard stats={{topic:settings.topic,section:realSec,correct,total:history.length,avgTime:avgT}} onClose={()=>setShowCard(false)}/>}

    {/* ── Main column ── */}
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Header bar */}
      <div className="gl" style={{padding:"13px 18px"}}>
        <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
          <span className={`badge ${deriveSec(curTopic||settings.topic)==="كمي"?"b-o":"b-c"}`}>{deriveSec(curTopic||settings.topic)}</span>
          <span className="badge b-v">{curTopic||settings.topic}</span>
          
          {GEO.includes(settings.topic)&&<span className="badge b-ai">📐</span>}
          <div style={{marginRight:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <SoundPanel sounds={sounds}/>
            <span className="badge b-ai"><div className="dots"><span/><span/><span/></div> AI</span>
          </div>
        </div>
        {history.length>0&&history.length%TEACHER_TRIGGER!==0&&(
          <div style={{marginTop:9}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".67rem",color:"#64748b",marginBottom:4}}>
              <span style={{color:"#a78bfa"}}>🎓 وضع المعلم بعد {TEACHER_TRIGGER-(history.length%TEACHER_TRIGGER)} أسئلة</span>
              <span>{history.length%TEACHER_TRIGGER}/{TEACHER_TRIGGER}</span>
            </div>
            <div className="pt"><div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#a78bfa,#22d3ee)",width:`${(history.length%TEACHER_TRIGGER)/TEACHER_TRIGGER*100}%`,transition:"width .6s ease"}}/></div>
          </div>
        )}
      </div>

      {/* Mobile stats bar (replaces sidebar) */}
      <div className="mob-show" style={{display:"none"}}>
        <div className="mob-stats-bar">
          <Ring pct={acc} size={44} color={acc>=70?"#4ade80":acc>=50?"#f97316":"#f87171"} label=""/>
          <div style={{flex:1}}>
            <p style={{fontSize:".7rem",color:"#64748b"}}>الصحيح / الكلي</p>
            <p style={{fontSize:".9rem",fontWeight:900,color:"#fff"}}>{correct} / {history.length}</p>
          </div>
          {!trial.isSubscribed&&<div style={{textAlign:"left",minWidth:80}}>
            <p style={{fontSize:".62rem",color:"#f97316",fontWeight:700,marginBottom:3}}>{trial.used}/{trial.limit} سؤال</p>
            <div className="pt"><div className="pf" style={{width:`${Math.min((trial.used/trial.limit)*100,100)}%`}}/></div>
          </div>}
        </div>
      </div>

      {/* Loading */}
      {loading&&<div className="gl si" style={{padding:"48px",textAlign:"center"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:13}}>
          <div className="spin spin-lg"/>
          <p style={{color:"#64748b",fontSize:".88rem"}}>يصيغ سؤالاً من <strong style={{color:"#f97316"}}>{curTopic||settings.topic}</strong>...</p>
        </div>
      </div>}

      {/* Error */}
      {err&&!loading&&<div className="gl" style={{padding:"18px",borderColor:"rgba(248,113,113,.2)",background:"rgba(248,113,113,.06)"}}>
        <p style={{color:"#fca5a5",marginBottom:11}}>⚠ {err}</p>
        <button className="btn btn-p" onClick={fetchQ}>أعد المحاولة</button>
      </div>}

      {/* Question card */}
      {qData&&!loading&&(<div className="gl si" style={{padding:"26px"}}>
        {expired&&<div className="pi" style={{padding:"10px 14px",borderRadius:12,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",marginBottom:14}}>
          <p style={{color:"#fca5a5",fontWeight:700,fontSize:".84rem"}}>⏱ انتهى الوقت! الإجابة الصحيحة أسفله</p>
        </div>}
        {qData.shape&&<ShapeRender shape={qData.shape}/>}
        <h2 style={{fontSize:"clamp(.95rem,3vw,1.12rem)",fontWeight:800,color:"#fff",lineHeight:1.85,marginBottom:18}}>{qData.question}</h2>

        {/* Options — click = answer immediately */}
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {(qData.options||[]).map((opt,i)=>{
            const showOk=checked&&i===qData.correct;
            const showBad=checked&&sel===i&&i!==qData.correct;
            return(
              <button key={i}
                className={`ans ${showOk?"ok":showBad?"bad":sel===i&&!checked?"sel":""} ${checked?"lk":""}`}
                onClick={()=>pickAnswer(i)}
                style={{position:"relative"}}>
                <span>{opt}</span>
                <div className="opt-l">{String.fromCharCode(0x0627+i)}</div>
                {showOk&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem"}}>✓</span>}
                {showBad&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem"}}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Hint while waiting */}
        {!checked&&(
          <div style={{marginTop:14,display:"flex",flexDirection:"column",alignItems:"center",gap:9}}>
            <p style={{fontSize:".75rem",color:"#334155"}}>اختر إجابتك — الحل يظهر بعد اختيارك</p>

          </div>
        )}
      </div>)}

      {/* Explanation — appears right after answering */}
      {checked&&qData&&(<div ref={explRef} className="gl si" style={{padding:"23px",border:`1.5px solid ${isCorrect?"rgba(74,222,128,.25)":"rgba(248,113,113,.2)"}`}}>

        {/* ── 1. نتيجة الإجابة ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:16}}>
          <span className={`badge pi ${isCorrect?"b-g":"b-r"}`} style={{fontSize:".88rem",padding:"8px 16px"}}>
            {isCorrect?"✅ إجابة صحيحة!":"❌ إجابة خاطئة"}
          </span>
          <Ring pct={isCorrect?100:0} size={52} color={isCorrect?"#4ade80":"#f87171"}/>
        </div>

        {/* ── 2. الإجابة الصحيحة (تظهر دائماً) ── */}
        <div style={{padding:"12px 15px",borderRadius:12,marginBottom:14,
          background:isCorrect?"rgba(74,222,128,.07)":"rgba(248,113,113,.06)",
          border:`1px solid ${isCorrect?"rgba(74,222,128,.22)":"rgba(248,113,113,.22)"}`}}>
          <p style={{fontSize:".68rem",color:"#64748b",marginBottom:4}}>الإجابة الصحيحة</p>
          <p style={{fontSize:".95rem",fontWeight:800,color:isCorrect?"#86efac":"#bbf7d0"}}>
            {(qData.options||[])[qData.correct]||""}
          </p>
          {!isCorrect&&<p style={{fontSize:".75rem",color:"#fca5a5",marginTop:5}}>
            إجابتك: {expired?"(انتهى الوقت)":(qData.options||[])[sel]||""}
          </p>}
        </div>

        {/* ── 3. طريقة الحل خطوة بخطوة ── */}
        {(steps||[]).length>0&&(<>
          <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:9}}>▸ طريقة الحل</p>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
            {(steps||[]).map((s,i)=>(
              <div key={i} className="step" style={{animationDelay:`${i*.06}s`}}>
                <div className="snum">{i+1}</div>
                <p style={{fontSize:".84rem",lineHeight:1.85,color:"#cbd5e1"}}>{s}</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ── 4. النصيحة ── */}
        {showTip&&qData.tip&&(
          <div className="gl-o au" style={{padding:"11px 15px",marginBottom:13}}>
            <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,marginBottom:4}}>💡 نصيحة للمرة القادمة</p>
            <p style={{fontSize:".82rem",lineHeight:1.8,color:"#fdba74"}}>{qData.tip}</p>
          </div>
        )}

        {/* ── 5. الجملة التحفيزية ── */}
        <p style={{fontSize:".73rem",color:"#475569",textAlign:"center",lineHeight:1.7,marginBottom:13}}>
          {isCorrect?"✨ ممتاز! استمر بالتدريب لترفع مستواك.":"💪 لا تقلق — الفهم يأتي بالتكرار. راجع الخطوات."}
        </p>

        {/* ── 6. كارت الكوتش ── */}
        {(coachLoading||coach)&&(
          <div className="au" style={{
            padding:"13px 16px",borderRadius:14,marginBottom:13,
            background:"linear-gradient(135deg,rgba(139,92,246,.1),rgba(249,115,22,.07))",
            border:"1px solid rgba(139,92,246,.22)"
          }}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{fontSize:"1.2rem",flexShrink:0,marginTop:1}}>🎓</span>
              <div style={{flex:1}}>
                <p style={{fontSize:".64rem",color:"#a78bfa",fontWeight:700,marginBottom:5,letterSpacing:".06em"}}>تقييم الجلسة</p>
                {coachLoading?(
                  <div className="dots"><span/><span/><span/></div>
                ):(
                  <p style={{fontSize:".86rem",fontWeight:700,color:"#e2e8f0",lineHeight:1.75}}>
                    {coach?.emoji} {coach?.msg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. أزرار التنقل ── */}
        <div style={{marginTop:14,display:"flex",gap:9,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-g" style={{fontSize:".77rem"}} onClick={()=>setShowCard(true)}>🎴 بطاقة</button>
            <button className="btn btn-g" style={{fontSize:".77rem"}} onClick={()=>go("review")}>📋 مراجعة</button>
          </div>
          {autoNext&&!showTeacher&&<NextCountdown onNext={fetchQ} seconds={5}/>}
          {!autoNext&&checked&&<button className="btn btn-p" onClick={fetchQ}>السؤال التالي ←</button>}
        </div>
      </div>)}
    </div>

    {/* ── Sidebar ── */}
    <div className="mob-hide" style={{display:"flex",flexDirection:"column",gap:11,alignSelf:"start",position:"sticky",top:20}}>
      {qData&&!loading&&!checked&&<QuestionTimer key={timerKey} seconds={90} onExpire={handleExpire} paused={checked}/>}
      <div className="gl" style={{padding:"17px"}}>
        <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:11}}>جلستك</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:13}}>
          <Ring pct={acc} size={84} color={acc>=70?"#4ade80":acc>=50?"#f97316":"#f87171"} label="الدقة"/>
        </div>
        <div className="gl2" style={{padding:"10px 13px"}}>
          <p style={{fontSize:".68rem",color:"#64748b"}}>الصحيح / الكلي</p>
          <p style={{fontSize:"1.25rem",fontWeight:900,color:"#fff",marginTop:3}}>{correct} / {history.length}</p>
        </div>
      </div>
      {CONCEPTS[curTopic||settings.topic]&&<div key={curTopic||settings.topic} className="gl au" style={{padding:"14px"}}>
        <p style={{fontSize:".67rem",color:"#22d3ee",fontWeight:700,letterSpacing:".08em",marginBottom:8}}>📌 مرجع سريع — {curTopic||settings.topic}</p>
        {CONCEPTS[curTopic||settings.topic].formula!=="—"&&<div className="gl2" style={{padding:"8px",marginBottom:7,textAlign:"right"}}>
          <p style={{fontSize:".67rem",color:"#f97316",marginBottom:3}}>الصيغة</p>
          <p style={{fontSize:".74rem",fontWeight:800,color:"#fdba74",direction:"rtl",textAlign:"right"}}>{CONCEPTS[curTopic||settings.topic].formula}</p>
        </div>}
        <p style={{fontSize:".71rem",lineHeight:1.7,color:"#f87171"}}>{CONCEPTS[curTopic||settings.topic].trap}</p>
      </div>}
      {history.length>0&&<div className="gl" style={{padding:"14px"}}>
        <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:9}}>السجل</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
          {history.map((h,i)=><div key={i} style={{height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".68rem",fontWeight:700,background:h.ok?"rgba(74,222,128,.12)":"rgba(248,113,113,.1)",border:`1px solid ${h.ok?"rgba(74,222,128,.3)":"rgba(248,113,113,.25)"}`,color:h.ok?"#86efac":"#fca5a5"}}>{h.ok?"✓":"✗"}</div>)}
        </div>
      </div>}
      {!trial.isSubscribed&&<div className="gl2" style={{padding:"12px 14px",borderColor:"rgba(249,115,22,.2)",background:"rgba(249,115,22,.05)"}}>
        <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,marginBottom:6}}>التجربة المجانية</p>
        <div className="pt"><div className="pf" style={{width:`${Math.min((trial.used/trial.limit)*100,100)}%`}}/></div>
        <p style={{fontSize:".74rem",color:"#94a3b8",marginTop:6}}>{trial.used}/{trial.limit} سؤال</p>
      </div>}
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>);
}
/* ═══════════════════ REMAINING PAGES (compact) ═══════════════════ */
function AnimCounter({target,suffix="",duration=1800}){
  const[val,setVal]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        let start=0,step=target/60;
        const t=setInterval(()=>{start+=step;if(start>=target){setVal(target);clearInterval(t);}else setVal(Math.floor(start));},duration/60);
      }
    },{threshold:.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function Landing({go}){
  const[bannerClosed,setBannerClosed]=useState(false);
  const[activeFeature,setActiveFeature]=useState(0);

  const FEATURES=[
    {icon:"🤖",title:"أسئلة AI لا تنتهي",desc:"كل سؤال يولّده الذكاء الاصطناعي خصيصاً لمستواك — لن تتكرر نفس الأسئلة أبداً.",color:"#f97316",demo:(
      <div style={{padding:"16px",borderRadius:14,background:"rgba(5,9,26,.9)",border:"1px solid rgba(249,115,22,.2)"}}>
        <p style={{fontSize:".7rem",color:"#f97316",fontWeight:700,marginBottom:8}}>🤖 سؤال مولّد الآن</p>
        <p style={{fontSize:".85rem",color:"#fff",lineHeight:1.8,marginBottom:12}}>إذا كان متوسط 5 طلاب هو 80، وأربعة منهم درجاتهم 75، 85، 90، 70 — ما درجة الخامس؟</p>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {["60","70","80","90"].map((o,i)=><div key={i} style={{padding:"8px 12px",borderRadius:9,background:i===2?"rgba(74,222,128,.12)":"rgba(255,255,255,.04)",border:`1px solid ${i===2?"rgba(74,222,128,.3)":"rgba(255,255,255,.07)"}`,fontSize:".78rem",color:i===2?"#86efac":"#94a3b8",display:"flex",justifyContent:"space-between"}}><span>{o}</span>{i===2&&<span>✓ صحيح</span>}</div>)}
        </div>
      </div>
    )},
    {icon:"🎓",title:"وضع المعلم الذكي",desc:"بعد كل 5 أسئلة، يحلل AI أداءك بالتفصيل ويخبرك وين تحسّن.",color:"#a78bfa",demo:(
      <div style={{padding:"16px",borderRadius:14,background:"rgba(5,9,26,.9)",border:"1px solid rgba(167,139,250,.2)"}}>
        <p style={{fontSize:".7rem",color:"#a78bfa",fontWeight:700,marginBottom:10}}>🎓 تقرير المعلم</p>
        {[{t:"نقطة قوة",v:"إجابتك على النسبة والتناسب كانت سريعة ودقيقة.",c:"#86efac"},{t:"نقطة ضعف",v:"في الأعمار تنسى تغيير كلا الشخصين.",c:"#fca5a5"},{t:"التوصية",v:"ركّز على 3 أسئلة إضافية في الأعمار.",c:"#fdba74"}].map((r,i)=>(
          <div key={i} style={{padding:"8px 11px",borderRadius:9,background:"rgba(255,255,255,.04)",marginBottom:6}}>
            <p style={{fontSize:".6rem",color:"#475569",marginBottom:2}}>{r.t}</p>
            <p style={{fontSize:".76rem",color:r.c,lineHeight:1.6}}>{r.v}</p>
          </div>
        ))}
      </div>
    )},
    {icon:"⚡",title:"محاكاة قياس حقيقية",desc:"110 سؤال · 150 دقيقة — نفس اختبار قياس بالضبط. جهّز نفسك قبل اليوم الحقيقي.",color:"#22d3ee",demo:(
      <div style={{padding:"16px",borderRadius:14,background:"rgba(5,9,26,.9)",border:"1px solid rgba(34,211,238,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <p style={{fontSize:".7rem",color:"#22d3ee",fontWeight:700}}>⚡ محاكاة جارية</p>
          <p style={{fontSize:".7rem",color:"#f87171",fontWeight:700}}>⏱ 1:24:38</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(28px,1fr))",gap:3,marginBottom:10}}>
          {Array.from({length:30}).map((_,i)=><div key={i} style={{height:14,borderRadius:3,background:i<18?i%4===3?"rgba(248,113,113,.3)":"rgba(74,222,128,.2)":"rgba(255,255,255,.06)",border:`1px solid ${i<18?i%4===3?"rgba(248,113,113,.3)":"rgba(74,222,128,.2)":"rgba(255,255,255,.04)"}`}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
          {[["أُجيب",18,"#22d3ee"],["صحيح",14,"#4ade80"],["متبقي",102,"#475569"]].map(([l,v,c])=>(
            <div key={l} style={{padding:"7px",borderRadius:8,background:"rgba(255,255,255,.04)",textAlign:"center"}}>
              <p style={{fontSize:"1rem",fontWeight:900,color:c}}>{v}</p>
              <p style={{fontSize:".58rem",color:"#475569"}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    )},
    {icon:"🗺️",title:"خريطة المسار الكاملة",desc:"17 باب مرتّب من الأسهل للأصعب — كل باب فيه شرح AI + تشخيص + تدريب.",color:"#4ade80",demo:(
      <div style={{padding:"16px",borderRadius:14,background:"rgba(5,9,26,.9)",border:"1px solid rgba(74,222,128,.2)"}}>
        <p style={{fontSize:".7rem",color:"#4ade80",fontWeight:700,marginBottom:10}}>🗺️ مسارك الشخصي</p>
        {[{t:"النسبة والتناسب",s:"مكتمل",c:"#4ade80",p:100},{t:"الأعمار",s:"جاري",c:"#f97316",p:60},{t:"المتوسط الحسابي",s:"التالي",c:"#475569",p:0}].map((r,i)=>(
          <div key={i} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <p style={{fontSize:".76rem",color:r.c,fontWeight:700}}>{r.t}</p>
              <p style={{fontSize:".65rem",color:r.c}}>{r.s}</p>
            </div>
            <div style={{height:4,borderRadius:99,background:"rgba(255,255,255,.07)"}}>
              <div style={{height:"100%",borderRadius:99,background:r.c,width:`${r.p}%`,transition:"width 1s ease"}}/>
            </div>
          </div>
        ))}
      </div>
    )},
  ];

  return(
    <div style={{display:"grid",gap:0}}>

      {/* ── بانر الإعلان ── */}
      {!bannerClosed&&(
        <div style={{position:"relative",overflow:"hidden",padding:"11px 20px",
          background:"linear-gradient(90deg,rgba(249,115,22,.2),rgba(251,146,60,.14),rgba(34,211,238,.08))",
          border:"none",borderBottom:"1px solid rgba(249,115,22,.3)",
          display:"flex",alignItems:"center",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:0}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(249,115,22,.05),transparent)",animation:"gridAnim 3s ease-in-out infinite",pointerEvents:"none"}}/>
          <p style={{fontSize:".83rem",fontWeight:700,color:"#fff",position:"relative"}}>
            🔥 عرض محدود — اشترك بـ <span style={{color:"#fde047",fontWeight:900}}>49 ريال/شهر</span> وافتح كل المميزات
          </p>
          <div style={{display:"flex",gap:8,position:"relative"}}>
            <button className="btn btn-p" style={{fontSize:".75rem",padding:"7px 16px"}} onClick={()=>go("pricing")}>اشترك الآن ←</button>
            <button onClick={()=>setBannerClosed(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:"1rem",fontFamily:"Cairo,sans-serif",padding:"4px 6px"}}>✕</button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{padding:"clamp(28px,7vw,64px) 0 clamp(24px,5vw,48px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 50% 0%,rgba(249,115,22,.13) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,
            background:"linear-gradient(135deg,rgba(249,115,22,.12),rgba(34,211,238,.08))",
            border:"1px solid rgba(249,115,22,.28)",marginBottom:22,animation:"fadeUp .5s both"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80",display:"inline-block",animation:"streakGlow 2s infinite"}}/>
            <span style={{fontSize:".73rem",fontWeight:700,color:"#fdba74"}}>مبني بالذكاء الاصطناعي · خصيصاً لاختبار القدرات</span>
          </div>

          <h1 style={{fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,lineHeight:1.15,color:"#fff",marginBottom:18,animation:"fadeUp .5s .08s both"}}>
            ذاكر بذكاء<br/>
            <span style={{background:"linear-gradient(135deg,#f97316,#fb923c,#fbbf24,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200%"}}>
              وافهم أسرع
            </span>
          </h1>

          <p style={{fontSize:"clamp(.88rem,2vw,1.05rem)",lineHeight:1.9,color:"#64748b",maxWidth:520,margin:"0 auto 30px",animation:"fadeUp .5s .14s both"}}>
            فهمني منصة القدرات الأذكى في السعودية — AI يولّد أسئلة لا تنتهي، ويشخّص أداءك، ويشرح كل باب بلغة تفهمها.
          </p>

          <div className="landing-hero-btns" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .5s .2s both"}}>
            <button className="btn btn-p" style={{fontSize:"1rem",padding:"14px 32px",borderRadius:16}} onClick={()=>go("signup")}>
              ابدأ مجانًا ← 10 سؤال
            </button>
            <button className="btn btn-g" style={{fontSize:".93rem",padding:"14px 24px",borderRadius:16}} onClick={()=>go("signup")}>
              جرّب سؤالاً الآن
            </button>
          </div>

          {/* Social proof */}
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:28,animation:"fadeUp .5s .26s both"}}>
            {[["🎯","دقة التشخيص","98%"],["⚡","وقت التوليد","< 3 ثوانٍ"],["📚","عدد الأبواب","17 باب"]].map(([ic,l,v],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:".9rem"}}>{ic}</span>
                <span style={{fontSize:".75rem",color:"#475569"}}>{l}</span>
                <span style={{fontSize:".82rem",fontWeight:800,color:"#f97316"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── إحصائيات ── */}
      <div className="landing-stats-bar" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,borderTop:"1px solid rgba(255,255,255,.06)",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.03)",marginBottom:40}}>
        {[["+ أسئلة مولّدة",50000,""],["باب كمي ولفظي",17,""],["% دقة الـ AI",99,""],["ريال/شهر فقط",49,""]].map(([l,v,s],i)=>(
          <div key={i} style={{padding:"22px 16px",textAlign:"center",borderLeft:i>0?"1px solid rgba(255,255,255,.06)":"none"}}>
            <p style={{fontSize:"clamp(1.4rem,3vw,1.9rem)",fontWeight:900,color:["#f97316","#22d3ee","#4ade80","#a78bfa"][i],lineHeight:1}}>
              <AnimCounter target={v} suffix={s}/>
            </p>
            <p style={{fontSize:".72rem",color:"#475569",marginTop:5}}>{l}</p>
          </div>
        ))}
      </div>

      {/* ── المميزات التفاعلية ── */}
      <div style={{padding:"0 0 48px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span className="badge b-v" style={{marginBottom:10}}>المميزات</span>
          <h2 style={{fontSize:"clamp(1.4rem,3vw,1.9rem)",fontWeight:900,color:"#fff"}}>كل اللي تحتاجه في مكان واحد</h2>
        </div>
        <div className="landing-feat-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {/* أزرار الاختيار */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {FEATURES.map((f,i)=>(
              <button key={i} onClick={()=>setActiveFeature(i)} style={{
                padding:"16px 18px",borderRadius:16,cursor:"pointer",textAlign:"right",
                border:`1.5px solid ${activeFeature===i?f.color+"55":"rgba(255,255,255,.07)"}`,
                background:activeFeature===i?f.color+"0d":"rgba(255,255,255,.025)",
                transition:"all .25s",display:"flex",gap:13,alignItems:"flex-start"
              }}>
                <div style={{width:40,height:40,borderRadius:11,flexShrink:0,
                  background:activeFeature===i?f.color+"18":"rgba(255,255,255,.06)",
                  border:`1px solid ${activeFeature===i?f.color+"35":"rgba(255,255,255,.08)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",
                  transition:"all .25s"}}>
                  {f.icon}
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontWeight:800,color:activeFeature===i?f.color:"#fff",fontSize:".9rem",marginBottom:4,transition:"color .2s"}}>{f.title}</p>
                  <p style={{fontSize:".75rem",color:"#64748b",lineHeight:1.65}}>{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {/* العرض التفاعلي */}
          <div className="feat-demo" style={{position:"sticky",top:80,alignSelf:"start"}}>
            <div style={{borderRadius:20,overflow:"hidden",border:`1px solid ${FEATURES[activeFeature].color}25`,
              background:"rgba(10,18,40,.95)",transition:"border-color .3s",
              boxShadow:`0 20px 60px rgba(0,0,0,.5), 0 0 40px ${FEATURES[activeFeature].color}0d`}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",
                background:"rgba(255,255,255,.03)",display:"flex",alignItems:"center",gap:8}}>
                <div style={{display:"flex",gap:5}}>{["#f87171","#fbbf24","#4ade80"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}</div>
                <p style={{fontSize:".65rem",color:"#334155",fontWeight:600}}>fahmni.sa — {FEATURES[activeFeature].title}</p>
              </div>
              <div style={{padding:"18px",animation:"scaleIn .3s cubic-bezier(.22,1,.36,1)"}}>
                {FEATURES[activeFeature].demo}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── الأبواب ── */}
      {(()=>{
        const[active,setActive]=useState(null);
        const ICONS={"النسبة والتناسب":"⚖️","الأعمار":"🎂","المتوسط الحسابي":"📊","السرعة والمسافة والزمن":"🚗","الأرباح والنسب المئوية":"💰","الجبر والمعادلات":"🔣","المتتاليات والأنماط":"🔢","المثلثات":"📐","المربعات والمستطيلات":"⬜","الزوايا والأضلاع":"📏","الدوائر":"⭕","تحليل البيانات والإحصاء":"📉","المقارنة الكمية":"⚡","إكمال الجمل":"✏️","التناظر اللفظي":"🔗","استيعاب المقروء":"📖","الخطأ السياقي":"🔍"};
        const TIPS={"النسبة والتناسب":"حدّد أولاً: هل العلاقة طردية أم عكسية؟","الأعمار":"الفرق بين عمرين لا يتغير أبداً مع الزمن!","المتوسط الحسابي":"المجموع = المتوسط × عدد الأرقام","السرعة والمسافة والزمن":"المسافة = السرعة × الزمن — وحّد الوحدات دائماً","الأرباح والنسب المئوية":"الربح = سعر البيع − سعر التكلفة","الجبر والمعادلات":"اعزل المجهول وطبّق نفس العملية على الطرفين","المتتاليات والأنماط":"ابحث عن الفرق الثابت أو المضاعف","المثلثات":"مجموع الزوايا دائماً = 180°","المربعات والمستطيلات":"المحيط = 2(الطول + العرض) ، المساحة = ط × ع","الزوايا والأضلاع":"الزوايا المتبادلة والمتقابلة للرأس متساوية","الدوائر":"المساحة = π × نق² ، المحيط = 2 × π × نق","تحليل البيانات والإحصاء":"المدى = أكبر قيمة − أصغر قيمة","المقارنة الكمية":"قد يكون أ>ب أو أ<ب أو أ=ب أو لا يمكن تحديده","إكمال الجمل":"ابحث عن الكلمة التي تكمل المعنى المنطقي","التناظر اللفظي":"حدّد العلاقة بين الكلمتين الأولى ثم طبّقها","استيعاب المقروء":"اقرأ السؤال أولاً ثم ابحث عن الإجابة في النص","الخطأ السياقي":"ابحث عن الكلمة التي لا تنسجم مع سياق الجملة"};
        const PCTS={"النسبة والتناسب":"~10%","الأعمار":"~6%","المتوسط الحسابي":"~6%","السرعة والمسافة والزمن":"~8%","الأرباح والنسب المئوية":"~10%","الجبر والمعادلات":"~12%","المتتاليات والأنماط":"~11%","المثلثات":"~7%","المربعات والمستطيلات":"~7%","الزوايا والأضلاع":"~5%","الدوائر":"~5%","تحليل البيانات والإحصاء":"~13%","المقارنة الكمية":"موجود","إكمال الجمل":"~30%","التناظر اللفظي":"~25%","استيعاب المقروء":"~30%","الخطأ السياقي":"~15%"};
        const isVerbal=t=>TOPICS.لفظي.includes(t);
        const activeData=active?{tip:TIPS[active],icon:ICONS[active]||"📌",pct:PCTS[active],verbal:isVerbal(active),concept:CONCEPTS[active]}:null;
        return(
        <div style={{padding:"40px 0",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <span className="badge b-o" style={{marginBottom:10}}>17 باب</span>
            <h2 style={{fontSize:"1.6rem",fontWeight:900,color:"#fff",marginBottom:8}}>يغطي كل أبواب القدرات</h2>
            <p style={{color:"#475569",fontSize:".85rem"}}>كمي ولفظي — حسب المنهج الرسمي لمركز القياس · <span style={{color:"#f97316"}}>اضغط على أي باب لمعاينته</span></p>
          </div>

          {/* Topic cards grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:8,marginBottom:active?16:0}}>
            {[...TOPICS.كمي,...TOPICS.لفظي].map((t,i)=>{
              const isActive=active===t;
              const verbal=isVerbal(t);
              const accentC=verbal?"#22d3ee":"#f97316";
              return(
                <div key={i}
                  onClick={()=>setActive(active===t?null:t)}
                  style={{
                    padding:"12px 13px",borderRadius:13,cursor:"pointer",
                    background:isActive?`rgba(${verbal?"34,211,238":"249,115,22"},.08)`:"rgba(255,255,255,.03)",
                    border:`1.5px solid ${isActive?`${accentC}50`:"rgba(255,255,255,.06)"}`,
                    display:"flex",alignItems:"center",gap:8,transition:"all .18s",
                    transform:isActive?"translateY(-2px)":"none",
                    boxShadow:isActive?`0 4px 16px ${accentC}20`:"none"
                  }}
                  onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor=`${accentC}30`;e.currentTarget.style.background=`rgba(${verbal?"34,211,238":"249,115,22"},.04)`;e.currentTarget.style.transform="translateY(-1px)";}}}
                  onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.transform="none";}}}>
                  <span style={{fontSize:".95rem",flexShrink:0}}>{ICONS[t]||"📌"}</span>
                  <span style={{fontSize:".73rem",fontWeight:600,color:isActive?accentC:"#94a3b8",lineHeight:1.3}}>{t}</span>
                  {isActive&&<span style={{marginRight:"auto",fontSize:".6rem",color:accentC,flexShrink:0}}>▴</span>}
                </div>
              );
            })}
          </div>

          {/* Expandable info card — shows in-place without navigation */}
          {active&&activeData&&(
            <div className="au" style={{
              borderRadius:16,overflow:"hidden",
              border:`1.5px solid ${activeData.verbal?"rgba(34,211,238,.25)":"rgba(249,115,22,.25)"}`,
              background:activeData.verbal?"rgba(34,211,238,.04)":"rgba(249,115,22,.04)",
              marginTop:4
            }}>
              {/* Header */}
              <div style={{
                padding:"16px 20px",
                background:activeData.verbal?"rgba(34,211,238,.06)":"rgba(249,115,22,.06)",
                borderBottom:`1px solid ${activeData.verbal?"rgba(34,211,238,.12)":"rgba(249,115,22,.12)"}`,
                display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:"1.5rem"}}>{activeData.icon}</span>
                  <div>
                    <p style={{fontWeight:900,color:"#fff",fontSize:".95rem"}}>{active}</p>
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <span className={`badge ${activeData.verbal?"b-c":"b-o"}`} style={{fontSize:".6rem"}}>{activeData.verbal?"لفظي":"كمي"}</span>
                      <span className="badge b-v" style={{fontSize:".6rem"}}>{activeData.pct} من الاختبار</span>
                    </div>
                  </div>
                </div>
                <button onClick={()=>setActive(null)} style={{background:"none",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#64748b",fontSize:".75rem",fontFamily:"Cairo,sans-serif"}}>✕ إغلاق</button>
              </div>

              {/* Body */}
              <div style={{padding:"16px 20px",display:"grid",gap:10}}>
                {/* Quick tip */}
                <div style={{padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)"}}>
                  <p style={{fontSize:".67rem",color:activeData.verbal?"#22d3ee":"#f97316",fontWeight:700,marginBottom:4}}>💡 النكتة الذهبية</p>
                  <p style={{fontSize:".85rem",color:"#e2e8f0",lineHeight:1.75,fontWeight:600}}>{activeData.tip}</p>
                </div>
                {/* Formula if exists */}
                {activeData.concept?.formula&&activeData.concept.formula!=="—"&&(
                  <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(249,115,22,.06)",border:"1px solid rgba(249,115,22,.15)"}}>
                    <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,marginBottom:4}}>📐 الصيغة</p>
                    <p style={{fontSize:".82rem",color:"#fdba74",lineHeight:1.6}}>{activeData.concept.formula}</p>
                  </div>
                )}
                {/* Trap */}
                {activeData.concept?.trap&&(
                  <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(248,113,113,.05)",border:"1px solid rgba(248,113,113,.15)"}}>
                    <p style={{fontSize:".82rem",color:"#fca5a5",lineHeight:1.6}}>{activeData.concept.trap}</p>
                  </div>
                )}
                {/* CTA */}
                <button className="btn btn-p" style={{width:"100%",justifyContent:"center",fontSize:".88rem"}} onClick={()=>go("signup")}>
                  تدرّب على {active} الآن ←
                </button>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* ── كيف يشتغل ── */}
      <div style={{padding:"40px 0",borderTop:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span className="badge b-c" style={{marginBottom:10}}>كيف تبدأ</span>
          <h2 style={{fontSize:"1.6rem",fontWeight:900,color:"#fff"}}>3 خطوات وأنت جاهز</h2>
        </div>
        <div className="landing-steps" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {[
            {n:"01",ic:"🎯",t:"اختبار التحديد",d:"6 أسئلة تحدد مستواك وتبني لك خطة ذكية مخصصة.",c:"#f97316"},
            {n:"02",ic:"🤖",t:"تدرّب مع AI",d:"أسئلة لا تنتهي مع شرح فوري + تحليل المعلم بعد كل 5 أسئلة.",c:"#a78bfa"},
            {n:"03",ic:"⚡",t:"اختبر نفسك",d:"محاكاة قياس كاملة — نفس الوقت ونفس الأسئلة.",c:"#22d3ee"},
          ].map((s,i)=>(
            <div key={i} className={`gl au d${i+1} landing-step-card`} style={{padding:"24px 20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:14,left:14,fontSize:"2.5rem",fontWeight:900,color:s.c,opacity:.08,lineHeight:1}}>{s.n}</div>
              <div style={{width:44,height:44,borderRadius:13,background:`${s.c}18`,border:`1.5px solid ${s.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:14}}>{s.ic}</div>
              <h3 style={{fontWeight:800,color:"#fff",fontSize:".92rem",marginBottom:7}}>{s.t}</h3>
              <p style={{fontSize:".78rem",color:"#64748b",lineHeight:1.75}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA النهائي ── */}
      <div style={{padding:"clamp(24px,5vw,48px) clamp(20px,4vw,32px)",borderRadius:24,
        background:"linear-gradient(135deg,rgba(249,115,22,.12),rgba(251,146,60,.08),rgba(34,211,238,.06))",
        border:"1.5px solid rgba(249,115,22,.25)",textAlign:"center",
        position:"relative",overflow:"hidden",marginTop:8}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 80% at 50% 50%,rgba(249,115,22,.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <h2 style={{fontSize:"clamp(1.4rem,4vw,2.2rem)",fontWeight:900,color:"#fff",marginBottom:10}}>
            جاهز ترفع درجتك في القدرات؟
          </h2>
          <p style={{color:"#64748b",marginBottom:24,fontSize:".9rem",lineHeight:1.8}}>
            10 أسئلة مجاناً · لا يحتاج بطاقة · ابدأ الآن
          </p>
          <div className="landing-cta-btns" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-p" style={{fontSize:"1.05rem",padding:"15px 36px",borderRadius:16}} onClick={()=>go("signup")}>
              ابدأ مجانًا الآن ←
            </button>
            <button className="btn btn-g" style={{fontSize:".92rem",padding:"15px 24px",borderRadius:16}} onClick={()=>go("pricing")}>
              عرض الأسعار
            </button>
          </div>
          <p style={{marginTop:18,fontSize:".72rem",color:"#334155"}}>
            ✓ بدون إعلانات · ✓ بدون حفظ بيانات · ✓ إلغاء في أي وقت
          </p>
        </div>
      </div>

      {/* ── روابط قانونية ── */}
      <div style={{
        marginTop:32,paddingTop:20,
        borderTop:"1px solid rgba(255,255,255,.05)",
        display:"flex",flexDirection:"column",alignItems:"center",gap:12
      }}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
          {[["privacy","سياسة الخصوصية"],["terms","الشروط والأحكام"],["contact","تواصل معنا"]].map(([p,l])=>(
            <button key={p} onClick={()=>go(p)} style={{
              background:"none",border:"none",cursor:"pointer",
              fontSize:".76rem",color:"#334155",fontFamily:"Cairo,sans-serif",
              padding:"5px 10px",borderRadius:8,transition:"color .15s"
            }}
            onMouseEnter={e=>e.target.style.color="#f97316"}
            onMouseLeave={e=>e.target.style.color="#334155"}>
              {l}
            </button>
          ))}
        </div>
        <p style={{fontSize:".65rem",color:"#1e293b"}}>© {new Date().getFullYear()} فهمني — المملكة العربية السعودية 🇸🇦</p>
      </div>

    </div>
  );
}

/* ═══════════════════ SUPABASE AUTH API ═══════════════════ */
const sbSignup=async(name,email,password)=>{
  const r=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON},
    body:JSON.stringify({email,password,data:{full_name:name}})
  });
  const d=await r.json();
  if(d.error||d.msg) throw new Error(d.error?.message||d.msg||"فشل إنشاء الحساب");
  return d;
};
const sbLogin=async(email,password)=>{
  const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON},
    body:JSON.stringify({email,password})
  });
  const d=await r.json();
  if(d.error_description||d.error) throw new Error(d.error_description||d.error||"بيانات خاطئة");
  return d;
};
const sbLogout=async(token)=>{
  await fetch(`${SUPABASE_URL}/auth/v1/logout`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${token}`}
  }).catch(()=>{});
};

/* ═══════════════════ SUPABASE DB ═══════════════════ */

/* ── إعادة تعيين كلمة المرور ── */
async function sbResetPassword(email){
  const r=await fetch(`${SUPABASE_URL}/auth/v1/recover`,{
    method:"POST",
    headers:{"apikey":SUPABASE_ANON,"Content-Type":"application/json"},
    body:JSON.stringify({email})
  });
  if(!r.ok){const e=await r.json();throw new Error(e.error_description||e.msg||"فشل الإرسال");}
  return true;
}
const sbH=(token)=>({"Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${token}`,"Prefer":"return=minimal"});


/* ─── Daily Goal Helpers (localStorage) ─── */
const getDailyKey=()=>`fahmni_daily_${new Date().toISOString().split("T")[0]}`;
const getDailyStats=()=>{
  try{
    const d=localStorage.getItem(getDailyKey());
    return d?JSON.parse(d):{done:0,goal:5};
  }catch{return{done:0,goal:5};}
};
const setDailyDone=(n)=>{
  try{
    const k=getDailyKey();
    const s=getDailyStats();
    localStorage.setItem(k,JSON.stringify({...s,done:n}));
    // Clean old keys (keep last 7 days)
    const today=new Date();
    for(let i=8;i<30;i++){
      const old=new Date(today);old.setDate(today.getDate()-i);
      localStorage.removeItem(`fahmni_daily_${old.toISOString().split("T")[0]}`);
    }
  }catch{}
};
const setDailyGoal=(g)=>{
  try{localStorage.setItem(getDailyKey(),JSON.stringify({...getDailyStats(),goal:g}));}catch{}
};

const sbLoadProgress=async(userId,token)=>{
  if(IS_ARTIFACT) return null;
  try{
    const[pRes,mRes]=await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=total_solved,total_correct,current_streak,trial_used,trial_limit,plan,subscribed_until,placement_done,placement_level`,{headers:sbH(token)}),
      fetch(`${SUPABASE_URL}/rest/v1/saved_mistakes?user_id=eq.${userId}&select=question_snapshot,is_reviewed&order=created_at.desc&limit=50`,{headers:sbH(token)})
    ]);
    const[profiles,mistakes]=await Promise.all([pRes.json(),mRes.json()]);
    const p=Array.isArray(profiles)&&profiles[0];
    const m=Array.isArray(mistakes)?mistakes.map(x=>{const s=x.question_snapshot||{};return{q:s.q||"",chosen:s.chosen||"",correctAns:s.correctAns||"",topic:s.topic||"",section:s.section||"",steps:s.steps||[],tip:s.tip||"",ok:false};}):[];
    return{totalSolved:p?.total_solved||0,correct:p?.total_correct||0,streak:p?.current_streak||0,trialUsed:p?.trial_used||0,trialLimit:p?.trial_limit||20,plan:p?.plan||'free',subscribedUntil:p?.subscribed_until||null,placementDone:p?.placement_done||false,placementLevel:p?.placement_level||null,mistakes:m};
  }catch(e){return null;}
};

const sbSavePlacement=async(userId,token,level)=>{
  if(IS_ARTIFACT||!userId||userId==="guest") return;
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,{
      method:"PATCH",
      headers:{...sbH(token),"Prefer":"return=minimal"},
      body:JSON.stringify({placement_done:true,placement_level:level})
    });
  }catch(e){}
};

/* ═══════════════════ TOAST SYSTEM ═══════════════════ */
function useToast(){
  const[toasts,setToasts]=React.useState([]);
  const show=React.useCallback((msg,type="info",duration=3000)=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),duration);
  },[]);
  const ToastContainer=()=>toasts.length===0?null:(
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{flexShrink:0}}>{t.type==="success"?"✅":t.type==="error"?"❌":"💬"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
  return{show,ToastContainer};
}

/* ═══════════════════ QUESTION BANK — DB HELPERS ═══════════════════ */

// hash بسيط للسؤال — يمنع التكرار
async function hashQuestion(text){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

// اسحب سؤال من DB للمستخدم (لم يرَه من قبل)
const sbGetQuestion=async(userId,token,{topic,section,difficulty})=>{
  if(IS_ARTIFACT||!userId||userId==="guest") return null;
  try{
    const r=await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/get_question_for_user`,
      {method:"POST",
       headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${token}`},
       body:JSON.stringify({p_user_id:userId,p_topic:topic,p_section:section,p_difficulty:difficulty})}
    );
    if(!r.ok) return null;
    const rows=await r.json();
    return Array.isArray(rows)&&rows.length>0 ? rows[0] : null;
  }catch(e){ return null; }
};

// احفظ سؤال جديد في DB
const sbSaveQuestion=async(token,q,{topic,section,difficulty})=>{
  if(IS_ARTIFACT||!token) return null;
  try{
    const hash=await hashQuestion(q.question||"");
    const r=await fetch(
      `${SUPABASE_URL}/rest/v1/questions`,
      {method:"POST",
       headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON,
                "Authorization":`Bearer ${token}`,"Prefer":"return=representation"},
       body:JSON.stringify({
         section, topic, difficulty,
         question_text : q.question,
         options       : q.options,
         correct       : q.correct,
         explanation_title: q.explanation_title||"الحل",
         steps         : q.steps||[],
         tip           : q.tip||"",
         shape         : q.shape||null,
         question_hash : hash,
         ai_generated  : true
       })}
    );
    if(!r.ok) return null;
    const rows=await r.json();
    return Array.isArray(rows)&&rows[0] ? rows[0].id : null;
  }catch(e){ return null; }
};

// سجّل أن المستخدم رأى السؤال
const sbMarkSeen=async(userId,token,questionId)=>{
  if(IS_ARTIFACT||!userId||!questionId) return;
  try{
    await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/mark_question_seen`,
      {method:"POST",
       headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${token}`},
       body:JSON.stringify({p_user_id:userId,p_question_id:questionId})}
    );
  }catch(e){}
};

const sbSaveProgress=async(userId,token,{totalSolved,correct,streak})=>{
  if(IS_ARTIFACT||!userId||userId==="guest") return;
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,{
      method:"PATCH",headers:sbH(token),
      body:JSON.stringify({total_solved:totalSolved,total_correct:correct,current_streak:streak,updated_at:new Date().toISOString()})
    });
  }catch(e){}
};

const sbSaveMistake=async(userId,token,m)=>{
  if(IS_ARTIFACT||!userId||userId==="guest") return;
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/saved_mistakes`,{
      method:"POST",headers:sbH(token),
      body:JSON.stringify({user_id:userId,question_snapshot:{q:m.q,chosen:m.chosen,correctAns:m.correctAns,topic:m.topic,section:m.section,steps:m.steps||[],tip:m.tip||""}})
    });
  }catch(e){}
};

const sbCreateProfile=async(userId,token,name)=>{
  if(IS_ARTIFACT) return;
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`,{
      method:"POST",headers:{...sbH(token),"Prefer":"resolution=ignore-duplicates"},
      body:JSON.stringify({id:userId,full_name:name,total_solved:0,total_correct:0,current_streak:0,trial_used:0,trial_limit:10,plan:'free',placement_done:false,placement_level:null})
    });
  }catch(e){}
};

function Auth({mode,go,onLogin}){
  const isLogin=mode==="login";
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[pass2,setPass2]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[info,setInfo]=useState("");
  const[forgotMode,setForgotMode]=useState(false);
  const IS_ARTIFACT=typeof window!=="undefined"&&(window.location.hostname.includes("claude.ai")||window.location.hostname==="localhost");

// ── حساب المؤسس — غيّر هذا الإيميل لإيميلك ──
const OWNER_EMAIL="sirfaisalalshehri@gmail.com"; // ← غيّره لإيميلك في Supabase
const isOwner=(email)=>email&&email.toLowerCase()===OWNER_EMAIL.toLowerCase();


/* ═══ PLAN HELPERS ═══════════════════════════════════════════
 *  free  → 10 سؤال مجاني فقط
 *  month → أسئلة غير محدودة + شرح + محاكاة + تتبع
 *  exam  → كل شيء + تحليل الضعف + خطة مذاكرة
 * ══════════════════════════════════════════════════════════ */
const PLAN_ACCESS={
  free:   {unlimitedQ:false, deepAnalysis:false, studyPlan:false, simulation:false},
  month:  {unlimitedQ:true,  deepAnalysis:false, studyPlan:false, simulation:true},
  exam:   {unlimitedQ:true,  deepAnalysis:true,  studyPlan:true,  simulation:true},
};
const canAccess=(trial,feature)=>{
  if(!trial) return false;
  if(trial.isSubscribed){
    const access=PLAN_ACCESS[trial.plan]||PLAN_ACCESS.month;
    return access[feature]??true;
  }
  return false;
};

  const guestLogin=()=>{
    const guestName=name||"طالب";
    onLogin({token:"guest",userId:"guest",name:guestName,email:"guest@fahmni.sa",isGuest:true,trialUsed:0,trialLimit:5});
  };

  const sendReset=async()=>{
    setErr("");setInfo("");
    if(!email){setErr("أدخل بريدك الإلكتروني");return;}
    setLoading(true);
    try{
      await sbResetPassword(email);
      setInfo("✉️ تم إرسال رابط إعادة التعيين! تحقق من بريدك.");
    }catch(e){setErr(e.message||"حدث خطأ، حاول مرة أخرى");}
    finally{setLoading(false);}
  };

  const submit=async()=>{
    setErr("");setInfo("");
    if(IS_ARTIFACT){guestLogin();return;}
    if(!email||!pass){setErr("أدخل البريد وكلمة المرور");return;}
    if(!isLogin&&!name){setErr("أدخل اسمك");return;}
    if(!isLogin&&pass!==pass2){setErr("كلمتا المرور غير متطابقتين");return;}
    if(pass.length<6){setErr("كلمة المرور 6 أحرف على الأقل");return;}
    setLoading(true);
    try{
      if(isLogin){
        const d=await sbLogin(email,pass);
        // تحقق إن البريد مؤكد
        if(!d.user?.email_confirmed_at){
          setErr("📧 بريدك غير مؤكد — تحقق من إيميلك وافتح رابط التأكيد أولاً");
          return;
        }
        const userName=d.user?.user_metadata?.full_name||d.user?.email?.split("@")[0]||"طالب";
        onLogin({token:d.access_token,userId:d.user?.id,name:userName,email:d.user?.email});
      }else{
        const d=await sbSignup(name,email,pass);
        // لو رجع access_token — تحقق إن البريد مؤكد فعلاً
        if(d.access_token && d.user?.email_confirmed_at){
          const userName=d.user?.user_metadata?.full_name||name||d.user?.email?.split("@")[0]||"طالب";
          onLogin({token:d.access_token,userId:d.user?.id,name:userName,email:d.user?.email});
        }else{
          // إما تأكيد البريد مفعّل أو البريد غير مؤكد — لا تدخله
          setInfo("✉️ تم إنشاء حسابك! تحقق من بريدك لتفعيله ثم سجّل دخولك.");
        }
      }
    }catch(e){setErr(e.message||"حدث خطأ، حاول مرة أخرى");}
    finally{setLoading(false);}
  };

  /* ── وضع نسيت كلمة المرور ── */
  if(forgotMode) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:"0 16px"}}>
      <div className="gl au" style={{width:"100%",maxWidth:400,padding:"clamp(24px,5vw,36px)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:"2.5rem",marginBottom:10}}>🔑</div>
          <h2 style={{fontWeight:900,color:"#fff",marginBottom:6}}>نسيت كلمة المرور؟</h2>
          <p style={{fontSize:".82rem",color:"#64748b",lineHeight:1.75}}>أدخل بريدك وسنرسل لك رابط إعادة التعيين</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <input className="inp" placeholder="البريد الإلكتروني" type="email" value={email}
            onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&sendReset()}/>
          {err&&<div style={{padding:"10px 14px",borderRadius:11,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)"}}><p style={{fontSize:".8rem",color:"#fca5a5"}}>{err}</p></div>}
          {info&&<div style={{padding:"10px 14px",borderRadius:11,background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.22)"}}><p style={{fontSize:".8rem",color:"#86efac"}}>{info}</p></div>}
          <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"13px",marginTop:4}}
            disabled={loading} onClick={sendReset}>
            {loading?<><div className="spin"/> جاري الإرسال...</>:"إرسال الرابط ←"}
          </button>
          <button className="btn btn-g" style={{width:"100%",justifyContent:"center"}}
            onClick={()=>{setForgotMode(false);setErr("");setInfo("");}}>
            ← العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );

  return(
    <div className="rg-2" style={{display:"grid",gap:16}}>
      <div className="gl" style={{padding:"40px 30px"}}>
        <span className={`badge ${isLogin?"b-o":"b-c"}`} style={{marginBottom:12}}>{isLogin?"أهلًا بك":"بداية جديدة"}</span>
        <h1 style={{fontSize:"1.9rem",fontWeight:900,color:"#fff",lineHeight:1.2}}>{isLogin?"تسجيل الدخول":"إنشاء حساب"}</h1>
        <p style={{marginTop:11,fontSize:".85rem",lineHeight:1.9,color:"#64748b"}}>{isLogin?"ادخل حتى تكمل من آخر جلسة.":"أنشئ حسابك ونرتب لك المسار."}</p>
        {IS_ARTIFACT?(
          <div style={{marginTop:22,padding:"14px 16px",borderRadius:13,background:"rgba(249,115,22,.08)",border:"1px solid rgba(249,115,22,.25)"}}>
            <p style={{fontSize:".75rem",color:"#fdba74",fontWeight:700,marginBottom:6}}>⚡ وضع المعاينة</p>
            <p style={{fontSize:".72rem",color:"#94a3b8",lineHeight:1.8}}>الـ Auth الحقيقي يشتغل على الموقع المنشور.<br/>هنا اكتب اسمك واضغط دخول للتجربة.</p>
          </div>
        ):(
          <div style={{marginTop:22,padding:"14px 16px",borderRadius:13,background:"rgba(34,211,238,.06)",border:"1px solid rgba(34,211,238,.16)"}}>
            <p style={{fontSize:".72rem",color:"#67e8f9",lineHeight:1.8}}>🔒 محمي بـ <strong>Supabase Auth</strong> — كلمة مرورك مشفّرة</p>
          </div>
        )}
      </div>
      <div className="gl" style={{padding:"28px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {!isLogin&&<input className="inp" placeholder="الاسم الكامل" value={name} onChange={e=>setName(e.target.value)}/>}
          <input className="inp" placeholder="البريد الإلكتروني" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input className="inp" placeholder="كلمة المرور (6 أحرف+)" type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {!isLogin&&<input className="inp" placeholder="تأكيد كلمة المرور" type="password" value={pass2} onChange={e=>setPass2(e.target.value)}/>}
          {err&&<div style={{padding:"10px 14px",borderRadius:11,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)"}}><p style={{fontSize:".8rem",color:"#fca5a5"}}>{err}</p></div>}
          {info&&<div style={{padding:"10px 14px",borderRadius:11,background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.22)"}}><p style={{fontSize:".8rem",color:"#86efac"}}>{info}</p></div>}
          {IS_ARTIFACT?(
            <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:4}}>
              <input className="inp" placeholder="اسمك (اختياري)" value={name} onChange={e=>setName(e.target.value)}/>
              <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"13px"}} onClick={guestLogin}>
                ⚡ ادخل وجرّب فهمني الآن ←
              </button>
              <p style={{fontSize:".69rem",color:"#475569",textAlign:"center"}}>على الموقع الحقيقي يطلب بريد وكلمة مرور</p>
            </div>
          ):(
            <>
              <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"13px",marginTop:4}} disabled={loading} onClick={submit}>
                {loading?<><div className="spin"/> جاري...</>:isLogin?"تسجيل الدخول ←":"إنشاء الحساب ←"}
              </button>
              {isLogin&&(
                <button className="btn btn-g" style={{width:"100%",justifyContent:"center",fontSize:".8rem",color:"#64748b"}}
                  onClick={()=>{setForgotMode(true);setErr("");setInfo("");}}>
                  🔑 نسيت كلمة المرور؟
                </button>
              )}
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setErr("");setInfo("");go(isLogin?"signup":"login");}}>
                {isLogin?"إنشاء حساب جديد":"عندي حساب بالفعل"}
              </button>
            </>
          )}
          <button className="btn btn-g" style={{width:"100%",justifyContent:"center",fontSize:".78rem",color:"#475569"}} onClick={()=>go("landing")}>← العودة للرئيسية</button>
        </div>
      </div>
    </div>
  );
}

function Onboarding({finish}){
  const[goal,setGoal]=useState("أرفع درجتي");const[conf,setConf]=useState("متوسط");const[sec,setSec]=useState("كمي");const[mins,setMins]=useState("40");
  return(<div className="rg-onboard" style={{gap:14}}><div style={{display:"flex",flexDirection:"column",gap:12}}>
    {[{n:1,lbl:"هدفك؟",items:[{v:"أرفع درجتي",d:"خطة ترفع مستواي."},{v:"أثبت مستواي",d:"أركز على نقاط الضعف."},{v:"أبدأ من الأساس",d:"بداية مرتبة."}],val:goal,set:setGoal},{n:2,lbl:"مستواك الحالي؟",items:[{v:"ضعيف",d:"أحتاج تأسيس."},{v:"متوسط",d:"فيه تذبذب."},{v:"جيد",d:"أحتاج تطبيقًا."}],val:conf,set:setConf}].map(({n,lbl,items,val,set})=>(<div key={n} className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>{n}) {lbl}</p><div style={{display:"flex",flexDirection:"column",gap:8}}>{items.map(it=>(<button key={it.v} className={`sc ${val===it.v?"on":""}`} onClick={()=>set(it.v)}><p style={{fontWeight:800,color:"#fff"}}>{it.v}</p><p style={{marginTop:4,fontSize:".76rem",color:"#64748b",lineHeight:1.6}}>{it.d}</p></button>))}</div></div>))}
    <div className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>3) تبدأ من؟</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{v:"كمي",d:"رياضيات"},{v:"لفظي",d:"لغة"}].map(it=>(<button key={it.v} className={`sc ${sec===it.v?"on":""}`} onClick={()=>setSec(it.v)}><p style={{fontWeight:800,color:"#fff"}}>{it.v}</p><p style={{marginTop:3,fontSize:".75rem",color:"#64748b"}}>{it.d}</p></button>))}</div></div>
    <div className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>4) وقتك اليومي</p><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{[{v:"20",d:"خفيفة"},{v:"40",d:"متوازنة"},{v:"60",d:"مكثفة"}].map(it=>(<button key={it.v} className={`sc ${mins===it.v?"on":""}`} onClick={()=>setMins(it.v)}><p style={{fontWeight:800,color:"#fff"}}>{it.v} دقيقة</p><p style={{marginTop:3,fontSize:".73rem",color:"#64748b"}}>{it.d}</p></button>))}</div></div>
  </div>
  <div className="gl" style={{padding:"20px",position:"sticky",top:20,alignSelf:"start"}}><span className="badge b-c" style={{marginBottom:12}}>الخطوة التالية</span><h2 style={{fontSize:"1.2rem",fontWeight:900,color:"#fff",marginBottom:8}}>اختبار تحديد المستوى</h2><p style={{fontSize:".78rem",lineHeight:1.8,color:"#64748b",marginBottom:14}}>6 أسئلة سريعة — نبني خطتك منها.</p>{[["الهدف",goal],["المستوى",conf],["القسم",sec],["الوقت",`${mins} دقيقة`]].map(([k,v])=>(<div key={k} className="gl2" style={{padding:"9px 12px",display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:".76rem",fontWeight:700,color:"#f97316"}}>{v}</span><span style={{fontSize:".73rem",color:"#64748b"}}>{k}</span></div>))}<button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"12px",marginTop:14}} onClick={()=>finish({goal,confidence:conf,section:sec,minutes:mins})}>ابدأ اختبار التحديد ←</button></div>
  </div>);}

function PlacementResult({rec,score,onFinish}){if(!rec)return null;return(<div style={{display:"grid",gap:14}}><div className="gl gl-pad-lg" style={{padding:"38px 32px"}}><span className="badge b-g" style={{marginBottom:12}}>✓ تم تحليل بدايتك</span><h1 style={{fontSize:"1.85rem",fontWeight:900,color:"#fff",marginBottom:8}}>هذه أفضل بداية لك الآن</h1><div className="placement-stats rg-4" style={{gap:12,marginTop:20}}>{[["النتيجة",`${score}/${PLACEMENT_Q.length}`,"#f97316"],["المستوى",rec.level,"#22d3ee"],["الخطة",rec.plan,"#a78bfa"],["البداية",rec.topic,"#4ade80"]].map(([l,v,c],i)=>(<div key={i} className={`gl2 stat au d${i+1}`}><p style={{fontSize:".68rem",color:"#64748b"}}>{l}</p><p style={{marginTop:6,fontSize:"1.1rem",fontWeight:900,color:c,lineHeight:1.3}}>{v}</p></div>))}</div></div><div className="rg-2" style={{display:"grid",gap:14}}><div className="gl" style={{padding:"24px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>التوصية الذكية</p><div className="gl2" style={{padding:"14px",marginBottom:12}}><p style={{fontSize:".85rem",lineHeight:1.9,color:"#94a3b8"}}>{rec.msg}</p></div></div><div className="gl" style={{padding:"20px"}}><div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Ring pct={Math.round((score/PLACEMENT_Q.length)*100)} size={90}/></div><button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"11px"}} onClick={onFinish}>اعتمد هذه البداية ←</button></div></div></div>);}

function Dashboard({go,user,trial,mistakes}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]); 
  const acc=user.totalSolved?Math.round((user.correct/user.totalSolved)*100):0;
  const wrongCount=mistakes.length;
  const dailyDone=user.dailyDone||0;
  const dailyGoal=user.dailyGoal||5;
  const dailyPct=Math.min(Math.round((dailyDone/dailyGoal)*100),100);
  const dailyDone_=dailyDone>=dailyGoal;
  const[showGoalPicker,setShowGoalPicker]=useState(false);
  const[shareCopied,setShareCopied]=useState(false);

  /* ── Share result ── */
  const shareResult=()=>{
    const text=`📊 أداؤني في فهمني اليوم:
✅ ${dailyDone} سؤال محلول
🎯 دقة ${acc}%
🔥 سلسلة ${user.streak} يوم

جرّب معي على fahmni-silk.vercel.app`;
    if(navigator.share){navigator.share({title:"فهمني",text});}
    else{navigator.clipboard?.writeText(text).then(()=>{setShareCopied(true);setTimeout(()=>setShareCopied(false),2000);});}
  };

  /* ── Weekly history from localStorage ── */
  const weekData=Array.from({length:7}).map((_,i)=>{
    const d=new Date();d.setDate(d.getDate()-i);
    const key=`fahmni_daily_${d.toISOString().split("T")[0]}`;
    try{const s=localStorage.getItem(key);return s?JSON.parse(s).done||0:0;}catch{return 0;}
  }).reverse();
  const maxW=Math.max(...weekData,1);
  const dayNames=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const todayName=dayNames[new Date().getDay()];

  return(<div style={{display:"grid",gap:14}}>

    {/* ── Hero card ── */}
    <div className="gl" style={{padding:"clamp(20px,4vw,34px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
        <div style={{flex:1}}>
          <h1 style={{fontSize:"clamp(1.3rem,4vw,1.8rem)",fontWeight:900,color:"#fff",marginBottom:6}}>
            أهلًا {user.name} <span style={{color:"#f97316"}}>{acc>=80?"🏆":acc>=60?"⭐":acc>0?"📈":"💪"}</span>
            {trial?.isOwner&&<span style={{marginRight:8,fontSize:".7rem",padding:"3px 10px",borderRadius:99,background:"linear-gradient(135deg,rgba(250,204,21,.2),rgba(249,115,22,.15))",border:"1px solid rgba(250,204,21,.4)",color:"#fde047",fontWeight:700}}>👑 مؤسس</span>}
          </h1>
          <p style={{fontSize:".82rem",color:"#64748b",lineHeight:1.7}}>
            {dailyDone_?"✅ أكملت هدفك اليومي! رائع.":dailyDone>0?`${dailyGoal-dailyDone} سؤال متبقي لتحقق هدف اليوم`:"ابدأ جلستك اليومية الآن"}
          </p>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
          <button onClick={shareResult} style={{
            padding:"8px 14px",borderRadius:12,border:"1px solid rgba(34,211,238,.25)",
            background:"rgba(34,211,238,.07)",color:"#67e8f9",fontSize:".75rem",fontWeight:700,
            cursor:"pointer",fontFamily:"Cairo,sans-serif",display:"flex",alignItems:"center",gap:5
          }}>{shareCopied?"✅ نُسخ":"📤 شارك"}</button>
          <Ring pct={acc} size={72} color={acc>=70?"#4ade80":acc>=50?"#f97316":"#f87171"}/>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="rg-4" style={{gap:10,marginTop:18}}>
        {[
          ["الدقة",`${acc}%`,"#f97316"],
          ["أسئلة",""+user.totalSolved,"#22d3ee"],
          ["صحيح",""+user.correct,"#4ade80"],
          ["سلسلة",`${user.streak}🔥`,"#f97316"]
        ].map(([l,v,col],i)=>(
          <div key={i} className={`gl2 stat au d${i+1}`} style={{padding:"clamp(10px,2vw,16px)"}}>
            <p style={{fontSize:".65rem",color:"#64748b"}}>{l}</p>
            <p key={v} style={{marginTop:4,fontSize:"clamp(1rem,3vw,1.35rem)",fontWeight:900,color:col,animation:"numPop .4s cubic-bezier(.34,1.56,.64,1) both"}}>{v}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ── Daily Goal ── */}
    <div className="gl" style={{padding:"18px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"1.1rem"}}>{dailyDone_?"🎯":"⚡"}</span>
          <div>
            <p style={{fontWeight:800,color:"#fff",fontSize:".88rem"}}>هدف اليوم</p>
            <p style={{fontSize:".68rem",color:"#64748b"}}>{todayName}</p>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:900,color:dailyDone_?"#4ade80":"#f97316",fontSize:"1rem"}}>{dailyDone}/{dailyGoal}</span>
          <button onClick={()=>setShowGoalPicker(p=>!p)} style={{
            background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
            borderRadius:8,padding:"4px 9px",cursor:"pointer",fontSize:".68rem",
            color:"#94a3b8",fontFamily:"Cairo,sans-serif"
          }}>تعديل</button>
        </div>
      </div>
      <div style={{height:8,borderRadius:99,background:"rgba(255,255,255,.07)",overflow:"hidden",marginBottom:10}}>
        <div style={{height:"100%",borderRadius:99,width:`${dailyPct}%`,transition:"width .8s cubic-bezier(.22,1,.36,1)",
          background:dailyDone_?"linear-gradient(90deg,#4ade80,#22d3ee)":"linear-gradient(90deg,#f97316,#fb923c)"
        }}/>
      </div>
      {/* ── Goal picker ── */}
      {showGoalPicker&&(
        <div className="au" style={{display:"flex",gap:7,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <p style={{width:"100%",fontSize:".68rem",color:"#64748b",marginBottom:4}}>اختر هدفك اليومي:</p>
          {[3,5,10,15,20].map(g=>(
            <button key={g} onClick={()=>{
              setDailyGoal(g);
              setUser(u=>({...u,dailyGoal:g}));
              setShowGoalPicker(false);
            }} style={{
              padding:"7px 14px",borderRadius:10,cursor:"pointer",fontFamily:"Cairo,sans-serif",
              fontWeight:700,fontSize:".78rem",
              background:g===dailyGoal?"rgba(249,115,22,.2)":"rgba(255,255,255,.05)",
              border:`1px solid ${g===dailyGoal?"rgba(249,115,22,.5)":"rgba(255,255,255,.1)"}`,
              color:g===dailyGoal?"#f97316":"#94a3b8"
            }}>{g} أسئلة</button>
          ))}
        </div>
      )}
    </div>

    {/* ── Weekly chart ── */}
    <div className="gl" style={{padding:"18px 20px"}}>
      <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:14}}>📅 نشاطك هذا الأسبوع</p>
      <div style={{display:"flex",gap:6,alignItems:"flex-end",height:64}}>
        {weekData.map((val,i)=>{
          const isToday=i===6;
          const h=maxW>0?Math.round((val/maxW)*56)+8:8;
          const names=["","","","","","","اليوم"];
          const dIdx=(new Date().getDay()-6+i+7)%7;
          const nm=i===6?"اليوم":dayNames[dIdx]?.slice(0,3)||"";
          return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              {val>0&&<span style={{fontSize:".55rem",color:isToday?"#f97316":"#475569",fontWeight:700}}>{val}</span>}
              <div style={{
                width:"100%",height:h,borderRadius:6,transition:"height .6s cubic-bezier(.22,1,.36,1)",
                background:isToday?"linear-gradient(180deg,#f97316,#fb923c)":val>0?"rgba(249,115,22,.3)":"rgba(255,255,255,.06)",
                border:isToday?"1px solid rgba(249,115,22,.4)":"none"
              }}/>
              <span style={{fontSize:".58rem",color:isToday?"#f97316":"#334155",fontWeight:isToday?700:400,whiteSpace:"nowrap"}}>{nm}</span>
            </div>
          );
        })}
      </div>
    </div>

    {/* ── Quick actions ── */}
    <div className="gl" style={{padding:"20px"}}>
      <p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".1em",marginBottom:13}}>ابدأ بسرعة</p>
      <div className="dash-action-grid">
        {[
          {ic:"🤖",t:"جلسة AI",d:"سؤال + شرح فوري",p:"session",c:"#f97316",paid:false},
          {ic:"📋",t:"المراجعة",d:wrongCount+" سؤال",p:"review",c:"#f87171",paid:true},
          {ic:"⚡",t:"المحاكاة",d:"اختبار كامل",p:"sim",c:"#a78bfa",paid:true},
          {ic:"🗺️",t:"خريطة المسار",d:"18 باب منظم",p:"roadmap",c:"#22d3ee",paid:true}
        ].map((m,i)=>{
          const isLocked=m.paid&&!trial.isSubscribed;
          return(
            <div key={i} className={`gl2 au d${i+1}`} style={{padding:"clamp(13px,2vw,18px)",position:"relative",opacity:isLocked?0.75:1}}>
              {isLocked&&<span style={{position:"absolute",top:8,left:8,fontSize:".6rem",padding:"2px 7px",borderRadius:99,background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.25)",color:"#f97316"}}>🔒</span>}
              <div style={{fontSize:"1.5rem",marginBottom:8}}>{m.ic}</div>
              <h3 style={{fontWeight:800,color:"#fff",fontSize:".88rem",marginBottom:5}}>{m.t}</h3>
              <p style={{fontSize:".74rem",lineHeight:1.7,color:"#64748b",marginBottom:11}}>{m.d}</p>
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",fontSize:".77rem",padding:"8px 10px"}} onClick={()=>go(m.p)}>افتح</button>
            </div>
          );
        })}
      </div>
    </div>

    {/* ── Review reminder ── */}
    {wrongCount>0&&(
      <div style={{padding:"16px 20px",borderRadius:16,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <p style={{fontWeight:800,color:"#fca5a5"}}>📋 {wrongCount} سؤال في قائمة المراجعة</p>
          <p style={{marginTop:4,fontSize:".79rem",color:"#64748b"}}>راجع أخطاءك وثبّت الفهم.</p>
        </div>
        <button className="btn btn-p" style={{fontSize:".82rem"}} onClick={()=>go("review")}>ابدأ المراجعة ←</button>
      </div>
    )}

    {/* ── Free trial bar ── */}
    {!trial.isSubscribed&&(
      <div style={{padding:"16px 20px",borderRadius:16,background:"linear-gradient(135deg,rgba(249,115,22,.1),rgba(34,211,238,.06))",border:"1px solid rgba(249,115,22,.18)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <p style={{fontWeight:700,color:"#fdba74",marginBottom:6}}>التجربة المجانية — {trial.limit-trial.used} سؤال متبقي</p>
          <div className="pt" style={{width:"min(180px,60vw)"}}><div className="pf" style={{width:`${Math.min((trial.used/trial.limit)*100,100)}%`}}/></div>
        </div>
        <button className="btn btn-p" style={{fontSize:".82rem"}} onClick={()=>go("pricing")}>اشترك الآن ←</button>
      </div>
    )}

  </div>);}

function Bank({settings,setSettings,go,trial={}}){  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});if(!trial.isSubscribed&&trial.used>=trial.limit){go("paywall");}},[]); return(<div style={{display:"grid",gap:14}}><div className="gl" style={{padding:"30px"}}><span className="badge b-o" style={{marginBottom:11}}>بنك الأسئلة</span><h1 style={{fontSize:"1.75rem",fontWeight:900,color:"#fff",marginBottom:7}}>اختر مسارك ثم ابدأ</h1></div><div className="rg-3 bank-grid" style={{gap:14}}><div className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:11}}>القسم</p>{["كمي","لفظي"].map(s=>(<button key={s} className={`sc ${settings.section===s?"on":""}`} style={{marginBottom:8}} onClick={()=>setSettings(p=>({...p,section:s,topic:TOPICS[s][0]}))}><p style={{fontWeight:800,color:"#fff"}}>{s}</p></button>))}</div><div className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:11}}>الصعوبة</p>{[{v:"سهل",d:"بداية هادئة"},{v:"متوسط",d:"تثبيت"},{v:"صعب",d:"تحدٍّ"}].map(d=>(<button key={d.v} className={`sc ${settings.difficulty===d.v?"on":""}`} style={{marginBottom:8}} onClick={()=>setSettings(p=>({...p,difficulty:d.v}))}><p style={{fontWeight:800,color:"#fff"}}>{d.v}</p><p style={{marginTop:3,fontSize:".76rem",color:"#64748b"}}>{d.d}</p></button>))}</div><div className="gl" style={{padding:"18px"}}><p style={{fontSize:".68rem",color:"#f97316",fontWeight:700,letterSpacing:".08em",marginBottom:11}}>الباب</p><div style={{maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>{TOPICS[settings.section].map(t=>(<button key={t} className={`sc ${settings.topic===t?"on":""}`} style={{padding:"10px 13px"}} onClick={()=>setSettings(p=>({...p,topic:t}))}><div style={{display:"flex",alignItems:"center",gap:7}}>{GEO.includes(t)&&<span style={{fontSize:".6rem",padding:"1px 6px",borderRadius:99,background:"rgba(167,139,250,.12)",border:"1px solid rgba(167,139,250,.2)",color:"#c4b5fd"}}>📐</span>}<p style={{fontWeight:700,color:"#fff",fontSize:".84rem"}}>{t}</p></div></button>))}</div></div></div>
<div style={{padding:"22px 26px",borderRadius:18,background:"linear-gradient(135deg,rgba(34,211,238,.08),rgba(249,115,22,.06))",border:"1px solid rgba(34,211,238,.16)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}><div><p style={{fontSize:".68rem",color:"#67e8f9",fontWeight:700,marginBottom:5}}>جاهز</p><p style={{fontSize:"1.3rem",fontWeight:900,color:"#fff"}}>{settings.topic} · {settings.difficulty}</p></div><div style={{display:"flex",gap:9}}><button className="btn btn-out" style={{fontSize:".8rem"}} onClick={()=>go("diagnostic")}>🧪 تشخيص أولاً</button><button className="btn btn-p" style={{padding:"11px 22px"}} onClick={()=>go("session")}>ابدأ مباشرة ←</button></div></div>
</div>);}

/* ═══════════════════ TOPIC LESSON PANEL ═══════════════════ */
async function genTopicLesson(topic){
  const sec=deriveSec(topic);
  const prompt=`أنت مدرس خبير في اختبار القدرات (قياس). اشرح باب "${topic}" للطالب السعودي.

أجب بـ JSON فقط بهذا الهيكل (لا تكتب أي نص خارج JSON):
{
  "summary": "جملتان تشرحان ما هو الباب وأهميته في الاختبار",
  "key_rules": ["قانون/مبدأ أساسي 1","قانون/مبدأ أساسي 2","قانون/مبدأ أساسي 3","قانون/مبدأ أساسي 4"],
  "solved_example": {
    "question": "مثال حقيقي من نوع قياس",
    "steps": ["خطوة 1: ...","خطوة 2: ...","خطوة 3: ..."],
    "answer": "الإجابة النهائية",
    "trick": "الحيلة الذهنية لهذا النوع"
  },
  "common_mistakes": ["خطأ شائع 1","خطأ شائع 2","خطأ شائع 3"],
  "speed_tip": "نصيحة لحل الأسئلة بسرعة في الاختبار"
}`;
  const raw=await callClaude(prompt,1500);
  const clean=raw.replace(/```json|```/g,"").trim();
  const start=clean.indexOf("{"),end=clean.lastIndexOf("}");
  if(start===-1||end===-1) throw new Error("no JSON in response");
  try{ return JSON.parse(clean.slice(start,end+1)); }
  catch(err){ throw new Error("تعذّر قراءة رد AI — أعد المحاولة"); }
}

/* ═══════════════════ QUICK COACH (per-question AI) ═══════════════════ */
async function genQuickCoach({topic, ok, question, chosen, correctAns, history, userId=null}){
  const acc = history.length ? Math.round(history.filter(h=>h.ok).length/history.length*100) : (ok?100:0);
  const streak = (() => { let s=0; for(let i=history.length-1;i>=0;i--){ if(history[i].ok)s++; else break; } if(ok)s++; return s; })();
  const prompt = `أنت مدرس قدرات ذكي. طالب حل سؤال في "${topic}".
السؤال: "${question}"
أجاب بـ: "${chosen}" — ${ok?"صحيح ✓":"خطأ ✗"}
${!ok?`الصحيح: "${correctAns}"`:""}
دقته الكلية حتى الآن: ${acc}%

اكتب JSON فقط:
{"emoji":"${ok?"🎯":"💡"}","msg":"جملة واحدة تحليلية قصيرة (لا تزيد 12 كلمة) — إن كانت صحيحة اذكر ميزة الطالب، وإن كانت خاطئة اذكر السبب الجذري باختصار.","tip":"جملة واحدة تكتيكية للسؤال القادم (أقل من 10 كلمات)"}`;
  const raw = await callClaude(prompt, 100);
  const start=raw.indexOf("{"),end=raw.lastIndexOf("}");
  if(start===-1||end===-1) return {emoji:ok?"✓":"✗",msg:ok?"إجابة صحيحة، أحسنت!":"راجع الخطوات أسفله.",tip:""};
  try{ return JSON.parse(raw.slice(start,end+1)); }
  catch(err){ return {emoji:ok?"✓":"💡",msg:ok?"أحسنت، إجابة صحيحة!":"راجع طريقة الحل أسفله.",tip:""}; }
}

/* ═══════════════════ TOPIC LESSON PAGE ═══════════════════ */
function TopicLesson({topic,onClose,onStartPractice}){
  const[data,setData]=useState(null);
  const[loading,setLoading]=useState(true);
  const[err,setErr]=useState("");
  const sec=deriveSec(topic);
  const secColor=sec==="كمي"?"#f97316":"#22d3ee";
  const ytQuery=encodeURIComponent(`شرح قدرات ${topic} قياس`);
  const ytUrl=`https://www.youtube.com/results?search_query=${ytQuery}`;

  const load=()=>{
    setLoading(true);setErr("");setData(null);
    genTopicLesson(topic)
      .then(d=>setData(d))
      .catch(e=>{
        console.error("genTopicLesson error:",e);
        setErr(`فشل تحميل الشرح: ${e.message||"خطأ غير معروف"}`);
      })
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{load();},[topic]);

  return(
    <div style={{display:"grid",gap:14}}>

      {/* Header / back button */}
      <div style={{
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"18px 22px",borderRadius:18,
        background:`linear-gradient(135deg,${secColor}10,rgba(5,9,26,.6))`,
        border:`1px solid ${secColor}22`
      }}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{
            width:46,height:46,borderRadius:13,flexShrink:0,
            background:`${secColor}18`,border:`1.5px solid ${secColor}35`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"
          }}>{CONCEPTS[topic]?.icon||"📖"}</div>
          <div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <h1 style={{fontWeight:900,color:"#fff",fontSize:"1.15rem"}}>{topic}</h1>
              <span style={{
                padding:"2px 10px",borderRadius:99,fontSize:".6rem",fontWeight:700,
                background:`${secColor}15`,border:`1px solid ${secColor}28`,color:secColor
              }}>{sec}</span>
            </div>
            <p style={{fontSize:".72rem",color:"#475569",marginTop:2}}>
              شرح AI · مثال محلول · أخطاء شائعة · نصيحة السرعة
            </p>
          </div>
        </div>
        <button className="btn btn-g" style={{fontSize:".82rem"}} onClick={onClose}>
          ← خريطة المسار
        </button>
      </div>

      {/* Loading */}
      {loading&&(
        <div className="gl" style={{padding:"60px",textAlign:"center"}}>
          <div className="spin spin-lg" style={{margin:"0 auto 16px"}}/>
          <p style={{color:"#64748b"}}>يولّد الشرح من <strong style={{color:secColor}}>{topic}</strong>...</p>
        </div>
      )}

      {/* Error */}
      {err&&!loading&&(
        <div className="gl" style={{
          padding:"26px",textAlign:"center",
          borderColor:"rgba(248,113,113,.2)",background:"rgba(248,113,113,.06)"
        }}>
          <p style={{color:"#fca5a5",marginBottom:14}}>{err}</p>
          <button className="btn btn-p" onClick={load}>أعد المحاولة</button>
        </div>
      )}

      {/* Content */}
      {data&&!loading&&(
        <div className="rg-lesson lesson-cols" style={{gap:13}}>

          {/* Right column */}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>

            {/* Summary */}
            <div className="gl" style={{
              padding:"18px 20px",
              borderColor:`${secColor}20`,background:`${secColor}07`
            }}>
              <p style={{fontSize:".68rem",color:secColor,fontWeight:700,letterSpacing:".08em",marginBottom:9}}>
                نظرة عامة
              </p>
              <p style={{fontSize:".86rem",lineHeight:1.9,color:"#94a3b8"}}>{data.summary}</p>
            </div>

            {/* Key Rules */}
            <div className="gl" style={{padding:"18px 20px"}}>
              <p style={{fontSize:".68rem",color:secColor,fontWeight:700,letterSpacing:".08em",marginBottom:12}}>
                ▸ القواعد الأساسية
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {data.key_rules?.map((rule,i)=>(
                  <div key={i} style={{
                    display:"flex",gap:11,padding:"11px 14px",borderRadius:12,
                    background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"
                  }}>
                    <div style={{
                      width:24,height:24,borderRadius:7,flexShrink:0,
                      background:`${secColor}18`,border:`1px solid ${secColor}28`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:".72rem",fontWeight:900,color:secColor,marginTop:1
                    }}>{i+1}</div>
                    <p style={{fontSize:".84rem",lineHeight:1.75,color:"#e2e8f0"}}>{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Speed tip */}
            {data.speed_tip&&(
              <div className="gl" style={{
                padding:"16px 18px",
                borderColor:"rgba(34,211,238,.18)",background:"rgba(34,211,238,.05)"
              }}>
                <p style={{fontSize:".67rem",color:"#22d3ee",fontWeight:700,marginBottom:7}}>
                  🚀 نصيحة السرعة في الاختبار
                </p>
                <p style={{fontSize:".85rem",color:"#a5f3fc",lineHeight:1.8}}>{data.speed_tip}</p>
              </div>
            )}

            {/* Common Mistakes */}
            {data.common_mistakes?.length>0&&(
              <div className="gl" style={{padding:"18px 20px"}}>
                <p style={{fontSize:".68rem",color:"#f87171",fontWeight:700,letterSpacing:".08em",marginBottom:11}}>
                  ⚠ أخطاء شائعة
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {data.common_mistakes.map((m,i)=>(
                    <div key={i} style={{
                      display:"flex",gap:9,padding:"10px 13px",borderRadius:10,
                      background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.14)"
                    }}>
                      <span style={{color:"#f87171",flexShrink:0,marginTop:2}}>✗</span>
                      <p style={{fontSize:".82rem",color:"#fca5a5",lineHeight:1.65}}>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Left column */}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>

            {/* Solved Example */}
            {data.solved_example&&(
              <div className="gl" style={{
                padding:0,overflow:"hidden",
                borderColor:"rgba(167,139,250,.22)"
              }}>
                <div style={{
                  padding:"13px 18px",
                  background:"linear-gradient(135deg,rgba(167,139,250,.14),rgba(5,9,26,.9))",
                  borderBottom:"1px solid rgba(167,139,250,.15)"
                }}>
                  <p style={{fontSize:".68rem",color:"#c4b5fd",fontWeight:700,letterSpacing:".07em"}}>
                    💡 مثال محلول — نوع قياس
                  </p>
                </div>
                <div style={{padding:"18px 20px"}}>
                  <p style={{
                    fontSize:".9rem",fontWeight:700,color:"#f1f5f9",
                    lineHeight:1.85,marginBottom:16,
                    paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,.06)"
                  }}>
                    {data.solved_example.question}
                  </p>
                  <p style={{fontSize:".67rem",color:"#f97316",fontWeight:700,marginBottom:10}}>
                    خطوات الحل:
                  </p>
                  <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
                    {data.solved_example.steps?.map((s,i)=>(
                      <div key={i} className="step">
                        <div className="snum">{i+1}</div>
                        <p style={{fontSize:".83rem",lineHeight:1.8,color:"#cbd5e1"}}>{s}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    padding:"11px 15px",borderRadius:11,marginBottom:10,
                    background:"rgba(74,222,128,.07)",border:"1px solid rgba(74,222,128,.22)"
                  }}>
                    <p style={{fontSize:".68rem",color:"#6ee7b7",fontWeight:700,marginBottom:3}}>✓ الإجابة</p>
                    <p style={{color:"#bbf7d0",fontWeight:800,fontSize:".88rem"}}>
                      {data.solved_example.answer}
                    </p>
                  </div>
                  {data.solved_example.trick&&(
                    <div style={{
                      padding:"10px 14px",borderRadius:10,
                      background:"rgba(249,115,22,.07)",border:"1px solid rgba(249,115,22,.2)"
                    }}>
                      <p style={{fontSize:".78rem",color:"#fdba74",lineHeight:1.7}}>
                        ⚡ {data.solved_example.trick}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick ref from CONCEPTS */}
            {CONCEPTS[topic]&&(
              <div className="gl" style={{padding:"18px 20px"}}>
                <p style={{fontSize:".67rem",color:"#22d3ee",fontWeight:700,letterSpacing:".08em",marginBottom:10}}>
                  📌 مرجع سريع
                </p>
                {CONCEPTS[topic].formula!=="—"&&(
                  <div style={{
                    padding:"10px",borderRadius:10,marginBottom:10,
                    background:"rgba(249,115,22,.07)",border:"1px solid rgba(249,115,22,.18)",
                    textAlign:"center"
                  }}>
                    <p style={{fontSize:".65rem",color:"#f97316",marginBottom:4}}>الصيغة</p>
                    <p style={{fontSize:".82rem",fontWeight:800,color:"#fdba74",direction:"rtl"}}>
                      {CONCEPTS[topic].formula}
                    </p>
                  </div>
                )}
                <p style={{fontSize:".78rem",color:"#f87171",lineHeight:1.75}}>
                  {CONCEPTS[topic].trap}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{
        display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",
        padding:"16px 20px",borderRadius:16,flexWrap:"wrap",
        background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)"
      }}>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{
          display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:11,
          background:"rgba(220,38,38,.09)",border:"1px solid rgba(220,38,38,.24)",
          color:"#f87171",fontWeight:700,fontSize:".82rem",
          textDecoration:"none",fontFamily:"Cairo,sans-serif"
        }}>
          <span style={{fontSize:"1.1rem"}}>▶</span> فيديو شرح على يوتيوب
        </a>
        <div style={{display:"flex",gap:9}}>
          <button className="btn btn-g" onClick={onClose}>
            ← رجوع للخريطة
          </button>
          <button className="btn btn-p" style={{padding:"11px 26px"}}
            onClick={onStartPractice}>
            ابدأ التدريب ←
          </button>
        </div>
      </div>
    </div>
  );
}

function Roadmap({go,setSettings,openLesson,trial={}}){
  const[active,setActive]=useState("باب 0");

  const launch=t=>{
    setSettings(p=>({...p,topic:t,section:deriveSec(t),difficulty:"متوسط"}));
    go("diagnostic");
  };

  const SEC_META={
    "باب 0":{
      color:"#a78bfa", bg:"rgba(167,139,250,.07)", border:"rgba(167,139,250,.22)",
      label:"باب 0 — التأسيس", sub:"ابدأ من هنا إذا تحتاج تأسيس",
      note:"مرحلة التأسيس قبل الكمي\nتشمل: العمليات الأساسية · الكسور · النسب · تحويل الوحدات · الهندسة البسيطة",
      icon:"🏁",
    },
    كمي:{
      color:"#f97316", bg:"rgba(249,115,22,.07)", border:"rgba(249,115,22,.22)",
      label:"القسم الكمي", sub:"رياضيات واستنتاج عددي",
      note:"العلمي: ~52 سؤال (40% حساب · 24% هندسة · 23% جبر · 13% تحليل)\nالأدبي: ~30 سؤال (حساب + هندسة + تحليل — بدون جبر)",
      icon:"🔢",
    },
    لفظي:{
      color:"#22d3ee", bg:"rgba(34,211,238,.06)", border:"rgba(34,211,238,.2)",
      label:"القسم اللفظي", sub:"لغة عربية وفهم نصوص",
      note:"العلمي: ~68 سؤال | الأدبي: ~90 سؤال\nالأقسام: إكمال الجمل · تناظر لفظي · استيعاب المقروء · خطأ سياقي",
      icon:"📝",
    }
  };

  const meta = SEC_META[active];
  const groups = TOPIC_GROUPS[active];

  return(
    <div style={{display:"grid",gap:16}}>

      {/* Header */}
      <div className="gl" style={{padding:"28px 30px"}}>
        <span className="badge b-v" style={{marginBottom:12}}>🗺️ خريطة المسار</span>
        <h1 style={{fontSize:"1.75rem",fontWeight:900,color:"#fff",marginBottom:7}}>
          جميع أبواب اختبار القدرات
        </h1>
        <p style={{color:"#64748b",lineHeight:1.8,marginBottom:18}}>
          الأقسام الرسمية من المركز الوطني للقياس. اضغط على أي باب لتبدأ بسؤال تشخيصي.
        </p>
        {/* Section Tabs */}
        <div style={{display:"flex",gap:10}}>
          {["باب 0","كمي","لفظي"].map(sec=>{
            const m=SEC_META[sec];
            const on=active===sec;
            return(
              <button key={sec} onClick={()=>setActive(sec)} style={{
                flex:1, padding:"14px 18px", borderRadius:16, cursor:"pointer",
                border:`2px solid ${on?m.color+"60":"rgba(255,255,255,.08)"}`,
                background:on?m.bg:"rgba(255,255,255,.03)",
                transition:"all .25s", textAlign:"right",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:"1.5rem"}}>{m.icon}</span>
                  <div>
                    <p style={{fontWeight:900,color:on?m.color:"#fff",fontSize:".95rem"}}>{m.label}</p>
                    <p style={{fontSize:".72rem",color:"#64748b",marginTop:2}}>{m.sub}</p>
                  </div>
                  <span style={{
                    marginRight:"auto", padding:"3px 10px", borderRadius:99,
                    background:on?m.color+"18":"rgba(255,255,255,.05)",
                    border:`1px solid ${on?m.color+"35":"rgba(255,255,255,.08)"}`,
                    fontSize:".65rem", fontWeight:700,
                    color:on?m.color:"#475569"
                  }}>{TOPICS[sec].length} باب</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section info bar */}
      <div style={{
        padding:"13px 18px", borderRadius:14,
        background:meta.bg, border:`1px solid ${meta.border}`,
        display:"flex", alignItems:"flex-start", gap:10
      }}>
        <span style={{fontSize:"1.1rem",marginTop:1}}>ℹ️</span>
        <div>
          {meta.note.split("\n").map((line,i)=>(
            <p key={i} style={{fontSize:".78rem",color:"#94a3b8",lineHeight:1.7}}>{line}</p>
          ))}
        </div>
      </div>

      {/* باب 0 — مرحلة التأسيس banner */}
      {active==="باب 0"&&(
        <div style={{
          padding:"14px 18px",borderRadius:14,
          background:"linear-gradient(135deg,rgba(167,139,250,.1),rgba(99,102,241,.07))",
          border:"1.5px solid rgba(167,139,250,.3)",
          display:"flex",alignItems:"center",gap:12
        }}>
          <span style={{fontSize:"1.8rem"}}>🏁</span>
          <div>
            <p style={{fontWeight:800,color:"#c4b5fd",fontSize:".9rem",marginBottom:4}}>مرحلة التأسيس — ابدأ من هنا</p>
            <p style={{fontSize:".78rem",color:"#64748b",lineHeight:1.7}}>
              إذا كانت أساسيات الرياضيات غير واضحة لك، هذه المرحلة تبني قاعدتك قبل أبواب القدرات الرئيسية.
            </p>
          </div>
        </div>
      )}

      {/* Topic Groups */}
      {groups.map((grp,gi)=>(
        <div key={gi} className="gl" style={{padding:"20px",borderColor:`${grp.color}18`}}>

          {/* Group header */}
          <div style={{
            display:"flex", alignItems:"center", gap:11,
            marginBottom:14, paddingBottom:12,
            borderBottom:`1px solid ${grp.color}18`
          }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:`${grp.color}15`, border:`1.5px solid ${grp.color}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.15rem", flexShrink:0, lineHeight:1, overflow:"hidden"
            }}>
              <span style={{fontSize:"19px",lineHeight:"1"}}>{grp.icon}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <h2 style={{fontWeight:900,color:"#fff",fontSize:".93rem"}}>{grp.sub}</h2>
                <span style={{
                  padding:"2px 9px", borderRadius:99, fontSize:".61rem", fontWeight:700,
                  background:`${grp.color}14`, border:`1px solid ${grp.color}28`, color:grp.color
                }}>{grp.pct} من الأسئلة</span>
              </div>
            </div>
            <span style={{fontSize:".7rem",color:"#475569"}}>{grp.topics.length} {grp.topics.length===1?"باب":"أبواب"}</span>
          </div>

          {/* Topics grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
            {grp.topics.map(t=>(
              <div key={t} style={{
                padding:"14px 15px", borderRadius:14,
                border:`1.5px solid rgba(255,255,255,.07)`,
                background:"rgba(5,9,26,.5)",
                display:"flex",flexDirection:"column",gap:10
              }}>
                {/* Top row */}
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{
                    width:36,height:36,borderRadius:10,flexShrink:0,
                    background:`${grp.color}18`,border:`1.5px solid ${grp.color}35`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    overflow:"hidden",flexDirection:"column"
                  }}>
                    <span style={{
                      fontSize:"10px",fontWeight:900,color:grp.color,
                      fontFamily:"Cairo,sans-serif",lineHeight:1,
                      textAlign:"center",padding:"2px",
                      whiteSpace:"nowrap",overflow:"hidden",
                      maxWidth:34,display:"block"
                    }}>{ICON_LABELS[t]||t.slice(0,3)}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:".84rem",fontWeight:700,color:"#f1f5f9",lineHeight:1.4}}>{t}</p>
                    <p style={{fontSize:".63rem",color:"#475569",marginTop:2}}>
                      {CONCEPTS[t]?.trap?.replace("⚠ الفخ: ","").slice(0,35)+"…"}
                    </p>
                  </div>
                </div>
                {/* Two buttons */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  <button onClick={()=>trial.isSubscribed?openLesson(t):go("paywall")} style={{
                    padding:"8px 6px",borderRadius:9,cursor:"pointer",
                    border:`1px solid ${grp.color}30`,
                    background:`${grp.color}0a`,color:grp.color,
                    fontSize:".73rem",fontWeight:700,fontFamily:"Cairo,sans-serif",
                    transition:"all .18s"
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${grp.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`${grp.color}0a`;}}>
                    {trial.isSubscribed?"📖 اعرف الباب":"🔒 اعرف الباب"}
                  </button>
                  <button onClick={()=>trial.isSubscribed?launch(t):go("paywall")} style={{
                    padding:"8px 6px",borderRadius:9,cursor:"pointer",
                    border:"1px solid rgba(249,115,22,.3)",
                    background:"rgba(249,115,22,.08)",color:"#f97316",
                    fontSize:".73rem",fontWeight:700,fontFamily:"Cairo,sans-serif",
                    transition:"all .18s"
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(249,115,22,.18)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(249,115,22,.08)";}}>
                    {trial.isSubscribed?"🎯 تدرّب":"🔒 تدرّب"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer CTA */}
      <div style={{
        padding:"18px 22px", borderRadius:16,
        background:"linear-gradient(135deg,rgba(167,139,250,.08),rgba(249,115,22,.05))",
        border:"1px solid rgba(167,139,250,.18)",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12
      }}>
        <div>
          <p style={{fontWeight:800,color:"#c4b5fd",fontSize:".9rem"}}>جاهز تبدأ؟</p>
          <p style={{fontSize:".76rem",color:"#64748b",marginTop:3}}>
            {TOPICS.كمي.length + TOPICS.لفظي.length + 7} باب · كل باب فيه شرح + تشخيص + تدريب AI
          </p>
        </div>
        <div style={{display:"flex",gap:9}}>
          <button className="btn btn-g" style={{fontSize:".82rem"}} onClick={()=>go("bank")}>
            📚 بنك الأسئلة
          </button>
          <button className="btn btn-p" style={{padding:"11px 22px"}} onClick={()=>go("session")}>
            ابدأ التدريب ←
          </button>
        </div>
      </div>

    </div>
  );
}

function Paywall({trial,subscribe,back,go}){
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]); 
  const solved = trial?.used||0;
  const acc = trial?.correct ? Math.round((trial.correct/solved)*100) : 0;
  return(
    <div style={{display:"grid",gap:14,maxWidth:620,margin:"0 auto",width:"100%"}}>

      {/* ما أنجزته */}
      <div style={{padding:"clamp(20px,4vw,32px)",borderRadius:22,
        background:"linear-gradient(135deg,rgba(249,115,22,.1),rgba(34,211,238,.05))",
        border:"1.5px solid rgba(249,115,22,.25)",textAlign:"center"}}>
        <div style={{fontSize:"2.5rem",marginBottom:10}}>🎯</div>
        <h1 style={{fontSize:"1.6rem",fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:8}}>
          أتممت تجربتك المجانية!
        </h1>
        <p style={{fontSize:".88rem",color:"#94a3b8",lineHeight:1.8,marginBottom:16}}>
          حللت <strong style={{color:"#f97316"}}>{solved} سؤالاً</strong> وأثبتّ إنك جاد في التحضير.<br/>
          اشترك الآن وواصل من حيث توقفت.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          {[["✅","وصلت للمستوى التشخيصي"],["📈","عرفت نقاط قوتك"],["🧠","جربت أسئلة AI حقيقية"]].map(([ic,t],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,
              padding:"7px 13px",borderRadius:99,
              background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)"}}>
              <span style={{fontSize:".85rem"}}>{ic}</span>
              <span style={{fontSize:".73rem",color:"#cbd5e1"}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* مقارنة الباقتين */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

        {/* 49 ريال */}
        <div className="gl" style={{padding:"22px 18px",border:"1.5px solid rgba(249,115,22,.35)",
          display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <span style={{fontSize:".62rem",fontWeight:700,color:"#f97316",
              background:"rgba(249,115,22,.12)",padding:"3px 10px",borderRadius:99,
              border:"1px solid rgba(249,115,22,.25)"}}>الأساسي</span>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:5}}>
            <span style={{fontSize:"2rem",fontWeight:900,color:"#f97316",lineHeight:1}}>49</span>
            <span style={{fontSize:".72rem",color:"#64748b"}}>ريال / شهر</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7,flex:1}}>
            {["أسئلة AI غير محدودة","شرح كل سؤال","وضع المحاكاة","تتبع التقدم","بنك الأسئلة"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{color:"#f97316",fontSize:".75rem",flexShrink:0}}>✓</span>
                <span style={{fontSize:".76rem",color:"#cbd5e1"}}>{f}</span>
              </div>
            ))}
          </div>
          <button style={{
            width:"100%",padding:"11px",borderRadius:11,cursor:"not-allowed",opacity:.5,
            background:"rgba(249,115,22,.1)",border:"1.5px solid rgba(249,115,22,.4)",
            color:"#f97316",fontSize:".8rem",fontWeight:800,fontFamily:"Cairo,sans-serif"
          }}>🔒 قريباً</button>
        </div>

        {/* 99 ريال — مميز */}
        <div className="gl" style={{padding:"22px 18px",
          border:"1.5px solid rgba(167,139,250,.5)",position:"relative",
          background:"linear-gradient(160deg,rgba(167,139,250,.08),rgba(5,9,26,.95))",
          display:"flex",flexDirection:"column",gap:12,
          boxShadow:"0 8px 32px rgba(167,139,250,.15)"}}>
          <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",
            whiteSpace:"nowrap",padding:"4px 14px",borderRadius:99,
            background:"linear-gradient(135deg,#a78bfa,#8b5cf6)",
            fontSize:".62rem",fontWeight:900,color:"#fff"}}>
            ⭐ الأكثر اختياراً
          </div>
          <div>
            <span style={{fontSize:".62rem",fontWeight:700,color:"#a78bfa",
              background:"rgba(167,139,250,.12)",padding:"3px 10px",borderRadius:99,
              border:"1px solid rgba(167,139,250,.25)"}}>المميز</span>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:5}}>
            <span style={{fontSize:"2rem",fontWeight:900,color:"#a78bfa",lineHeight:1}}>99</span>
            <span style={{fontSize:".72rem",color:"#64748b"}}>ريال / شهر</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7,flex:1}}>
            {["كل مميزات الأساسي","AI مساعد شخصي","تحليل نقاط الضعف","خطة مذاكرة ذكية","الأفضل قيمةً 💜"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{color:"#a78bfa",fontSize:".75rem",flexShrink:0}}>✓</span>
                <span style={{fontSize:".76rem",color:"#cbd5e1"}}>{f}</span>
              </div>
            ))}
          </div>
          <button style={{
            width:"100%",padding:"11px",borderRadius:11,cursor:"not-allowed",opacity:.5,
            background:"linear-gradient(135deg,rgba(167,139,250,.2),rgba(167,139,250,.1))",
            border:"1.5px solid rgba(167,139,250,.5)",
            color:"#c4b5fd",fontSize:".8rem",fontWeight:800,fontFamily:"Cairo,sans-serif"
          }}>🔒 قريباً</button>
        </div>
      </div>

      {/* الدفع */}
      <div className="gl-c" style={{padding:"13px 18px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:"1rem"}}>🔒</span>
        <p style={{fontSize:".75rem",color:"#64748b",flex:1}}>
          الدفع الآمن عبر <strong style={{color:"#67e8f9"}}>Moyasar</strong> — مدى · Visa · Apple Pay
        </p>
      </div>

      {/* أزرار */}
      <div style={{display:"grid",gap:9}}>
        <button className="btn btn-g" style={{justifyContent:"center"}} onClick={back}>
          ← واصل التجربة
        </button>
        <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>go("pricing")}>
          عرض تفاصيل الباقات
        </button>
      </div>

    </div>
  );
}


/* ═══════════════════ LEGAL PAGE TEMPLATE ═══════════════════ */
function LegalPage({title,badge,badgeClass,sections,go}){
  return(
    <div style={{display:"grid",gap:14,maxWidth:720,margin:"0 auto",width:"100%"}}>
      <div className="gl au gl-pad-lg" style={{padding:"36px 32px"}}>
        <span className={`badge ${badgeClass}`} style={{marginBottom:12}}>{badge}</span>
        <h1 style={{fontSize:"1.8rem",fontWeight:900,color:"#fff",marginBottom:8}}>{title}</h1>
        <p style={{fontSize:".78rem",color:"#475569"}}>آخر تحديث: {new Date().toLocaleDateString("ar-SA")}</p>
      </div>
      {sections.map((s,i)=>(
        <div key={i} className="gl" style={{padding:"22px 26px"}}>
          <h2 style={{fontSize:".95rem",fontWeight:800,color:"#f97316",marginBottom:12}}>{s.title}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {s.items.map((item,j)=>(
              <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{color:"#f97316",fontWeight:900,flexShrink:0,marginTop:2}}>•</span>
                <p style={{fontSize:".83rem",lineHeight:1.85,color:"#94a3b8"}}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>go(isLoggedIn?"dashboard":"landing")}>← العودة للرئيسية</button>
    </div>
  );
}

function Privacy({go}){
  return <LegalPage go={go} title="سياسة الخصوصية" badge="🔒 الخصوصية" badgeClass="b-c" sections={[
    {title:"ما المعلومات التي نجمعها؟",items:[
      "الاسم والبريد الإلكتروني عند إنشاء الحساب.",
      "بيانات الأداء: عدد الأسئلة المحلولة، الإجابات الصحيحة والخاطئة، الأبواب المدروسة.",
      "معلومات الاشتراك وبيانات الدفع (تُعالَج عبر Moyasar ولا نحتفظ بأرقام البطاقات).",
      "بيانات الاستخدام العامة مثل وقت الجلسة والصفحات المزارة."
    ]},
    {title:"كيف نستخدم معلوماتك؟",items:[
      "تخصيص مسار التعلم وتوليد أسئلة مناسبة لمستواك.",
      "تحسين أداء المنصة وتطوير ميزات جديدة.",
      "إرسال إشعارات تتعلق بحسابك أو اشتراكك (لا نرسل إعلانات بريدية غير مطلوبة).",
      "الامتثال للمتطلبات القانونية والتنظيمية في المملكة العربية السعودية."
    ]},
    {title:"مشاركة البيانات",items:[
      "لا نبيع بياناتك لأي طرف ثالث تحت أي ظرف.",
      "نستخدم Supabase لتخزين البيانات وAnthropic لتوليد الأسئلة — وكلاهما يلتزمان بمعايير خصوصية عالية.",
      "قد نشارك بيانات مجهولة الهوية وإحصائية لأغراض بحثية فقط.",
    ]},
    {title:"حقوقك",items:[
      "يحق لك طلب نسخة من بياناتك المحفوظة في أي وقت.",
      "يمكنك حذف حسابك وجميع بياناتك نهائياً من إعدادات الحساب.",
      "للاستفسار أو طلب الحذف: support@fahmni.sa"
    ]}
  ]}/>;
}

function Terms({go}){
  return <LegalPage go={go} title="الشروط والأحكام" badge="📋 الشروط" badgeClass="b-o" sections={[
    {title:"قبول الشروط",items:[
      "باستخدام فهمني فأنت توافق على هذه الشروط. إذا كنت دون سن 18 فيجب الحصول على موافقة ولي الأمر.",
      "نحتفظ بحق تعديل هذه الشروط مع إشعار مسبق عبر البريد الإلكتروني.",
    ]},
    {title:"الاشتراكات والمدفوعات",items:[
      "الاشتراك الشهري: 49 ريال سعودي شاملاً ضريبة القيمة المضافة.",
      "باقة الاختبار: 99 ريال سعودي شهرياً شاملاً ضريبة القيمة المضافة.",
      "يتجدد الاشتراك تلقائياً ما لم تلغِه قبل 24 ساعة من موعد التجديد.",
      "تُعالَج جميع المدفوعات بشكل آمن عبر بوابة Moyasar المرخصة من البنك المركزي السعودي (ساما).",
    ]},
    {title:"الاستخدام المقبول",items:[
      "المنصة مخصصة للاستخدام الشخصي التعليمي فقط.",
      "يُحظر مشاركة الحساب مع أشخاص آخرين أو بيع بيانات الاشتراك.",
      "يُحظر نسخ الأسئلة أو المحتوى المولّد لأغراض تجارية.",
      "نحتفظ بحق إيقاف الحسابات التي تنتهك هذه الشروط دون استرداد."
    ]},
    {title:"إخلاء المسؤولية",items:[
      "فهمني منصة تعليمية مساعدة وليست بديلاً عن الدراسة الرسمية.",
      "لا نضمن نتائج معينة في الاختبارات، لكننا نبذل قصارى جهدنا لتقديم محتوى دقيق.",
      "المحتوى مولّد بالذكاء الاصطناعي وقد يحتوي على أخطاء — نرحب بالإبلاغ عنها."
    ]}
  ]}/>;
}

function Refund({go}){
  return <LegalPage go={go} title="سياسة الاسترداد" badge="💳 الاسترداد" badgeClass="b-g" sections={[
    {title:"حق الاسترداد",items:[
      "يحق لك الاسترداد الكامل خلال 7 أيام من أول اشتراك إذا لم تستخدم المنصة (أقل من 10 أسئلة).",
      "بعد 7 أيام أو عند الاستخدام الفعلي لا يحق الاسترداد إلا في حالات استثنائية.",
      "في حالة وجود خلل تقني من جانبنا يمنعك من الوصول للمنصة لأكثر من 48 ساعة، يحق لك استرداد نسبي.",
    ]},
    {title:"كيف تطلب الاسترداد؟",items:[
      "أرسل طلبك على support@fahmni.sa مع ذكر سبب الطلب ورقم الطلب.",
      "سنرد خلال 3 أيام عمل ونُعالج المبلغ خلال 5-7 أيام عمل.",
      "يُعاد المبلغ لنفس وسيلة الدفع المستخدمة."
    ]},
    {title:"حالات لا يُقبل فيها الاسترداد",items:[
      "بعد مرور 7 أيام من تاريخ الاشتراك.",
      "عند استخدام المنصة بشكل فعلي (أكثر من 10 أسئلة أو جلسات متعددة).",
      "في حالة انتهاك شروط الاستخدام."
    ]}
  ]}/>;
}

function Contact({go}){
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[msg,setMsg]=useState("");
  const[sent,setSent]=useState(false);
  const[loading,setLoading]=useState(false);

  const send=async()=>{
    if(!name||!email||!msg) return;
    setLoading(true);
    try{
      await fetch(`${SUPABASE_URL}/rest/v1/contact_leads`,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}`},
        body:JSON.stringify({name,email,message:msg,source:"contact_page"})
      });
      setSent(true);
    }catch(e){setSent(true);}
    finally{setLoading(false);}
  };

  return(
    <div style={{display:"grid",gap:14,maxWidth:720,margin:"0 auto",width:"100%"}}>
      <div className="gl au gl-pad-lg" style={{padding:"36px 32px"}}>
        <span className="badge b-v" style={{marginBottom:12}}>💬 تواصل معنا</span>
        <h1 style={{fontSize:"1.8rem",fontWeight:900,color:"#fff",marginBottom:8}}>نحب نسمع منك</h1>
        <p style={{fontSize:".85rem",color:"#64748b",lineHeight:1.8}}>سواء عندك سؤال، اقتراح، أو مشكلة — فريقنا يرد خلال 24 ساعة.</p>
      </div>

      {sent?(
        <div className="gl" style={{padding:"36px",textAlign:"center"}}>
          <div style={{fontSize:"2.5rem",marginBottom:14}}>✅</div>
          <h2 style={{fontWeight:900,color:"#fff",marginBottom:8}}>وصلت رسالتك!</h2>
          <p style={{color:"#64748b",marginBottom:20}}>نرد عليك خلال 24 ساعة على بريدك.</p>
          <button className="btn btn-p" style={{justifyContent:"center"}} onClick={()=>go(isLoggedIn?"dashboard":"landing")}>العودة للرئيسية ←</button>
        </div>
      ):(
        <div className="gl" style={{padding:"28px",display:"flex",flexDirection:"column",gap:13}}>
          <div className="rg-2" style={{display:"grid",gap:12}}>
            <div>
              <p style={{fontSize:".72rem",color:"#f97316",fontWeight:700,marginBottom:7}}>الاسم</p>
              <input className="inp" placeholder="اسمك الكامل" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div>
              <p style={{fontSize:".72rem",color:"#f97316",fontWeight:700,marginBottom:7}}>البريد الإلكتروني</p>
              <input className="inp" placeholder="email@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
          </div>
          <div>
            <p style={{fontSize:".72rem",color:"#f97316",fontWeight:700,marginBottom:7}}>رسالتك</p>
            <textarea className="inp" placeholder="اكتب رسالتك هنا..." value={msg} onChange={e=>setMsg(e.target.value)}
              style={{minHeight:130,resize:"vertical",lineHeight:1.8}}/>
          </div>

          <button className="btn btn-p" style={{justifyContent:"center",padding:"13px"}} disabled={loading||!name||!email||!msg} onClick={send}>
            {loading?<><div className="spin"/> يرسل...</>:"إرسال الرسالة ←"}
          </button>
        </div>
      )}
      <button className="btn btn-g" style={{justifyContent:"center"}} onClick={()=>go(isLoggedIn?"dashboard":"landing")}>← العودة للرئيسية</button>
    </div>
  );
}

/* ═══════════════════ ROOT APP ═══════════════════ */
class ErrorBoundary extends React.Component{
  constructor(p){super(p);this.state={err:null};}
  static getDerivedStateFromError(e){return{err:e};}
  componentDidCatch(e,info){console.error("❌ Crash:",e?.message,info?.componentStack?.slice(0,200));}
  render(){
    if(this.state.err)return(
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,background:"#05091a",color:"#fff",fontFamily:"Cairo,sans-serif",padding:24,textAlign:"center"}}>
        <span style={{fontSize:"3rem"}}>⚠️</span>
        <p style={{fontWeight:800,fontSize:"1.1rem"}}>حدث خطأ غير متوقع</p>
        <p style={{color:"#64748b",fontSize:".82rem",maxWidth:320}}>{this.state.err?.message||"خطأ غير معروف"}</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <button style={{padding:"10px 20px",borderRadius:12,background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.3)",color:"#f97316",fontFamily:"Cairo,sans-serif",cursor:"pointer",fontWeight:700,fontSize:".9rem"}} onClick={()=>this.setState({err:null})}>حاول مرة أخرى</button>
          <button style={{padding:"10px 28px",borderRadius:12,background:"#f97316",color:"#0a0f1e",border:"none",fontFamily:"Cairo,sans-serif",cursor:"pointer",fontWeight:700,fontSize:".9rem"}} onClick={()=>{this.setState({err:null});window.location.reload();}}>إعادة التحميل</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
export default function Fahmni(){
  const[page,setPage]=useState("landing");
  const[profile,setProfile]=useState({goal:"أرفع درجتي",confidence:"متوسط",section:"كمي",minutes:"40"});
  const[pAnswers,setPAnswers]=useState([]);
  const[rec,setRec]=useState(null);
  const[session,setSession]=useState(null); // {token, userId, name, email}
  const[user,setUser]=useState({name:"",streak:0,totalSolved:0,correct:0});
  const[settings,setSettings]=useState({section:"كمي",difficulty:"متوسط",topic:"النسبة والتناسب"});
  const[trial,setTrial]=useState({isSubscribed:false,used:0,limit:10,plan:'free'});
  const[mistakes,setMistakes]=useState([]);
  const[placementDone,setPlacementDone]=useState(false);
  const placementDoneRef=useRef(false);
  const[confetti,setConfetti]=useState(false);
  const{show:showToast,ToastContainer}=useToast();
  // Offline detection
  const _toastRef=React.useRef(null);
  React.useEffect(()=>{_toastRef.current=showToast;},[showToast]);
  React.useEffect(()=>{
    const off=()=>_toastRef.current?.("لا يوجد اتصال بالإنترنت ⚠️","error",5000);
    const on=()=>_toastRef.current?.("عاد الاتصال بالإنترنت ✅","success",2500);
    window.addEventListener("offline",off);window.addEventListener("online",on);
    return()=>{window.removeEventListener("offline",off);window.removeEventListener("online",on);};
  },[]);
  const[milestone,setMilestone]=useState(null);
  const[lessonTopic,setLessonTopic]=useState(null);

  // ── قراءة token من URL بعد تأكيد البريد ──
  // ─── Browser back/forward navigation ───
  useEffect(()=>{
    // Set initial state
    const initialPage=window.location.hash.replace("#","");
    if(initialPage&&initialPage.length>1&&!initialPage.includes("access_token")){
      setPage(initialPage);
    } else {
      window.history.replaceState({page:"landing"},"","#landing");
    }
    const onPop=e=>{
      const p=(e.state?.page)||window.location.hash.replace("#","")||"landing";
      setPage(p);
      window.scrollTo({top:0,behavior:"smooth"});
    };
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

    useEffect(()=>{
    const hash=window.location.hash;
    if(!hash) return;
    const params=new URLSearchParams(hash.replace("#",""));
    const access_token=params.get("access_token");
    const type=params.get("type"); // signup | recovery
    if(!access_token) return;
    // امسح الـ hash من URL ولكن حافظ على الصفحة
    window.history.replaceState({page:"dashboard"},"","#dashboard");
    if(type==="recovery"){
      // نسيت كلمة المرور — اعرض صفحة تغيير الباسورد (مستقبلاً)
      // حالياً رسالة
      go("login");
      return;
    }
    // تسجيل بعد تأكيد البريد
    fetch(`${SUPABASE_URL}/auth/v1/user`,{
      headers:{"apikey":SUPABASE_ANON,"Authorization":`Bearer ${access_token}`}
    }).then(r=>r.json()).then(u=>{
      if(!u.id) return;
      const name=u.user_metadata?.full_name||u.email?.split("@")[0]||"طالب";
      handleLogin({token:access_token,userId:u.id,name,email:u.email});
    }).catch(()=>go("login"));
  },[]);

  const handleLogin=async(sess)=>{
    setSession(sess);
    setUser(u=>({...u,name:sess.name}));
    if(!sess.isGuest) await sbCreateProfile(sess.userId,sess.token,sess.name);
    const prog=await sbLoadProgress(sess.userId,sess.token);
    const isReturning=prog&&prog.totalSolved>0;
    if(prog){
      const ds=getDailyStats();
    setUser({name:sess.name,totalSolved:prog.totalSolved,correct:prog.correct,streak:prog.streak,dailyGoal:ds.goal||5,dailyDone:ds.done||0,lastActiveDate:new Date().toISOString().split("T")[0]});
      setMistakes(prog.mistakes||[]);
      const ownerAccess=isOwner(sess.email);
      if(!sess.isGuest) setTrial(t=>({...t,
        used: ownerAccess?0:(prog.trialUsed||0),
        limit: ownerAccess?9999:(prog.trialLimit||10),
        plan: ownerAccess?'exam':(prog.plan||'free'),
        isSubscribed: ownerAccess||['month','exam'].includes(prog.plan),
        isOwner: ownerAccess
      }));
    }else{
      const ownerNew=isOwner(sess.email);
    setTrial({isSubscribed:ownerNew,used:0,limit:ownerNew?9999:5,plan:ownerNew?'exam':'free',isOwner:ownerNew});
    }
    // تحميل حالة تحديد المستوى
    if(prog?.placementDone){placementDoneRef.current=true;setPlacementDone(true);}
    // توجيه ذكي:
    // 1) مستخدم جديد (ما أكمل onboarding) → onboarding
    // 2) أكمل onboarding لكن ما أكمل placement → placement
    // 3) أكمل كل شيء → dashboard
    // توجيه ذكي:
    // لو ما في profile → onboarding (مستخدم جديد)
    // لو في profile ولكن ما أكمل placement → placement
    // لو أكمل placement → dashboard
    const ownerSkip=isOwner(sess.email);
    if(ownerSkip){
      placementDoneRef.current=true;setPlacementDone(true);
      go("dashboard");
    } else if(!prog){
      go("onboarding");
    } else if(!prog.placementDone){
      go("onboarding");
    } else {
      go("dashboard");
    }
  };

  const handleLogout=async()=>{
    if(session?.token) await sbLogout(session.token);
    setSession(null);
    setUser({name:"",streak:0,totalSolved:0,correct:0});
    placementDoneRef.current=false;setPlacementDone(false);
    setMistakes([]);
    setTrial({isSubscribed:false,used:0,limit:10});
    go("landing");showToast("تم تسجيل الخروج","info");
  };

  const PUB=["landing","login","signup","pricing","privacy","terms","contact"];
  const TITLES={onboarding:"بداية ذكية",placement:"تحديد المستوى",placementResult:"نتيجة التحديد",dashboard:"لوحة الطالب",bank:"بنك الأسئلة",session:"جلسة التدريب",roadmap:"خريطة المسار",lesson:"شرح الباب",diagnostic:"سؤال التشخيص",review:"وضع المراجعة",paywall:"الاشتراك",sim:"وضع المحاكاة",pricing:"الأسعار",privacy:"سياسة الخصوصية",terms:"الشروط والأحكام",contact:"تواصل معنا"};

  const go=p=>{
    if(p===page) return;
    window.history.pushState({page:p},"",`#${p}`);
    setPage(p);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const updateUser=ok=>{
    setUser(u=>{
      const newTotal=u.totalSolved+1;
      const newCorrect=u.correct+(ok?1:0);
      const newStreak=(newCorrect>0&&newCorrect%5===0)?u.streak+1:u.streak;
      const newDaily=u.dailyDone+1;
      setDailyDone(newDaily);
      const updated={...u,totalSolved:newTotal,correct:newCorrect,streak:newStreak,dailyDone:newDaily};
      if(session&&!session.isGuest&&newTotal%5===0){
        sbSaveProgress(session.userId,session.token,updated);
      }
      return updated;
    });
    // 🎉 Confetti + Milestones — خارج setUser
    if(ok){
      setConfetti(true);
      setUser(u=>{
        const newTotal=u.totalSolved+1;
        const newCorrect=u.correct+1;
        if(newCorrect===1) setTimeout(()=>setMilestone("first_correct"),100);
        else if(newCorrect===10&&newTotal===10) setTimeout(()=>setMilestone("perfect_session"),100);
        else if(newTotal===10) setTimeout(()=>setMilestone("solved_10"),100);
        else if(newTotal===25) setTimeout(()=>setMilestone("solved_25"),100);
        else if(newTotal===50) setTimeout(()=>setMilestone("solved_50"),100);
        else if(newCorrect>0&&newCorrect%10===0) setTimeout(()=>setMilestone("streak_10"),100);
        else if(newCorrect>0&&newCorrect%5===0) setTimeout(()=>setMilestone("streak_5"),100);
        return u;
      });
    }
  };

  const addMistake=m=>setMistakes(p=>{
    const exists=p.some(x=>x.q===m.q);
    if(exists) return p;
    // احفظ الخطأ في DB فوراً
    if(session&&!session.isGuest) sbSaveMistake(session.userId,session.token,m);
    return[...p,m];
  });

  const openLesson=t=>{setLessonTopic(t);go("lesson");};

  // حماية الصفحات — لو ما في session يرجع للصفحة الرئيسية
  const PROTECTED=["dashboard","roadmap","session","bank","sim","review","lesson","diagnostic","placement","placementResult","onboarding"];
  const PAID_ONLY=["sim","bank","review","roadmap","lesson"]; // require subscription
  const R=()=>{
    // 1) مو مسجّل → landing
    if(PROTECTED.includes(page)&&!session){go("landing");return null;}
    // 2) مسجّل لكن ما أكمل placement → أجبره على placement
    const NEEDS_PLACEMENT=["dashboard","session","bank","sim","review","roadmap","lesson","diagnostic"];
    if(session&&!session.isGuest&&NEEDS_PLACEMENT.includes(page)&&!placementDoneRef.current){
      go("placement");return null;
    }
    // 3) PAID_ONLY — يحتاج اشتراك
    if(PAID_ONLY.includes(page)){
      if(!trial.isSubscribed){
        if(page==="session"&&trial.used<trial.limit){/* مسموح */}
        else{go("paywall");return null;}
      }
    }
    const plan=trial.plan||'free';
    switch(page){
    case"login":case"signup":return <Auth mode={page} go={go} onLogin={handleLogin}/>;
    case"onboarding":return <Onboarding finish={d=>{setProfile(d);go("placement");}}/>;
    case"placement":
      if(placementDone){go("dashboard");return null;}
      return <PlacementQuiz profile={profile} onFinish={ans=>{setPAnswers(ans);const r=getRec({...profile,score:ans.filter(a=>a.ok).length,answers:ans});setRec(r);setSettings(p=>({...p,section:profile.section,topic:r.topic}));go("placementResult");}}/>;
    case"placementResult":return <PlacementResult rec={rec} score={pAnswers.filter(a=>a.ok).length} onFinish={()=>{
      placementDoneRef.current=true;setPlacementDone(true);
      if(session&&!session.isGuest) sbSavePlacement(session.userId,session.token,rec?.level||"متوسط");
      go("dashboard");
    }}/>;
    case"dashboard":return <Dashboard go={go} user={user} trial={trial} mistakes={mistakes}/>;
    case"roadmap":return <Roadmap go={go} setSettings={setSettings} openLesson={openLesson} trial={trial}/>;
    case"lesson":
      if(!trial.isSubscribed){go("paywall");return null;}
      return lessonTopic
      ? <TopicLesson
          topic={lessonTopic}
          onClose={()=>go("roadmap")}
          onStartPractice={()=>{
            setSettings(p=>({...p,topic:lessonTopic,section:deriveSec(lessonTopic),difficulty:"متوسط"}));
            go("diagnostic");
          }}/>
      : <Roadmap go={go} setSettings={setSettings} openLesson={openLesson} trial={trial}/>;
    case"diagnostic":return <DiagnosticQ topic={settings.topic} section={settings.section} onResult={level=>{setSettings(p=>({...p,difficulty:level==="متقدم"?"صعب":"سهل"}));go("session");}} onSkip={()=>go("session")}/>;
    case"bank":return <Bank settings={settings} setSettings={setSettings} go={go} trial={trial}/>;
    case"session":return <Session settings={settings} go={go} updateUser={updateUser} trial={trial} setTrial={setTrial} addMistake={addMistake} plan={trial.plan||"free"} session={session} user={user} showToast={showToast}/>;
    case"sim":return <SimMode settings={settings} go={go} updateUser={updateUser} addMistake={addMistake} trial={trial}/>;
    case"review":return <ReviewMode mistakes={mistakes} go={go} onRedo={()=>go("session")}/>;
    case"pricing":return <Pricing go={go} isLoggedIn={!!session}/>;
    case"paywall":return <Paywall trial={trial} go={go} subscribe={()=>{/* Moyasar coming soon */}} back={()=>go("pricing")}/>;
    case"privacy":return <Privacy go={go}/>;
    case"terms":return <Terms go={go}/>;
    case"contact":return <Contact go={go}/>;
    default:return <Landing go={go}/>;
  }};

  return(
    <ErrorBoundary>
      <div className="app"><ToastContainer/>
        <GS/><Bg/>
        <Confetti active={confetti} onDone={()=>setConfetti(false)}/>
        {milestone&&<MilestonePopup milestone={milestone} onClose={()=>setMilestone(null)}/>}
        <Nav isPub={PUB.includes(page)&&!session} go={go} userName={session?.name||user.name} title={TITLES[page]||""} onLogout={session?handleLogout:null}/>
        <div className="wrap" style={{paddingTop:24}}>
          <R/>
        </div>
      </div>
    </ErrorBoundary>
  );
}
