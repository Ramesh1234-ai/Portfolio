import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  FaReact, FaNodeJs, FaDocker, FaAws, FaGit,
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope,
} from "react-icons/fa";
import {
  SiTypescript, SiTailwindcss, SiFramer, SiMongodb, SiPostgresql,
  SiOpenai, SiFigma,
} from "react-icons/si";

/* ─────────────────────────────────────────────
   CUSTOM HOOKS
───────────────────────────────────────────── */

// Scroll-triggered fade-in animation
const ScrollFadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   NAVBAR COMPONENT
───────────────────────────────────────────── */

function Navbar({ active, setActive }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Work", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 bg-[#0F0F0F]/80 backdrop-blur-xl" : "py-6 bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between px-4 md:px-0">
        <motion.a
          href="#hero"
          className="text-2xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <span className="gradient-text">Rishit</span>
          <span className="text-white ml-1">.</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActive(item.id)}
              className={`text-sm font-medium transition-colors ${
                active === item.id
                  ? "text-[#FF6B35]"
                  : "text-white/60 hover:text-white"
              }`}
              whileHover={{ y: -2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          className="btn-primary hidden md:block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Talk
        </motion.a>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F]"
    >
      {/* Animated background elements */}
      <div className="blur-bg" />

      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#FF6B35]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#004E89]/20 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 md:px-8 max-w-4xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#FF6B35] font-mono text-sm md:text-base mb-6 tracking-widest"
        >
          WELCOME TO MY PORTFOLIO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-hero font-serif font-bold mb-6 leading-tight"
        >
          I build digital experiences that <span className="gradient-text">inspire</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Full-stack engineer crafting beautiful, performant web applications with a focus on user experience and clean code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#projects"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16"
        >
          <p className="text-white/40 text-sm mb-4">Scroll to explore</p>
          <svg className="w-6 h-6 mx-auto text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────── */

function AboutSection() {
  return (
    <section id="about" className="section-padding bg-[#1A1A1A] relative overflow-hidden">
      <div className="blur-bg" />
      <div className="container-wide">
        <ScrollFadeIn>
          <h2 className="text-section font-serif font-bold mb-12">
            About <span className="gradient-text">Me</span>
          </h2>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollFadeIn delay={0.2}>
            <div className="space-y-6">
              <p className="text-lg text-white/80 leading-relaxed">
                With 5+ years of experience in full-stack development, I specialize in building scalable applications and delightful user interfaces.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                I'm passionate about clean code, creative problem-solving, and staying at the forefront of web technologies. When I'm not coding, you'll find me exploring new AI tools or contributing to open-source projects.
              </p>

              <div className="pt-6 space-y-4">
                <h3 className="font-mono text-sm tracking-wider text-[#FF6B35]">STATS</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass p-4 rounded-lg">
                    <p className="text-3xl font-bold">40+</p>
                    <p className="text-white/60 text-sm mt-1">Projects Shipped</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <p className="text-3xl font-bold">5+</p>
                    <p className="text-white/60 text-sm mt-1">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.4}>
            <div className="space-y-6">
              <h3 className="font-mono text-sm tracking-wider text-[#FF6B35]">TECH STACK</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FaReact, label: "React", color: "#61DAFB" },
                  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
                  { icon: FaNodeJs, label: "Node.js", color: "#339933" },
                  { icon: SiMongodb, label: "MongoDB", color: "#13AA52" },
                  { icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
                  { icon: SiFramer, label: "Framer Motion", color: "#FF002E" },
                ].map((tech) => (
                  <motion.div
                    key={tech.label}
                    className="glass p-4 rounded-lg flex items-center gap-3 hover-lift"
                    whileHover={{ scale: 1.05 }}
                  >
                    <tech.icon size={24} style={{ color: tech.color }} />
                    <span className="text-sm">{tech.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS SECTION (CAROUSEL)
───────────────────────────────────────────── */

function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "FlowBoard",
      subtitle: "Visual API Builder",
      description: "A visual API orchestration tool with sandboxed execution",
      tags: ["React", "Node.js", "MongoDB"],
      color: "#FF6B35",
      status: "Live",
    },
    {
      id: 2,
      title: "HireLoop",
      subtitle: "Mock Interview Platform",
      description: "Peer-to-peer mock interviews with AI feedback",
      tags: ["React", "WebRTC", "OpenAI"],
      color: "#004E89",
      status: "Beta",
    },
    {
      id: 3,
      title: "DevMetrics",
      subtitle: "Analytics Dashboard",
      description: "Real-time developer analytics and insights",
      tags: ["Next.js", "TypeScript", "PostgreSQL"],
      color: "#F4D03F",
      status: "Live",
    },
  ];

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
      );
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    scrollRef.current?.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      scrollRef.current?.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="projects" className="section-padding bg-[#0F0F0F] relative overflow-hidden">
      <div className="blur-bg" />
      <div className="container-wide">
        <ScrollFadeIn>
          <h2 className="text-section font-serif font-bold mb-12">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </ScrollFadeIn>

        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-6 min-w-min">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-96 group"
                >
                  <motion.div
                    className="h-full glass p-8 rounded-2xl cursor-pointer hover-lift"
                    whileHover={{ scale: 1.02 }}
                    style={{ borderColor: project.color + "30" }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <p className="text-white/60 text-sm mt-1">{project.subtitle}</p>
                      </div>
                      <span
                        className="text-xs font-mono px-3 py-1 rounded-full"
                        style={{ backgroundColor: project.color + "20", color: project.color }}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="text-white/70 mb-6">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 bg-white/5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.a href="#" className="text-[#FF6B35] font-mono text-sm font-medium">
                      View Project →
                    </motion.a>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll controls */}
          {canScrollLeft && (
            <motion.button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#0F0F0F] border border-white/10 rounded-full p-2 hover:border-[#FF6B35]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#0F0F0F] border border-white/10 rounded-full p-2 hover:border-[#FF6B35]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────── */

function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="section-padding bg-[#1A1A1A] relative overflow-hidden">
      <div className="blur-bg" />
      <div className="container-wide max-w-2xl">
        <ScrollFadeIn>
          <h2 className="text-section font-serif font-bold mb-6 text-center">
            Let's Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-center text-white/60 text-lg mb-12">
            Have a project in mind? Let's create something amazing.
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass px-6 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-accent-primary"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass px-6 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-accent-primary"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <motion.textarea
              placeholder="Your message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="5"
              className="glass w-full px-6 py-3 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-accent-primary resize-none"
              whileFocus={{ scale: 1.02 }}
            />

            <motion.button
              type="submit"
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitted ? "✓ Message Sent!" : "Send Message"}
            </motion.button>
          </form>
        </ScrollFadeIn>

        {/* Social links */}
        <ScrollFadeIn delay={0.4}>
          <div className="mt-20 pt-12 border-t border-white/10 flex justify-center gap-6">
            {[
              { icon: FaGithub, href: "https://github.com", label: "GitHub" },
              { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
              { icon: FaEnvelope, href: "mailto:hello@example.com", label: "Email" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-lg hover:border-accent-primary transition-colors"
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/10 py-12">
      <div className="container-wide text-center text-white/60 text-sm">
        <p>© 2025 Rishit Sinha. Built with React, Tailwind CSS, and Framer Motion.</p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */

export default function App() {
  const [active, setActive] = useState("hero");
  const { scrollY } = useScroll();

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "contact"];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActive(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0F0F0F] text-white overflow-x-hidden">
      <Navbar active={active} setActive={setActive} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
