import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Target, Brain, ArrowRight,
  CheckCircle, TrendingUp, Zap, Star,
  Github, ExternalLink, ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const onScroll = () => nav?.classList.toggle('nav-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        @keyframes up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-10px) rotate(-1.5deg)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.4}100%{transform:scale(1.6);opacity:0}}

        .h1{animation:up .55s ease both}
        .h2{animation:up .55s .1s ease both}
        .h3{animation:up .55s .2s ease both}
        .h4{animation:up .55s .3s ease both}

        .reveal{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}
        .reveal.in{opacity:1;transform:none}
        .reveal:nth-child(2){transition-delay:.09s}
        .reveal:nth-child(3){transition-delay:.18s}
        .reveal:nth-child(4){transition-delay:.27s}

        .nav-scrolled{border-bottom:1px solid #e5e7eb !important;box-shadow:0 1px 12px rgba(0,0,0,.05)}

        .float-card{animation:float 6s ease-in-out infinite}

        .shimmer-btn{
          background:linear-gradient(110deg,#0d9488 45%,#2dd4bf 55%,#0d9488 65%);
          background-size:200% auto;
          transition:background-position .4s ease,transform .15s ease,box-shadow .15s ease;
        }
        .shimmer-btn:hover{background-position:right center;transform:translateY(-1px);box-shadow:0 6px 20px rgba(13,148,136,.35)}
        .shimmer-btn:active{transform:translateY(0)}

        .kw-tag{
          display:inline-flex;align-items:center;gap:4px;
          padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;
          border:1px solid;transition:transform .15s ease;cursor:default;
        }
        .kw-tag:hover{transform:scale(1.05)}

        .feature-pill{
          display:inline-flex;align-items:center;gap:6px;
          padding:4px 12px;border-radius:99px;
          font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          background:#f0fdfa;color:#0d9488;border:1px solid #99f6e4;
          margin-bottom:14px;
        }

        .stat-num{
          font-size:42px;font-weight:700;line-height:1;
          background:linear-gradient(135deg,#0d9488,#2dd4bf);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        }

        .card-hover{transition:transform .2s ease,box-shadow .2s ease}
        .card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08)}

        .nav-link{font-size:14px;color:#6b7280;font-weight:500;transition:color .15s ease;cursor:pointer}
        .nav-link:hover{color:#0a2540}

        .ghost-btn{
          display:inline-flex;align-items:center;gap:6px;
          padding:9px 20px;border-radius:8px;font-size:14px;font-weight:500;
          border:1.5px solid #d1d5db;color:#374151;
          transition:border-color .15s ease,color .15s ease,background .15s ease;
        }
        .ghost-btn:hover{border-color:#0d9488;color:#0d9488;background:#f0fdfa}

        .pulse-dot{position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;background:#0d9488}
        .pulse-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid #0d9488;animation:pulse-ring 1.5s ease-out infinite}

        .bg-dots{background-image:radial-gradient(circle,#d1faf5 1px,transparent 1px);background-size:28px 28px}

        .interview-q{
          padding:10px 14px;border-radius:10px;
          background:#f8fafc;border:1px solid #e5e7eb;
          font-size:13px;color:#374151;line-height:1.5;
          transition:background .15s ease;
        }
        .interview-q:hover{background:#f0fdfa;border-color:#5eead4}

        .footer-link{font-size:13px;color:#9ca3af;transition:color .15s ease;cursor:pointer;text-decoration:none;display:block}
        .footer-link:hover{color:#0d9488}

        .tag-missing{background:#fef2f2;color:#b91c1c;border-color:#fecaca}
        .tag-present{background:#f0fdf4;color:#15803d;border-color:#bbf7d0}
        .tag-neutral{background:#f8fafc;color:#475569;border-color:#e2e8f0}

        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .stat-num{font-size:32px}
          .two-col{grid-template-columns:1fr!important}
          .three-col{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* NAV */}
      <nav ref={navRef} style={{position:'fixed',top:0,left:0,right:0,zIndex:50,background:'rgba(250,250,250,.92)',backdropFilter:'blur(12px)',transition:'border .2s,box-shadow .2s'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,borderRadius:7,background:'#0d9488',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Briefcase size={14} color="white"/>
            </div>
            <span style={{fontWeight:700,fontSize:15,color:'#0a2540',letterSpacing:'-.3px'}}>
              Job<span style={{color:'#0d9488'}}>Journey</span>
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <span className="nav-link hide-mobile" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Features</span>
            <span className="nav-link hide-mobile" onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>How it works</span>
            <button onClick={()=>navigate('/login')} className="nav-link" style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>Log in</button>
            <button onClick={()=>navigate('/register')} className="shimmer-btn" style={{color:'white',border:'none',padding:'7px 18px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>
              Get started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-dots" style={{paddingTop:120,paddingBottom:100,paddingLeft:24,paddingRight:24}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}} className="two-col">
          <div>
            <div className="h1" style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}>
              <span className="pulse-dot"/>
              <span style={{fontSize:12,fontWeight:600,color:'#0d9488',letterSpacing:'.1em',textTransform:'uppercase'}}>Job search, organised</span>
            </div>
            <h1 className="h2" style={{fontSize:48,fontWeight:800,color:'#0a2540',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:20}}>
              Stop losing track of<br/><span style={{color:'#0d9488'}}>where you applied.</span>
            </h1>
            <p className="h3" style={{fontSize:17,color:'#6b7280',lineHeight:1.7,maxWidth:420,marginBottom:32}}>
              One place for every application, status, and follow-up.
              AI-powered resume matching tells you exactly where you stand.
            </p>
            <div className="h4" style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <button onClick={()=>navigate('/register')} className="shimmer-btn" style={{color:'white',border:'none',padding:'11px 24px',borderRadius:9,fontSize:15,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                Start tracking free <ArrowRight size={16}/>
              </button>
              <button className="ghost-btn" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>
                See how it works <ChevronRight size={14}/>
              </button>
            </div>
            <div style={{marginTop:28,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
              {['No credit card','Free forever','Powered by Groq AI'].map(t=>(

                <span key={t} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#9ca3af',fontWeight:500}}>

                  <CheckCircle size={13} color="#0d9488"/> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="float-card hide-mobile" style={{display:'flex',justifyContent:'center'}}>
            <div style={{width:340,background:'white',borderRadius:16,border:'1px solid #e5e7eb',boxShadow:'0 20px 60px rgba(0,0,0,.1)',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #f3f4f6',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:12,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.08em'}}>My Applications</span>
                <span style={{fontSize:11,fontWeight:600,color:'#0d9488',background:'#f0fdfa',padding:'2px 8px',borderRadius:99,border:'1px solid #99f6e4'}}>4 active</span>
              </div>
              {[
                {role:'Frontend Developer',co:'Stripe',loc:'Remote',status:'Interview',cls:'status-interview'},
                {role:'Full Stack Engineer',co:'Notion',loc:'New York',status:'Applied',cls:'status-applied'},
                {role:'React Developer',co:'Vercel',loc:'SF / Remote',status:'Offer 🎉',cls:'status-offer'},
                {role:'Software Engineer',co:'Linear',loc:'Remote',status:'Ghosted',cls:'status-ghosted'},
              ].map((j,i)=>(
                <div key={i} style={{padding:'11px 18px',borderBottom:'1px solid #f9fafb',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'background .15s',cursor:'default'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#374151'}}>{j.co[0]}</div>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:'#0a2540',margin:0}}>{j.role}</p>
                      <p style={{fontSize:11,color:'#9ca3af',margin:'2px 0 0'}}>{j.co} · {j.loc}</p>
                    </div>
                  </div>
                  <span className={`badge ${j.cls}`} style={{fontSize:10}}>{j.status}</span>
                </div>
              ))}
              <div style={{padding:'10px 18px',background:'#f0fdfa',display:'flex',alignItems:'center',gap:8}}>
                <Brain size={13} color="#0d9488"/>
                <span style={{fontSize:12,color:'#0f766e',fontWeight:500}}>
                  Stripe match score ready — <span style={{textDecoration:'underline',cursor:'pointer'}}>78% match</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'96px 24px',background:'white'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="reveal" style={{textAlign:'center',marginBottom:64}}>
            <span className="feature-pill"><Zap size={11}/> What you get</span>
            <h2 style={{fontSize:36,fontWeight:800,color:'#0a2540',letterSpacing:'-.02em',marginBottom:12}}>Everything your job search needs.</h2>
            <p style={{fontSize:16,color:'#6b7280',maxWidth:480,margin:'0 auto'}}>Built for the modern job seeker — from first application to final offer.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}} className="three-col">
            {[
              {icon:<Target size={20} color="#0d9488"/>,bg:'#f0fdfa',title:'Application Tracker',desc:'Kanban-style pipeline. Move jobs through Applied → Interview → Offer. Never forget a follow-up.',tags:['Status tracking','Notes','Follow-up dates']},
              {icon:<Brain size={20} color="#7c3aed"/>,bg:'#f5f3ff',title:'AI Resume Match',desc:'Paste any job description. Get a match score, missing keywords, and specific improvements powered by Gemini AI.',tags:['Match score','Keyword gaps','AI suggestions'],accent:true},
              {icon:<Star size={20} color="#0369a1"/>,bg:'#eff6ff',title:'Interview Prep',desc:'Generate role-specific technical, behavioural, and company questions before every interview.',tags:['5 questions','Role-specific','Instant']},
            ].map((f,i)=>(
              <div key={i} className="reveal card card-hover" style={{padding:28,position:'relative',overflow:'hidden'}}>
                {f.accent&&<div style={{position:'absolute',top:12,right:12,fontSize:10,fontWeight:700,background:'#7c3aed',color:'white',padding:'2px 8px',borderRadius:99,letterSpacing:'.06em'}}>POPULAR</div>}
                <div style={{width:44,height:44,borderRadius:12,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18}}>{f.icon}</div>
                <h3 style={{fontSize:17,fontWeight:700,color:'#0a2540',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:14,color:'#6b7280',lineHeight:1.6,marginBottom:16}}>{f.desc}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {f.tags.map(t=>(
                    <span key={t} style={{fontSize:11,fontWeight:500,color:'#6b7280',background:'#f9fafb',border:'1px solid #e5e7eb',padding:'2px 9px',borderRadius:99}}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI SPOTLIGHT */}
      <section style={{padding:'96px 24px',background:'#fafafa'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}} className="two-col">
          <div className="reveal">
            <span className="feature-pill"><Brain size={11}/> AI Resume Match</span>
            <h2 style={{fontSize:34,fontWeight:800,color:'#0a2540',lineHeight:1.15,letterSpacing:'-.02em',marginBottom:16}}>Know your odds<br/>before you apply.</h2>
            <p style={{fontSize:15,color:'#6b7280',lineHeight:1.7,marginBottom:28}}>Upload your resume once. JobJourney compares it against any job description and returns a score, keyword gaps, and improvement suggestions — powered by Gemini AI.</p>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:12}}>
              {['Match score out of 100','Missing keywords highlighted','Skill gap analysis','3-sentence improvement tip'].map(t=>(
                <li key={t} style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#374151'}}>
                  <CheckCircle size={15} color="#0d9488" style={{flexShrink:0}}/> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal card card-hover" style={{padding:28}}>
            <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:24}}>
              <div style={{position:'relative',width:80,height:80,flexShrink:0}}>
                <svg viewBox="0 0 80 80" style={{width:80,height:80,transform:'rotate(-90deg)'}}>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="7"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#0d9488" strokeWidth="7" strokeLinecap="round" style={{strokeDasharray:213,strokeDashoffset:47}}/>
                </svg>
                <span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#0a2540'}}>78%</span>
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:'#0a2540'}}>Good Match</span>
                  <span style={{fontSize:11,background:'#f0fdf4',color:'#15803d',border:'1px solid #bbf7d0',padding:'1px 7px',borderRadius:99,fontWeight:600}}>↑ 12pts</span>
                </div>
                <p style={{fontSize:12,color:'#9ca3af',margin:0}}>Frontend Developer · Stripe</p>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <p style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',marginBottom:10}}>Keyword Analysis</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {[{w:'React',t:'present'},{w:'JavaScript',t:'present'},{w:'Node.js',t:'present'},{w:'TypeScript',t:'missing'},{w:'GraphQL',t:'missing'},{w:'CI/CD',t:'missing'},{w:'REST APIs',t:'neutral'},{w:'Git',t:'present'}].map(({w,t})=>(
                  <span key={w} className={`kw-tag tag-${t}`}>{t==='present'?'✓':t==='missing'?'✕':'·'} {w}</span>
                ))}
              </div>
            </div>
            <div style={{background:'#f0fdfa',borderRadius:10,padding:'12px 14px',border:'1px solid #99f6e4'}}>
              <p style={{fontSize:11,fontWeight:700,color:'#0f766e',marginBottom:4,display:'flex',alignItems:'center',gap:4}}><Zap size={11}/> AI Suggestion</p>
              <p style={{fontSize:12,color:'#0f766e',lineHeight:1.5,margin:0}}>Add TypeScript to 2 projects and mention CI/CD in your summary. This should push your score above 90%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:'80px 24px',background:'#0a2540'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(255,255,255,.08)',borderRadius:16,overflow:'hidden'}} className="three-col">
            {[
              {n:'2,400+',label:'Applications tracked',sub:'by job seekers like you'},
              {n:'78%',label:'Average match score',sub:'after following AI tips'},
              {n:'3×',label:'Faster interview prep',sub:'with AI question generation'},
            ].map((s,i)=>(
              <div key={i} className="reveal" style={{padding:'40px 36px',background:'rgba(255,255,255,.04)',borderRight:i<2?'1px solid rgba(255,255,255,.08)':undefined,textAlign:'center'}}>
                <div className="stat-num">{s.n}</div>
                <p style={{fontSize:15,fontWeight:600,color:'white',margin:'8px 0 4px'}}>{s.label}</p>
                <p style={{fontSize:12,color:'rgba(255,255,255,.4)',margin:0}}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:'96px 24px',background:'white'}}>
        <div style={{maxWidth:680,margin:'0 auto'}}>
          <div className="reveal" style={{marginBottom:56}}>
            <span className="feature-pill"><TrendingUp size={11}/> How it works</span>
            <h2 style={{fontSize:34,fontWeight:800,color:'#0a2540',letterSpacing:'-.02em',marginBottom:12}}>Up and running in minutes.</h2>
            <p style={{fontSize:15,color:'#6b7280',lineHeight:1.6}}>No setup. No integrations. Just open it and start.</p>
          </div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:19,top:44,bottom:44,width:1,background:'linear-gradient(to bottom,#0d9488,#e5e7eb)'}}/>
            {[
              {n:1,title:'Add your applications',desc:'Paste a job link or fill in the details manually. Set the status, add notes, and track it through every round.'},
              {n:2,title:'Upload your resume',desc:'Upload a PDF once. JobJourney stores it securely and uses it for every AI match analysis going forward.'},
              {n:3,title:'Get AI-powered insights',desc:"Hit Analyse on any job. Get a match score, keyword gaps, improvement suggestions, and 5 interview questions — in under 10 seconds."},
            ].map((s,i)=>(
              <div key={i} className="reveal" style={{display:'flex',gap:24,paddingBottom:i<2?40:0,position:'relative'}}>
                <div style={{width:40,height:40,borderRadius:99,background:'#0d9488',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,zIndex:1,boxShadow:'0 0 0 4px white,0 0 0 5px #99f6e4'}}>
                  <span style={{color:'white',fontWeight:800,fontSize:14}}>{s.n}</span>
                </div>
                <div style={{paddingTop:8}}>
                  <h3 style={{fontSize:16,fontWeight:700,color:'#0a2540',marginBottom:6}}>{s.title}</h3>
                  <p style={{fontSize:14,color:'#6b7280',lineHeight:1.6,margin:0}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERVIEW PREVIEW */}
      <section style={{padding:'80px 24px',background:'#fafafa'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}} className="two-col">
          <div className="reveal card" style={{padding:24}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18,paddingBottom:14,borderBottom:'1px solid #f3f4f6'}}>
              <div style={{width:28,height:28,borderRadius:7,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Brain size={14} color="#0369a1"/>
              </div>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:'#0a2540',margin:0}}>Interview Questions</p>
                <p style={{fontSize:11,color:'#9ca3af',margin:0}}>Frontend Developer · Stripe</p>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                {type:'Technical',q:"Walk me through how you'd optimise a React app with 10,000 list items."},
                {type:'Technical',q:'How would you implement real-time updates in a dashboard using WebSockets?'},
                {type:'Behavioural',q:'Describe a time you had to refactor a large codebase. What was your approach?'},
                {type:'Behavioural',q:'How do you handle disagreements with your tech lead on architectural decisions?'},
                {type:'Company',q:'Why Stripe specifically — what excites you about working on financial infrastructure?'},
              ].map((q,i)=>(
                <div key={i} className="interview-q">
                  <span style={{fontSize:10,fontWeight:700,color:q.type==='Technical'?'#0369a1':q.type==='Behavioural'?'#7c3aed':'#0d9488',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:3}}>{q.type}</span>
                  {q.q}
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <span className="feature-pill"><Star size={11}/> Interview Prep</span>
            <h2 style={{fontSize:34,fontWeight:800,color:'#0a2540',lineHeight:1.15,letterSpacing:'-.02em',marginBottom:16}}>Walk in prepared,<br/>every time.</h2>
            <p style={{fontSize:15,color:'#6b7280',lineHeight:1.7,marginBottom:24}}>Click "Generate Questions" on any job. Get 5 targeted questions — 2 technical, 2 behavioural, 1 company-specific — tailored to the exact role and company.</p>
            <button onClick={()=>navigate('/register')} className="shimmer-btn" style={{color:'white',border:'none',padding:'10px 22px',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
              Try it free <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px',background:'#0a2540',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-80,right:-80,width:320,height:320,borderRadius:'50%',background:'rgba(13,148,136,.15)',filter:'blur(60px)',pointerEvents:'none'}}/>

        {/* responsive wrapper (text below illustration on mobile) */}
        <div style={{position:'relative',maxWidth:920,margin:'0 auto'}}>
          <div
            className="reveal"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 48,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* LEFT COLUMN */}
            <div style={{flex: '1 1 0%', minWidth: 240}}>
              <h2 style={{fontSize:38,fontWeight:800,color:'white',letterSpacing:'-.02em',lineHeight:1.15,marginBottom:16,textAlign:'left'}}>
                Ready to get organised?
              </h2>
              <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.6,marginBottom:28,textAlign:'left'}}>
                Free to use. No credit card. Start tracking in under a minute.
              </p>

              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',justifyContent:'flex-start'}}>
                <button
                  onClick={()=>navigate('/register')}
                  style={{background:'white',color:'#0a2540',border:'none',padding:'12px 28px',borderRadius:9,fontSize:15,fontWeight:700,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6,transition:'transform .15s,box-shadow .15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
                >
                  Create free account <ArrowRight size={15}/>
                </button>

                <button
                  onClick={()=>navigate('/login')}
                  style={{background:'transparent',color:'rgba(255,255,255,.7)',border:'1.5px solid rgba(255,255,255,.2)',padding:'11px 24px',borderRadius:9,fontSize:14,fontWeight:500,cursor:'pointer',transition:'border-color .15s,color .15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.5)';e.currentTarget.style.color='white'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.2)';e.currentTarget.style.color='rgba(255,255,255,.7)'}}
                >
                  Sign in instead
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN (SVG illustration only) */}
            <div style={{flex: '0 1 auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
              <svg
                viewBox="0 0 400 300"
                width="100%"
                maxWidth="420px"
                style={{display:'block'}}
                aria-hidden="true"
              >
                {/* laptop base */}
                <rect x="56" y="86" width="288" height="150" rx="16" fill="#0a2540" opacity="0.95" />
                <rect x="70" y="100" width="260" height="120" rx="12" fill="#0d9488" opacity="0.12" />
                <rect x="84" y="112" width="232" height="92" rx="10" fill="#0a2540" opacity="0.9" />

                {/* kanban board headers */}
                <rect x="96" y="124" width="66" height="18" rx="6" fill="#0d9488" opacity="0.95" />
                <rect x="168" y="124" width="66" height="18" rx="6" fill="#e5e7eb" opacity="0.9" />
                <rect x="240" y="124" width="54" height="18" rx="6" fill="#0d9488" opacity="0.45" />

                {/* job cards (left column) */}
                <rect x="102" y="148" width="54" height="26" rx="8" fill="#0d9488" opacity="0.95" />
                <rect x="108" y="156" width="34" height="6" rx="3" fill="#e5e7eb" opacity="0.55" />
                <rect x="102" y="178" width="54" height="22" rx="8" fill="#0d9488" opacity="0.35" />

                {/* job cards (middle column) */}
                <rect x="174" y="148" width="54" height="26" rx="8" fill="#e5e7eb" opacity="0.95" />
                <rect x="180" y="156" width="34" height="6" rx="3" fill="#0a2540" opacity="0.35" />
                <rect x="174" y="178" width="54" height="22" rx="8" fill="#e5e7eb" opacity="0.55" />
                <rect x="180" y="184" width="30" height="5" rx="2.5" fill="#0a2540" opacity="0.25" />

                {/* job cards (right column) */}
                <rect x="246" y="148" width="42" height="26" rx="8" fill="#0d9488" opacity="0.65" />
                <circle cx="266" cy="161" r="3" fill="#e5e7eb" opacity="0.55" />
                <rect x="246" y="178" width="42" height="22" rx="8" fill="#0d9488" opacity="0.25" />

                {/* subtle base line */}
                <path d="M98 226 C150 250, 250 250, 302 226" fill="none" stroke="#0d9488" strokeWidth="4" opacity="0.18" strokeLinecap="round" />

                {/* floating resume document */}
                <rect x="44" y="138" width="98" height="128" rx="14" fill="#e5e7eb" opacity="0.92" />
                <rect x="56" y="158" width="74" height="16" rx="8" fill="#0a2540" opacity="0.12" />
                <rect x="56" y="180" width="64" height="12" rx="6" fill="#0a2540" opacity="0.10" />
                <rect x="56" y="198" width="72" height="12" rx="6" fill="#0a2540" opacity="0.10" />
                <rect x="56" y="216" width="52" height="10" rx="5" fill="#0a2540" opacity="0.08" />

                {/* AI spark / analysis icon */}
                <g>
                  <path d="M255 76 L269 96 L249 90 L260 112 L241 104 L247 82 Z" fill="#0d9488" opacity="0.95" />
                  <path d="M265 90 L274 86" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                  <path d="M252 98 L244 104" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
                  <circle cx="260" cy="100" r="4" fill="#e5e7eb" opacity="0.55" />
                </g>

                {/* floating elements: briefcase + check badge */}
                <g>
                  <rect x="310" y="186" width="48" height="34" rx="12" fill="#0d9488" opacity="0.95" />
                  <path d="M322 186 C322 176, 336 176, 336 186" fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
                  <rect x="318" y="196" width="34" height="8" rx="4" fill="#0a2540" opacity="0.22" />

                  <circle cx="346" cy="120" r="18" fill="#0d9488" opacity="0.18" />
                  <circle cx="346" cy="120" r="12" fill="#0d9488" opacity="0.95" />
                  <path d="M340 120 L343.6 123.6 L352 114.5" fill="none" stroke="#e5e7eb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
          </div>

          {/* inline media query for CTA layout */}
          <style>{`
            @media(max-width:768px){
              .cta-2col{flex-direction:column !important;}
            }
          `}</style>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#f9fafb',borderTop:'1px solid #e5e7eb',padding:'48px 24px 32px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:48,marginBottom:40}} className="footer-grid">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{width:26,height:26,borderRadius:6,background:'#0d9488',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Briefcase size={13} color="white"/>
                </div>
                <span style={{fontWeight:700,fontSize:14,color:'#0a2540'}}>Job<span style={{color:'#0d9488'}}>Journey</span></span>
              </div>
              <p style={{fontSize:13,color:'#9ca3af',lineHeight:1.6,maxWidth:260,marginBottom:16}}>A full-stack job tracking app built with React, Node.js, MongoDB, and Gemini AI.</p>
              <div style={{display:'flex',gap:10}}>
                {[
                  {label:'GitHub',icon:<Github size={13}/>,href:'https://github.com/ramsha1554/JobJourney'},
                  {label:'Live app',icon:<ExternalLink size={13}/>,href:'https://job-journey-gold.vercel.app'},
                ].map(l=>(
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#6b7280',textDecoration:'none',padding:'5px 10px',border:'1px solid #e5e7eb',borderRadius:6,transition:'all .15s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#0d9488';e.currentTarget.style.color='#0d9488'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280'}}>
                    {l.icon} {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',marginBottom:14}}>Product</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['Dashboard','Job Board','Resume Upload','AI Analysis','Interview Prep'].map(l=>(
                  <span key={l} className="footer-link" onClick={()=>navigate('/login')}>{l}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9ca3af',marginBottom:14}}>Built with</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['React + Tailwind','Node.js + Express','MongoDB + Mongoose','Cloudinary','Gemini AI'].map(l=>(
                  <span key={l} style={{fontSize:13,color:'#9ca3af'}}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{borderTop:'1px solid #e5e7eb',paddingTop:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <p style={{fontSize:12,color:'#d1d5db',margin:0}}>© {new Date().getFullYear()} JobJourney. Built by Ramsha.</p>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {['React','Node.js','MongoDB','Cloudinary','Gemini'].map(t=>(
                <span key={t} style={{fontSize:11,color:'#d1d5db',fontWeight:500}}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
      );
};

export default LandingPage;
