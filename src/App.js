import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import './App.css';

const NAV = ['About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];

const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Resulticks Edge Solution Technologies Pvt Ltd',
    period: '09/2024 — Present',
    current: true,
    points: [
      'Developed backend systems for high-volume marketing campaigns (Email, SMS, Push Notifications)',
      'Designed approval-based workflow engine ensuring secure and auditable campaign execution',
      'Implemented SMTP-based approval mechanisms to validate message triggering',
      'Refactored API architecture, improving system throughput and scalability',
      'Optimized MySQL queries improving performance significantly for large datasets',
      'Reduced API response time by 30% through query optimization and efficient logic design',
      'Resolved critical production issues, ensuring high system reliability and uptime',
    ],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Bloomlync Technology Pvt Ltd',
    period: '09/2022 — 09/2024',
    current: false,
    points: [
      'Built backend for real-time video streaming & live betting platform with high concurrency',
      'Implemented real-time communication using SignalR for live odds, results and event updates',
      'Designed PostgreSQL schemas and indexing strategies for high-volume transactional systems',
      'Developed secure REST APIs using JWT authentication and role-based access control (RBAC)',
      'Built gRPC-based inter-service communication for efficient microservices architecture',
      'Containerized backend services using Docker for consistent deployment environments',
      'Improved system performance using async processing and database optimization techniques',
    ],
  },
];

const PROJECTS = [
  {
    title: 'Real-Time Betting & Streaming Platform',
    company: 'Bloomlync Technology',
    tag: 'High Concurrency',
    color: '#00e5b4',
    description:
      'Backend system for a live video streaming and betting platform handling high concurrent users. Powered real-time odds, results, and event updates with sub-second latency.',
    tech: ['ASP.NET Core', 'SignalR', 'PostgreSQL', 'JWT', 'gRPC', 'Docker', 'RBAC'],
    highlights: [
      'Real-time communication via SignalR',
      'JWT + RBAC secure APIs',
      'gRPC microservices',
      'Docker containerization',
    ],
  },
  {
    title: 'High-Volume Marketing Campaign Engine',
    company: 'Resulticks Edge Solution',
    tag: 'Performance',
    color: '#8b5cf6',
    description:
      'Scalable backend engine processing millions of marketing communications across Email, SMS, and Push channels with approval-based workflow and audit trails.',
    tech: ['ASP.NET Core', 'MySQL', 'SMTP', 'REST API', 'Entity Framework', 'Clean Architecture'],
    highlights: [
      '30% API response time reduction',
      'Approval workflow engine',
      'MySQL query optimization',
      'Production issue resolution',
    ],
  },
];

const SKILLS = {
  Languages: ['C#', 'SQL'],
  Frameworks: ['ASP.NET Core', 'MVC', 'Web API', '.NET Framework'],
  ORM: ['Entity Framework Core', 'LINQ', 'ADO.NET'],
  Databases: ['SQL Server', 'PostgreSQL', 'MySQL'],
  Architecture: ['Microservices', 'Clean Architecture', 'Layered', 'SOLID'],
  Concepts: ['REST APIs', 'JWT', 'RBAC', 'SignalR', 'gRPC', 'Async'],
  Containers: ['Docker'],
  Testing: ['xUnit', 'Moq'],
  Tools: ['Swagger', 'Postman', 'SQLyog', 'Git'],
};

const SOFT_SKILLS = [
  'Team Collaboration',
  'Problem-Solving',
  'Adaptability',
  'Strong Work Ethic',
  'Mentorship',
];

/* ─── Custom Hooks ─── */

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useActiveSection() {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const handler = () => {
      const sections = NAV.map(n => document.getElementById(n.toLowerCase()));
      let current = 'about';
      for (const sec of sections) {
        if (sec && sec.getBoundingClientRect().top <= 200) {
          current = sec.id;
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return active;
}

function useTypingEffect(texts, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % texts.length);
    }
    setDisplay(current.substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const isNum = !isNaN(parseFloat(target));
  const numVal = parseFloat(target);
  const suffix = isNum ? String(target).replace(String(numVal), '') : '';

  useEffect(() => {
    if (!start || !isNum) return;
    let startTime;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numVal * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, numVal, duration, isNum]);

  if (!isNum) return target;
  return (Number.isInteger(numVal) ? Math.round(count) : count.toFixed(1)) + suffix;
}

/* ─── Particles Background ─── */

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 180, ${p.o})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 180, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}

/* ─── Cursor Glow ─── */

function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      el.style.opacity = '1';
    };
    const leave = () => { el.style.opacity = '0'; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,180,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
}

/* ─── Scroll to Top ─── */

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 99,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'rgba(3,3,3,0.85)',
        backdropFilter: 'blur(12px)',
        color: 'var(--accent)',
        fontSize: 18,
        cursor: 'pointer',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ↑
    </button>
  );
}

