import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, useScroll, useTransform, useSpring,
  useInView, AnimatePresence, useMotionValue,
  color
} from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGit,
} from "react-icons/fa";

import {
  SiMongodb,
  SiPython,
  SiOpenai,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiFigma,
  SiVercel,
  SiFlask,
  SiJavascript,
  SiRender
} from "react-icons/si";
/* ─────────────────────────────────────────────
   DESIGN TOKENS & THEME
───────────────────────────────────────────── */
const LIGHT = {
  bg:       "#F7F6F1",
  surface:  "#FFFFFF",
  surfaceAlt:"#F0EFE9",
  border:   "#E2E0D8",
  text:     "#1A1916",
  muted:    "#6B6860",
  accent:   "#C8622A",
  accentAlt:"#3B5BDB",
  glow:     "rgba(200,98,42,0.15)",
  glowBlue: "rgba(59,91,219,0.12)",
};
const DARK = {
  bg:       "#0E0D0C",
  surface:  "#171614",
  surfaceAlt:"#1E1C1A",
  border:   "#2A2825",
  text:     "#F0EDE6",
  muted:    "#7A7772",
  accent:   "#E07845",
  accentAlt:"#6B8CFF",
  glow:     "rgba(224,120,69,0.12)",
  glowBlue: "rgba(107,140,255,0.10)",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
`;

/* ─────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────── */
function useTypewriter(text, speed = 50, delay = 0) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setIndex(i => {
            if (i < text.length) {
              setDisplay(text.slice(0, i + 1));
              return i + 1;
            } else {
              clearInterval(interval);
              return i;
            }
          });
        }, speed);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [text, speed, delay]);
  return display;
}
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
function useScramble(text, trigger) {
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger) { setDisplay(text); return; }
    let frame = 0;
    const total = text.length * 4;
    ref.current = setInterval(() => {
      setDisplay(text.split("").map((c, i) =>
        frame / 4 > i ? c : (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])
      ).join(""));
      frame++;
      if (frame >= total) { clearInterval(ref.current); setDisplay(text); }
    }, 22);
    return () => clearInterval(ref.current);
  }, [trigger, text]);
  return display;
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function Cursor({ theme }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [label, setLabel] = useState("");
  const [big, setBig] = useState(false);
  const springX = useSpring(x, { stiffness: 500, damping: 28 });
  const springY = useSpring(y, { stiffness: 500, damping: 28 });
  const trailX = useSpring(x, { stiffness: 120, damping: 22 });
  const trailY = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const enter = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (el) { setBig(true); setLabel(el.dataset.cursor || ""); }
    };
    const leave = () => { setBig(false); setLabel(""); };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, []);

  const T = theme;
  return (
    <>
      <motion.div style={{
        position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999,
        x: trailX, y: trailY,
        translateX: "-50%", translateY: "-50%",
        width: big ? 60 : 32, height: big ? 60 : 32,
        borderRadius: "50%",
        border: `1.5px solid ${T.accent}`,
        transition: "width 0.25s, height 0.25s",
        opacity: 0.5,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {big && label && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {label}
          </span>
        )}
      </motion.div>
      <motion.div style={{
        position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999,
        x: springX, y: springY,
        translateX: "-50%", translateY: "-50%",
        width: 6, height: 6, borderRadius: "50%",
        background: T.accent,
      }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, y = 28, once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagButton({ children, style = {}, onClick, dataCursor }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, cursor: "none", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-cursor={dataCursor}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   GITHUB CONTRIBUTION HEATMAP
───────────────────────────────────────────── */
function GitHubHeatmap({ theme: T }) {
  const weeks = 20;
  const days = 7;
  const data = Array.from({ length: weeks * days }, () => Math.random());

  const getColor = (v) => {
    if (v < 0.2) return T.border;
    if (v < 0.4) return `${T.accentAlt}33`;
    if (v < 0.6) return `${T.accentAlt}66`;
    if (v < 0.8) return `${T.accentAlt}99`;
    return T.accentAlt;
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Array.from({ length: days }, (_, d) => (
              <motion.div
                key={d}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (w * days + d) * 0.003, duration: 0.3 }}
                style={{
                  width: 9, height: 9, borderRadius: 2,
                  background: getColor(data[w * days + d]),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LEETCODE STATS
───────────────────────────────────────────── */
function LeetCodeStats({ theme: T }) {
  const stats = [
    { label: "Easy", solved: 142, total: 820, color: "#22c55e" },
    { label: "Medium", solved: 89, total: 1740, color: "#f59e0b" },
    { label: "Hard", solved: 23, total: 751, color: "#ef4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.1}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, width: 52, flexShrink: 0, letterSpacing: "0.08em" }}>{s.label}</span>
            <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(s.solved / s.total) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 3, background: s.color }}
              />
            </div>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, width: 44, textAlign: "right" }}>{s.solved}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero({ theme: T, dark }) {
  const [hovered, setHovered] = useState(false);
  const scrambled = useScramble("Rishit Sinha", hovered);
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, 80]);
  const typewriterText = useTypewriter("Crafting digital experiences that blend engineering precision with creative vision.", 30, 800);
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 100]);

  const WORDS = ["React", "TypeScript", "Node.js", "MongoDB", "OpenAI"];
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" style={{
      minHeight: "100vh",
      background: T.bg,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      paddingTop: 80,
    }}>
      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 2,
          background: T.accent, scaleX: scrollProgress, transformOrigin: "left",
          zIndex: 1000,
        }}
      />

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${T.border} 1px, transparent 1px),
          linear-gradient(90deg, ${T.border} 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        opacity: dark ? 0.35 : 0.5,
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, ${T.bg} 100%)`,
      }} />

      {/* Blobs */}
      <motion.div style={{
        position: "absolute", top: "10%", right: "12%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.glow} 0%, transparent 65%)`,
        y: blobY, filter: "blur(1px)",
      }} />
      <motion.div style={{
        position: "absolute", bottom: "10%", left: "5%",
        width: 380, height: 380, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.glowBlue} 0%, transparent 65%)`,
        filter: "blur(1px)",
      }} />

      {/* Content */}
      <div className="hero-content" style={{
        position: "relative", zIndex: 2,
        maxWidth: 1100, margin: "0 auto",
        padding: "0 40px",
        width: "100%",
      }}>
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${T.surface}CC`,
            border: `1px solid ${T.border}`,
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 48,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Open to opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-cursor="hover"
          className="hero-name"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(56px, 10vw, 120px)",
            fontWeight: 400,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            color: T.text,
            margin: "0 0 16px",
            cursor: "none",
          }}
        >
          {scrambled.split(" ").map((word, wi) => (
            <span key={wi} style={wi === 1 ? {
              fontStyle: "italic",
              color: T.accent,
              WebkitTextStroke: "0px",
            } : {}}>
              {word}{wi === 0 ? " " : ""}
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-subtitle"
          style={{
            display: "flex", alignItems: "center", gap: 16,
            marginBottom: 40,
          }}
        >
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(11px, 1.4vw, 14px)",
            color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            Frontend Engineer &nbsp;·&nbsp; Creative Dev &nbsp;·&nbsp;
          </span>
          <div style={{
            overflow: "hidden", height: "1.4em",
            borderRadius: 4,
          }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  display: "block",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(11px, 1.4vw, 14px)",
                  color: T.accent, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}
              >
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hero-desc"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: T.muted, lineHeight: 1.7,
            maxWidth: 560, marginBottom: 52,
          }}
        >
          {typewriterText}<span style={{ opacity: 0.5 }}>|</span>
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="stats-grid"
          style={{ display: "flex", flexWrap: "wrap", gap: "28px 60px", marginBottom: 56 }}
        >
          {[
            { label: "Projects Shipped", v: 40, s: "+" },
            { label: "Years Experience", v: 5, s: "+" },
            { label: "Client Satisfaction", v: 98, s: "%" },
          ].map(({ label, v, s }) => (
            <div key={label}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 400, color: T.text, lineHeight: 1,
              }}>
                <Counter target={v} suffix={s} />
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9, color: T.muted, letterSpacing: "0.14em",
                textTransform: "uppercase", marginTop: 6,
              }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.46 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 14 }}
        >
          <MagButton
            dataCursor="View"
            style={{
              padding: "14px 36px",
              background: T.text,
              color: T.bg,
              border: "none",
              borderRadius: 8,
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            }}
          >
            View Work
          </MagButton>
          <MagButton
            dataCursor="Contact"
            style={{
              padding: "14px 36px",
              background: "transparent",
              color: T.text,
              border: `1.5px solid ${T.border}`,
              borderRadius: 8,
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
            }}
          >
            Get in Touch
          </MagButton>
        </motion.div>
      </div>

      {/* Decorative corner accent */}
      <div style={{
        position: "absolute", bottom: 40, right: 40, opacity: 0.35,
        fontFamily: "'Space Mono',monospace", fontSize: 9,
        color: T.muted, letterSpacing: "0.2em",
        textTransform: "uppercase",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}>
        Scroll to explore ↓
      </div>
    </section>
  );
}
/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About({ theme: T }) {
  const skills = [
    { name: "React / Next.js", pct: 94 },
    { name: "TypeScript", pct: 88 },
    { name: "Node.js / Express", pct: 82 },
    { name: "MongoDB / PostgreSQL", pct: 76 },
    { name: "Docker / AWS", pct: 68 },
  ];
  return (
    <section id="about" style={{
      padding: "120px 40px",
      background: T.surfaceAlt,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 28, height: 1.5, background: T.accent }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>Chapter 1: About Me</span>
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 400, color: T.text,
            letterSpacing: "-0.02em", marginBottom: 72,
          }}>
            Passionate about <em style={{ color: T.accent }}>Code</em> &amp; Craft
          </h2>
        </Reveal>
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}>
          {/* Left */}
          <div>
            <Reveal delay={0.05}>
              <p style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: 1.75, color: T.muted, marginBottom: 28,
              }}>
                Full-stack engineer bridging design and code. Passionate about scalable systems and AI-driven solutions.
              </p>
              <p style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: 1.75, color: T.muted, marginBottom: 40,
              }}>
                Exploring AI applications and open-source contributions.
              </p>
            </Reveal>

            {/* Skill bars */}
            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {skills.map((s, i) => (
                  <div key={s.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>{s.name}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accent }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 3, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                        style={{ height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.accentAlt})`, borderRadius: 2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* GitHub heatmap card */}
            <Reveal delay={0.12}>
              <div style={{
                background: `${T.surface}CC`,
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 16, padding: "24px 28px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>GitHub Contributions</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accentAlt }}>487 this year</span>
                </div>
                <GitHubHeatmap theme={T} />
              </div>
            </Reveal>

            {/* LeetCode card */}
            <Reveal delay={0.18}>
              <div style={{
                background: `${T.surface}CC`,
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 16, padding: "24px 28px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>LeetCode Progress</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#f59e0b" }}>312 solved</span>
                </div>
                <LeetCodeStats theme={T} />
              </div>
            </Reveal>

            {/* Quick stats */}
            <Reveal delay={0.22}>
              <div className="about-cards" style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}>
                {[
                  { label: "Coffee / day", value: "3+" },
                  { label: "PR's merged", value: "89+" },
                  { label: "Open source", value: "15 repos" },
                  { label: "Stack overflow", value: "Top 12%" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: `${T.surface}CC`,
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${T.border}`,
                    borderRadius: 12, padding: "16px 18px",
                  }}>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: T.text, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SKILLS SECTION
───────────────────────────────────────────── */
function Skills({ theme: T }) {
  const groups = [
    {
      label: "Frontend",
      items: [
        { name: "React", icon:<FaReact/>, color: "#0ea5e9" },
        { name: "Tailwind", icon: <SiTailwindcss/>, color: "#06b6d4" },
        { name: "Framer", icon: <SiFramer/>, color: "#a855f7" },
        { name: "Three.js", icon:<SiThreedotjs/>, color: "#6366f1" },
      ]
    },
    {
      label: "Backend",
      items: [
        { name: "Node.js", icon:<FaNodeJs/>, color: "#22c55e" },
        { name: "Flask", icon: <SiFlask/>, color: "#f59e0b" },
      ]
    },
    {
      label: "Tools & Cloud",
      items: [
        {name:"Render",icon:<SiRender/>,color:"#f93716"},
        { name: "Git", icon: <FaGit/>, color: "#f97316" },
        { name: "OpenAI", icon:<SiOpenai/>, color: "#6366f1" },
        { name: "Vercel", icon: <SiVercel/>, color: T.text },
      ]
    },
    {
      label:"DataBases",
      items:[
        {name:"Mysql",icon:<siMysql/>,color:"#fffff"},
        {name:"MongoDB", icon:<SiMongodb/>, color: "#15803d" },
      ]
    },
    {
      label:"Languages",
      items:[
        {name: "TypeScript", icon: <SiTypescript/>, color: "#3B82F6" },
        {name:"JavaScript",icon:<SiJavascript/>,color:"Yellow"},
        {name:"Python",icon:<SiPython/>,color:"#fffff"}

      ]
    }
  ];

  return (
    <section id="skills" style={{
      padding: "120px 40px",
      background: T.bg,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 28, height: 1.5, background: T.accent }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>Chapter 2: Tech Stack</span>
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 400, color: T.text,
            letterSpacing: "-0.02em", marginBottom: 72,
          }}>
            My <em style={{ color: T.accent }}>Skills</em> &amp; Tools
          </h2>
        </Reveal>

        {groups.map((group, gi) => (
          <div className="skill-groups" key={group.label} style={{ marginBottom: 60 }}>
            <Reveal delay={gi * 0.08}>
              <span style={{
                fontFamily: "'Space Mono',monospace", fontSize: 10,
                color: T.muted, letterSpacing: "0.18em",
                textTransform: "uppercase", display: "block", marginBottom: 24,
              }}>
                — {group.label}
              </span>
            </Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {group.items.map((item, i) => (
                <Reveal key={item.name} delay={gi * 0.05 + i * 0.06}>
                  <motion.div
                    whileHover={{ scale: 1.08, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    data-cursor="hover"
                    style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: 8,
                      width: 88, height: 88, borderRadius: 16,
                      background: `${T.surface}CC`,
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${T.border}`,
                      cursor: "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = item.color + "66";
                      e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}22`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{item.icon}</span>
                    <span style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.5rem", letterSpacing: "0.1em",
                      textTransform: "uppercase", color: T.muted,
                    }}>
                      {item.name}
                    </span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS / WORK
───────────────────────────────────────────── */
function Work({ theme: T }) {
  const [filter, setFilter] = useState("All");
  const FILTERS = ["All", "Web", "AI", "Fullstack"];

  const PROJECTS = [
    {
      title: "FlowBoard",
      subtitle: "Visual API Builder",
      desc: "A visual API orchestration tool built with React Flow and a sandboxed DAG execution engine. Design, test, and deploy API pipelines visually.",
      tech: ["React", "React Flow", "Node.js", "MongoDB"],
      category: "Fullstack",
      status: "Live",
      color: "#6366f1",
      featured: true,
      emoji: "⚡",
    },
    {
      title: "HireLoop",
      subtitle: "Mock Interview Platform",
      desc: "Peer-to-peer mock interview platform with WebRTC video, collaborative coding editor, and AI-powered feedback.",
      tech: ["React", "WebRTC", "Node.js", "OpenAI"],
      category: "AI",
      status: "Beta",
      color: "#c8622a",
      featured: false,
      emoji: "🎯",
    },
    {
      title: "DevMetrics",
      subtitle: "Analytics Dashboard",
      desc: "Full-stack developer analytics dashboard aggregating GitHub, LeetCode, and Wakatime data into beautiful visualisations.",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      category: "Web",
      status: "Live",
      color: "#22c55e",
      featured: false,
      emoji: "📊",
    },
    {
      title: "ShipFast AI",
      subtitle: "Boilerplate Generator",
      desc: "AI-powered project scaffolding tool that generates full Next.js boilerplates from natural language descriptions.",
      tech: ["Next.js", "OpenAI", "TypeScript"],
      category: "AI",
      status: "In Dev",
      color: "#a855f7",
      featured: false,
      emoji: "🚀",
    },
    {
      title: "NexStore",
      subtitle: "E-Commerce Platform",
      desc: "Modern e-commerce platform with Stripe integration, real-time inventory, and admin dashboard.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Fullstack",
      status: "Completed",
      color: "#3b5bdb",
      featured: false,
      emoji: "🛍",
    },
  ];

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  const featured = PROJECTS.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <section id="work" style={{
      padding: "120px 40px",
      background: T.surfaceAlt,
      position: "relative",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 28, height: 1.5, background: T.accent }} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>Chapter 3: Portfolio</span>
              </div>
              <h2 style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 400, color: T.text,
                letterSpacing: "-0.02em",
              }}>
                Featured <em style={{ color: T.accent }}>Work</em>
              </h2>
            </div>
            {/* Filters */}
            <div className="work-filters" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: `1.5px solid ${filter === f ? T.accent : T.border}`,
                    background: filter === f ? T.accent : "transparent",
                    color: filter === f ? "#fff" : T.muted,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10, letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "none",
                    transition: "all 0.2s",
                  }}
                  data-cursor="filter"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Featured card */}
        {(filter === "All" || filter === featured.category) && (
          <Reveal delay={0.05}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              data-cursor="View"
              style={{
                background: `linear-gradient(135deg, ${featured.color}15, ${featured.color}05)`,
                border: `1px solid ${featured.color}33`,
                borderRadius: 20, padding: "48px",
                marginBottom: 32, cursor: "none",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 300, height: 300, borderRadius: "50%",
                background: `radial-gradient(circle, ${featured.color}18 0%, transparent 65%)`,
                transform: "translate(30%, -30%)",
              }} />
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16,
              }}>
                <div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: featured.color, letterSpacing: "0.18em", textTransform: "uppercase" }}>Featured Project</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
                    <span style={{ fontSize: "2.5rem" }}>{featured.emoji}</span>
                    <div>
                      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, margin: 0 }}>{featured.title}</h3>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.muted }}>{featured.subtitle}</span>
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: "6px 16px", borderRadius: 999,
                  background: "rgba(34,197,94,0.12)", color: "#22c55e",
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  {featured.status}
                </span>
              </div>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(15px, 1.8vw, 17px)", color: T.muted, lineHeight: 1.7, maxWidth: 580, marginBottom: 28 }}>
                {featured.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                {featured.tech.map(t => (
                  <span key={t} style={{
                    padding: "5px 14px", borderRadius: 6,
                    background: `${featured.color}14`,
                    border: `1px solid ${featured.color}22`,
                    fontFamily: "'Space Mono',monospace", fontSize: 10,
                    color: featured.color, letterSpacing: "0.06em",
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: featured.color, fontWeight: 700, letterSpacing: "0.08em" }}>
                  Live Demo →
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.muted, letterSpacing: "0.08em" }}>
                  GitHub →
                </span>
              </div>
            </motion.div>
          </Reveal>
        )}

        {/* Grid */}
        <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {rest.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                data-cursor="View"
                style={{
                  background: `${T.surface}CC`,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 16, padding: "28px",
                  cursor: "none", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color + "55";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${p.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{p.emoji}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.3rem", color: T.text, margin: "0 0 4px" }}>{p.title}</h3>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted }}>{p.subtitle}</span>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 999,
                    background: `${p.color}12`,
                    fontFamily: "'Space Mono',monospace", fontSize: 8,
                    color: p.color, letterSpacing: "0.1em", textTransform: "uppercase",
                    flexShrink: 0, marginLeft: 8,
                  }}>{p.status}</span>
                </div>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "0.95rem", color: T.muted, lineHeight: 1.65, marginBottom: 20 }}>
                  {p.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {p.tech.map(t => (
                    <span key={t} style={{
                      padding: "3px 10px", borderRadius: 4,
                      background: T.surfaceAlt, border: `1px solid ${T.border}`,
                      fontFamily: "'Space Mono',monospace", fontSize: 9,
                      color: T.muted,
                    }}>{t}</span>
                  ))}
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: p.color, fontWeight: 700, letterSpacing: "0.08em" }}>
                  View Project →
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact({ theme: T }) {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 18px",
    background: "transparent",
    border: `1px solid ${focused === field ? T.accent : T.border}`,
    borderRadius: 10,
    fontFamily: "'Space Mono',monospace",
    fontSize: 12,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focused === field ? `0 0 0 3px ${T.glow}` : "none",
    resize: "none",
    boxSizing: "border-box",
  });

  return (
    <section id="contact" style={{
      padding: "120px 40px",
      background: T.surfaceAlt,
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: T.accent }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>Chapter 4: Get In Touch</span>
              <div style={{ width: 28, height: 1.5, background: T.accent }} />
            </div>
            <h2 className="contact-title" style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400, color: T.text,
              letterSpacing: "-0.02em", marginBottom: 16,
            }}>
              Let's Build Something <em style={{ color: T.accent }}>Great</em>
            </h2>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.1rem", color: T.muted, lineHeight: 1.7 }}>
              Have a project in mind? I'd love to hear about it. Send me a message and let's talk.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {!sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="contact-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Rishit Sinha"
                    style={inputStyle("name")}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="hello@rishit.dev"
                    style={inputStyle("email")}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: T.muted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Message</label>
                <textarea
                  rows={5}
                  value={form.msg}
                  onChange={e => setForm({ ...form, msg: e.target.value })}
                  onFocus={() => setFocused("msg")}
                  onBlur={() => setFocused(null)}
                  placeholder="Tell me about your project..."
                  style={inputStyle("msg")}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <MagButton
                  dataCursor="Send"
                  onClick={() => setSent(true)}
                  style={{
                    padding: "15px 48px",
                    background: T.text,
                    color: T.bg,
                    border: "none",
                    borderRadius: 8,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                  }}
                >
                  Send Message ✦
                </MagButton>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center", padding: "60px 40px",
                background: `${T.surface}CC`,
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 20,
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.8rem", color: T.text, marginBottom: 12 }}>Message Sent!</h3>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: T.muted, letterSpacing: "0.06em" }}>I'll get back to you within 24 hours.</p>
            </motion.div>
          )}
        </Reveal>

        {/* Socials */}
        <Reveal delay={0.2}>
          <div className="social-links" style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 56 }}>
            {[
              { label: "GitHub", icon: "⑂" },
              { label: "LinkedIn", icon: "in" },
              { label: "Twitter", icon: "𝕏" },
              { label: "Email", icon: "@" },
            ].map(s => (
              <motion.a
                key={s.label}
                href="#"
                whileHover={{ y: -3 }}
                data-cursor={s.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  textDecoration: "none", cursor: "none",
                }}
              >
                <span style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${T.surface}CC`,
                  border: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", color: T.text,
                }} onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>
                  {s.icon}
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</span>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ theme: T, dark, setDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const NAV = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Work", id: "work" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed", top: scrolled ? 10 : 18,
        left: "50%", transform: "translateX(-50%)",
        zIndex: 999,
        display: "flex", alignItems: "center", gap: 4,
        padding: "6px 8px",
        background: `${T.surface}E0`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        boxShadow: scrolled ? `0 8px 40px rgba(0,0,0,0.15)` : `0 2px 12px rgba(0,0,0,0.06)`,
        transition: "top 0.3s ease, box-shadow 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      {/* Brand */}
      <a href="#home" style={{
        fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700,
        letterSpacing: "0.1em", color: T.text,
        textDecoration: "none", textTransform: "uppercase",
        padding: "6px 14px",
        borderRight: `1px solid ${T.border}`, marginRight: 4,
      }}>
        R<span style={{ color: T.accent }}>.dev</span>
      </a>

      {NAV.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={() => setActive(item.id)}
          data-cursor={item.label}
          style={{
            padding: "6px 12px",
            fontFamily: "'Space Mono',monospace",
            fontSize: 10, letterSpacing: "0.09em",
            textTransform: "uppercase",
            textDecoration: "none",
            color: active === item.id ? T.accent : T.muted,
            borderRadius: 999,
            background: active === item.id ? `${T.accent}12` : "transparent",
            transition: "color 0.18s, background 0.18s",
            cursor: "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.color = active === item.id ? T.accent : T.muted; }}
        >
          {item.label}
        </a>
      ))}

      <span style={{ width: 1, height: 18, background: T.border, margin: "0 6px", flexShrink: 0 }} />

      {/* Dark toggle */}
      <motion.button
        onClick={() => setDark(d => !d)}
        whileTap={{ scale: 0.9 }}
        data-cursor="theme"
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: T.surfaceAlt, border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "none", marginRight: 6,
          color: T.text, fontSize: 14,
        }}
      >
        {dark ? "☀" : "◑"}
      </motion.button>

      <MagButton
        dataCursor="hire"
        style={{
          padding: "7px 18px",
          background: T.text,
          color: T.bg,
          border: "none",
          borderRadius: 999,
          fontFamily: "'Space Mono',monospace",
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Hire Me
      </MagButton>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ theme: T }) {
  return (
    <footer style={{
      padding: "40px",
      background: T.bg,
      borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.1em" }}>
        © 2025 Rishit Sinha — Crafted with ❤
      </span>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.1em" }}>
        React · Framer Motion · Tailwind
      </span>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", transition: "background 0.35s, color 0.35s" }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; cursor: none; }
        body { cursor: none; }
        ::selection { background: ${T.accent}30; color: ${T.text}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        a, button { cursor: none; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          nav { top: 10px !important; padding: 4px 6px !important; }
          nav a, nav button { font-size: 9px !important; padding: 4px 8px !important; }
          .hero-content { padding: 0 20px !important; }
          .stats-grid { gap: 20px 40px !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .work-grid { grid-template-columns: 1fr !important; }
          .contact-form { grid-template-columns: 1fr !important; }
          .social-links { gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .hero-name { font-size: clamp(48px, 12vw, 80px) !important; }
          .hero-subtitle { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .hero-desc { font-size: clamp(14px, 1.8vw, 18px) !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .about-cards { grid-template-columns: 1fr !important; }
          .skill-groups { margin-bottom: 40px !important; }
          .work-filters { justify-content: center !important; }
          .contact-title { font-size: clamp(1.5rem, 6vw, 3rem) !important; }
        }
      `}</style>
      <Navbar theme={T} dark={dark} setDark={setDark} />
      <Cursor theme={T}/>
      <main>
        <Hero theme={T} dark={dark} />
        <About theme={T} />
        <Skills theme={T} />
        <Work theme={T} />
        <Contact theme={T} />
      </main>
      <Footer theme={T} />
    </div>
  );
}