/* ─── Tilt Card Wrapper ─── */

function TiltCard({ children, style, ...props }) {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,229,180,0.04) 0%, var(--card) 50%)`;
  }, []);
  const handleLeave = useCallback(() => {
    const card = ref.current;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    card.style.background = 'var(--card)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transition: 'transform 0.15s ease, background 0.3s ease, border-color 0.3s ease',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(3,3,3,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        padding: '0 2rem',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a
          href="#about"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
        >
          KP<span style={{ color: 'var(--muted)' }}>.dev</span>
        </a>
        <div style={{ display: 'flex', gap: '2rem', listStyle: 'none' }} className="nav-links">
          {NAV.map(n => {
            const isActive = active === n.toLowerCase();
            return (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s, font-weight 0.2s',
                  position: 'relative',
                  paddingBottom: 4,
                }}
                onMouseEnter={e => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--muted)'; }}
              >
                {n}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 16, height: 2, background: 'var(--accent)', borderRadius: 2,
                  }} />
                )}
              </a>
            );
          })}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, cursor: 'pointer', padding: 4 }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile slide-in menu */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed', top: 64, right: 0, bottom: 0,
          width: 260,
          background: 'rgba(3,3,3,0.97)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', padding: '2rem',
          gap: '1.5rem',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 101,
        }}
      >
        {NAV.map(n => (
          <a
            key={n}
            href={`#${n.toLowerCase()}`}
            onClick={() => setOpen(false)}
            style={{
              color: active === n.toLowerCase() ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: active === n.toLowerCase() ? 600 : 400,
              transition: 'color 0.2s',
            }}
          >
            {n}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero ─── */

function Hero() {
  const [ref, vis] = useInView(0.1);
  const typedText = useTypingEffect([
    'Backend Engineer',
    '.NET Developer',
    'API Architect',
    'System Designer',
  ], 90, 2200);

  const stats = [
    ['3.5+', 'Years Experience'],
    ['2', 'Companies'],
    ['30%', 'API Response Reduction'],
  ];

  return (
    <section
      id="about" ref={ref}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 2rem 80px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 20% 60%, rgba(0,229,180,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(.22,1,.36,1)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)',
            letterSpacing: '0.15em', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
              animation: 'pulse 2s infinite',
            }} />
            {typedText}
            <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--accent)' }}>|</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Karthik{' '}
            <span style={{ WebkitTextStroke: '2px var(--accent)', color: 'transparent' }}>P</span>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--muted)', maxWidth: 580, lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Results-driven .NET Backend Developer with{' '}
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>3.5+ years</span> of experience designing and
            building <span style={{ color: 'var(--text)', fontWeight: 600 }}>scalable, high-performance</span>{' '}
            backend systems. Strong expertise in C#, ASP.NET Core, REST API development, and
            database optimization.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn-primary" style={{
              background: 'var(--accent)', color: '#000', padding: '14px 32px', borderRadius: 6,
              textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
              transition: 'all 0.3s ease', border: 'none',
            }}>
              Get In Touch →
            </a>
            <a href="#experience" className="btn-secondary" style={{
              border: '1px solid var(--border)', color: 'var(--text)', padding: '14px 32px',
              borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14,
              letterSpacing: '0.05em', transition: 'all 0.3s ease',
            }}>
              View Work
            </a>
          </div>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {stats.map(([n, l]) => (
              <StatCounter key={l} value={n} label={l} start={vis} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, label, start }) {
  const display = useCountUp(value, 2000, start);
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
        {display}
      </p>
      <p style={{ color: 'var(--muted)', fontSize: 12, letterSpacing: '0.05em', marginTop: 6 }}>{label}</p>
    </div>
  );
}

/* ─── Experience ─── */

function Experience() {
  const [ref, vis] = useInView();
  return (
    <section id="experience" ref={ref} style={{ padding: '100px 2rem', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel label="Work Experience" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem' }}>
          {EXPERIENCE.map((exp, i) => (
            <TiltCard
              key={i}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? 'perspective(800px) rotateX(0) rotateY(0) scale(1)' : 'translateY(30px)',
                transitionDelay: `${i * 0.15}s`,
                transitionDuration: '0.7s',
                transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {exp.current && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)' }}>{exp.role}</h3>
                  <p style={{ color: 'var(--accent)', fontSize: 14, marginTop: 4 }}>{exp.company}</p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)',
                  background: 'var(--bg3)', padding: '5px 14px', borderRadius: 20,
                }}>
                  {exp.period}
                </span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {exp.points.map((p, j) => (
                  <li key={j} style={{ display: 'flex', gap: '0.75rem', fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>▸</span> {p}
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Projects ─── */

function Projects() {
  const [ref, vis] = useInView();
  return (
    <section id="projects" ref={ref} style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel label="Projects" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          {PROJECTS.map((p, i) => (
            <TiltCard
              key={i}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? 'perspective(800px) rotateX(0) rotateY(0) scale(1)' : 'translateY(30px)',
                transitionDelay: `${i * 0.2}s`,
                transitionDuration: '0.7s',
                transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '2rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = p.color)}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--card)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)', color: p.color,
                  background: `${p.color}12`, padding: '4px 12px', borderRadius: 20, fontWeight: 600,
                }}>
                  {p.tag}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.company}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>{p.description}</p>
              <div>
                <p style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  Key Highlights
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {p.highlights.map((h, j) => (
                    <li key={j} style={{ fontSize: 12.5, color: 'var(--muted)', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: p.color }}>✓</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                {p.tech.map(t => (
                  <span key={t} style={{
                    fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--muted)',
                    background: 'var(--bg3)', padding: '3px 8px', borderRadius: 4,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Skills ─── */

function Skills() {
  const [ref, vis] = useInView();
  return (
    <section id="skills" ref={ref} style={{ padding: '100px 2rem', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel label="Technical Stack" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '3rem' }}>
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <div
              key={cat}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? 'none' : 'translateY(20px)',
                transition: `all 0.6s ease ${i * 0.06}s`,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '1.25rem',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                {cat.toUpperCase()}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {items.map(s => (
                  <span key={s} className="skill-chip" style={{
                    fontSize: 12, color: 'var(--text)', background: 'var(--bg3)',
                    border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 5,
                    transition: 'all 0.2s ease', cursor: 'default',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '3rem', opacity: vis ? 1 : 0, transition: 'all 0.7s ease 0.5s' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            STRENGTHS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {SOFT_SKILLS.map(s => (
              <span key={s} className="soft-skill-chip" style={{
                fontSize: 13, color: 'var(--accent2)',
                border: '1px solid rgba(139,92,246,0.3)',
                padding: '7px 18px', borderRadius: 20,
                background: 'rgba(139,92,246,0.06)',
                transition: 'all 0.3s ease', cursor: 'default',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Education ─── */

function Education() {
  const [ref, vis] = useInView();
  const edu = [
    { degree: 'Master of Computer Applications (MCA)', school: 'University of Madras', period: '05/2025 — Present', icon: '🎓' },
    { degree: 'B.Sc. Computer Science', school: 'Tiruvalluvar University', period: '05/2019 — 05/2022', icon: '📘' },
  ];
  return (
    <section id="education" ref={ref} style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel label="Education" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
          {edu.map((e, i) => (
            <TiltCard
              key={i}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? 'perspective(800px) rotateX(0) rotateY(0) scale(1)' : 'translateX(-20px)',
                transitionDelay: `${i * 0.15}s`,
                transitionDuration: '0.6s',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '1.5rem 2rem',
              }}
            >
              <div style={{ fontSize: 36, lineHeight: 1 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{e.degree}</h3>
                <p style={{ color: 'var(--accent)', fontSize: 14, marginTop: 2 }}>{e.school}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {e.period}
              </span>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */

function Contact() {
  const [ref, vis] = useInView();
  return (
    <section id="contact" ref={ref} style={{ padding: '100px 2rem', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel label="Contact" center />
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(30px)', transition: 'all 0.7s ease 0.2s' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, margin: '1.5rem 0' }}>
            Let's Build<br />
            <span style={{ color: 'var(--accent)' }}>Something Great</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '3rem' }}>
            I'm currently open to new opportunities. Whether you have a question, a project idea, or
            just want to say hi — my inbox is always open.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:karthik22061212@gmail.com" className="btn-primary" style={{
              background: 'var(--accent)', color: '#000', padding: '16px 36px', borderRadius: 6,
              textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
              transition: 'all 0.3s ease', border: 'none',
            }}>
              Send Email →
            </a>
            <a href="tel:6385792684" className="btn-secondary" style={{
              border: '1px solid var(--border)', color: 'var(--text)', padding: '16px 36px',
              borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14,
              letterSpacing: '0.05em', transition: 'all 0.3s ease',
            }}>
              📱 +91 6385792684
            </a>
          </div>
          <p style={{ marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
            karthik22061212@gmail.com
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer style={{ padding: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
        © 2025 Karthik P · Built with React · Hosted on GitHub Pages
      </p>
    </footer>
  );
}

/* ─── Section Label ─── */

function SectionLabel({ label, center }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
        {'// ' + label.toUpperCase()}
      </p>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>{label}</h2>
    </div>
  );
}

/* ─── App ─── */

export default function App() {
  return (
    <>
      <Particles />
      <CursorGlow />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
