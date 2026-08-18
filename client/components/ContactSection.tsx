"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion, AnimatePresence, useInView, useMotionValue, useMotionTemplate,
  useScroll, useTransform, useSpring,
} from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, ArrowRight, Quote, ArrowUpRight, CheckCircle2,
  ChevronDown, AlertCircle, Check,
} from "lucide-react";
import GoogleStudioMap from "./GoogleStudioMap";
import { useContent } from "@/lib/contentContext";

type SocialIconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

const Instagram = ({ size = 24, ...props }: SocialIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><rect width={20} height={20} x={2} y={2} rx={5} ry={5} /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1={17.5} x2={17.51} y1={6.5} y2={6.5} /></svg>
);
const Facebook = ({ size = 24, ...props }: SocialIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Youtube = ({ size = 24, ...props }: SocialIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
);

const TESTIMONIALS = [
  { name: "Sarah & Michael", location: "Dallas, TX", text: "Absolutely incredible experience! The team captured every moment beautifully." },
  { name: "Emily & James", location: "Lake Como, Italy", text: "Destination wedding perfection. Worth every penny for the cinematic quality." },
];

const COVERAGE_OPTIONS = [
  { value: "photo_video", label: "Signature Cinema + Photo Bundle" },
  { value: "photo", label: "Photography Only" },
  { value: "video", label: "Videography Only" },
  { value: "destination", label: "Destination Wedding / Multi-Day" },
  { value: "engagement", label: "Pre-Wedding / Engagement Shoot" },
  { value: "other", label: "Other Event" },
];

const BUDGET_OPTIONS = [
  { value: "$3,000 - $5,000", label: "$3,000 – $5,000" },
  { value: "$5,000 - $8,000", label: "$5,000 – $8,000" },
  { value: "$8,000 - $12,000", label: "$8,000 – $12,000" },
  { value: "$12,000+", label: "$12,000+ (Luxury Bespoke)" },
];

const MESSAGE_LIMIT = 500;

/* ── click-outside hook ─────────────────────────────────────────── */
function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

/* ── custom select ──────────────────────────────────────────────── */
function CustomSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#F5F1E8]/40 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 bg-transparent border-0 border-b border-[#F5F1E8]/15 px-0 py-2.5 text-sm text-[#F5F1E8] focus:outline-none hover:border-[#C19B6C]/50 transition-colors duration-200 text-left"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[#C19B6C] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-[#C19B6C]/25 bg-[#141416]/95 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] py-1.5"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors duration-150 ${opt.value === value
                      ? "text-[#C19B6C] bg-[#C19B6C]/10"
                      : "text-[#F5F1E8]/75 hover:bg-white/[0.04] hover:text-[#F5F1E8]"
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && <Check size={13} className="shrink-0" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── validated text field ───────────────────────────────────────── */
function Field({
  id, label, type = "text", required = false, value, onChange, colSpan2 = false,
  validate,
}: {
  id: string; label: string; type?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colSpan2?: boolean;
  validate?: (v: string) => string | null;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched && validate ? validate(value) : null;
  const valid = touched && !error && value.length > 0;

  return (
    <div className={`relative group ${colSpan2 ? "md:col-span-2" : ""}`}>
      <input
        type={type}
        id={id}
        required={required}
        placeholder=" "
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={!!error}
        className={`peer w-full bg-transparent border-0 border-b px-0 py-3 pr-6 text-base text-[#F5F1E8] placeholder-transparent focus:ring-0 transition-colors duration-200 ${error ? "border-red-400/60 focus:border-red-400" : "border-[#F5F1E8]/15 focus:border-[#C19B6C]"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 -top-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] ${error
            ? "text-red-400"
            : "text-[#F5F1E8]/40 peer-placeholder-shown:text-[#F5F1E8]/30 peer-focus:text-[#C19B6C]"
          }`}
      >
        {label}{required && " *"}
      </label>

      <AnimatePresence>
        {valid && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute right-0 top-3"
          >
            <Check size={15} className="text-[#C19B6C]" />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5 overflow-hidden"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── magnetic submit button ─────────────────────────────────────── */
function MagneticButton({
  children, disabled, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      disabled={disabled}
      type={rest.type}
      onClick={rest.onClick}
      className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#C19B6C] text-[#0B0B0D] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <span className="absolute inset-0 bg-[#D9BD91] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </motion.button>
  );
}

export default function ContactSection() {
  const { content, addInquiry } = useContent();
  const contactInfo = content?.contact;

  const dynamicContactItems = [
    { icon: Phone, label: "Call / Text", value: contactInfo?.phone || "+1 214 940 8492", href: `tel:${(contactInfo?.phone || "+12149408492").replace(/\s+/g, "")}` },
    { icon: Mail, label: "Direct Email", value: contactInfo?.email || "s.gabriel220@gmail.com", href: `mailto:${contactInfo?.email || "s.gabriel220@gmail.com"}` },
    { icon: MapPin, label: "Studio", value: contactInfo?.address || "Dallas, Texas", sub: "Available worldwide", href: null },
    { icon: Clock, label: "Hours", value: contactInfo?.hours || "Mon – Sat, 9am – 6pm CT", sub: "Evenings by appointment", href: null },
  ];

  const dynamicSocialLinks = [
    { icon: Instagram, href: contactInfo?.instagram || "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: contactInfo?.facebook || "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: contactInfo?.youtube || "https://youtube.com", label: "YouTube" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [clock, setClock] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useInView(formRef, { once: true, margin: "-80px" });

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    service: "photo_video", date: "",
    location: "", budget: "$5,000 - $8,000", message: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save inquiry to global state & server database
    await addInquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: form.service,
      weddingDate: form.date,
      venue: form.location,
      budget: form.budget,
      message: form.message,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 5500);
      return () => clearInterval(interval);
    }
  }, [submitted]);

  // live studio clock — small senior-dev flourish, tied to the film-set theme
  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // cursor spotlight on the form card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgba(193,155,108,0.14), transparent 65%)`;
  const handleCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  // gentle parallax on ambient glow
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const emailError = (v: string) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address" : null);
  const nameError = (v: string) => (v && v.trim().length < 2 ? "Name is too short" : null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#0B0B0D] text-[#F5F1E8] scroll-mt-20 overflow-hidden"
    >
      {/* Cinematic letterbox bar — top */}
      <div className="relative h-8 md:h-10 border-b border-[#C19B6C]/20 flex items-center px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C19B6C] animate-pulse" />
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#C19B6C]/80 font-medium">
            Roma Film Production
          </span>
        </div>
        <span className="ml-auto text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#F5F1E8]/30 font-mono hidden sm:flex items-center gap-3">
          Studio Time · Dallas, TX
          <span className="text-[#C19B6C]/70 tabular-nums">{clock}</span>
        </span>
      </div>

      {/* Ambient mesh glow with scroll parallax */}
      <motion.div style={{ y: glowY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[55%] h-[70%] bg-[#C19B6C]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[#8B6F47]/10 rounded-full blur-[140px]" />
      </motion.div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12 max-w-2xl"
        >
          <span className="block text-[10px] md:text-xs font-mono tracking-[0.35em] uppercase text-[#C19B6C]/70 mb-5">
            04 — Inquiry
          </span>
          <h2 className="h2 mb-5">
            Let&apos;s{" "}
            <span className="relative inline-block">
              <span className="italic font-normal text-[#C19B6C]">Roll.</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#C19B6C] rounded-full origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          <p className="lede text-[#F5F1E8]/65">
            Tell us about your wedding plans, destination ideas, or milestone event —
            we&apos;ll respond within 24 hours to schedule your private consultation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

          {/* ── Left: editorial call-sheet ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col gap-10"
          >
            <div className="border-t border-[#F5F1E8]/10">
              {dynamicContactItems.map(({ icon: Icon, label, value, sub, href }) => (
                <div key={label} className="group flex items-center gap-4 py-4 border-b border-[#F5F1E8]/10">
                  <div className="w-9 h-9 shrink-0 rounded-md border border-[#C19B6C]/30 bg-[#C19B6C]/5 flex items-center justify-center">
                    <Icon size={14} className="text-[#C19B6C]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#F5F1E8]/35 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm md:text-[15px] font-medium text-[#F5F1E8] hover:text-[#C19B6C] transition-colors duration-200 block truncate">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm md:text-[15px] font-medium text-[#F5F1E8]">{value}</p>
                    )}
                    {sub && <p className="text-xs text-[#F5F1E8]/40 font-light mt-0.5">{sub}</p>}
                  </div>
                  {href && (
                    <ArrowUpRight size={14} className="text-[#F5F1E8]/20 group-hover:text-[#C19B6C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#F5F1E8]/35">Follow</span>
              <div className="h-px flex-1 bg-[#F5F1E8]/10" />
              <div className="flex items-center gap-2">
                {dynamicSocialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-md border border-[#F5F1E8]/10 flex items-center justify-center text-[#F5F1E8]/50 hover:border-[#C19B6C]/50 hover:text-[#C19B6C] transition-colors duration-200"
                    aria-label={label}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl border border-[#F5F1E8]/10 bg-white/[0.03] p-6 md:p-7">
              <Quote className="absolute top-5 right-5 w-8 h-8 text-[#C19B6C]/15" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[15px] text-[#F5F1E8]/80 italic leading-relaxed mb-5 pr-6">
                    &ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;
                  </p>
                  <p className="font-display font-medium text-[#F5F1E8] text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#C19B6C] font-semibold mt-0.5">
                    {TESTIMONIALS[activeTestimonial].location}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-1.5 mt-5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={`h-[3px] rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-[#C19B6C] w-6" : "bg-[#F5F1E8]/15 w-3 hover:bg-[#F5F1E8]/30"
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: floating form card with cursor spotlight ───── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative"
          >
            <div className="hidden md:block absolute -top-3 -right-3 w-full h-full rounded-2xl border border-[#C19B6C]/15 -z-10" />
            <div className="hidden md:block absolute -top-1.5 -right-1.5 w-full h-full rounded-2xl border border-[#C19B6C]/10 -z-10" />

            <div
              onMouseMove={handleCardMove}
              className="relative rounded-2xl border border-[#C19B6C]/25 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-9 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <motion.div
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: spotlight }}
              />

              <div className="relative z-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-16 h-16 mx-auto rounded-full bg-[#C19B6C] flex items-center justify-center"
                    >
                      <CheckCircle2 size={30} className="text-[#0B0B0D]" />
                    </motion.div>
                    <h3 className="font-display text-3xl font-light text-[#F5F1E8]">That&apos;s a Wrap</h3>
                    <p className="text-[#F5F1E8]/55 max-w-sm mx-auto text-sm leading-relaxed font-light">
                      We&apos;ve received your inquiry and will respond within 24 hours to schedule
                      your private consultation.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#C19B6C] hover:text-[#F5F1E8] transition-colors duration-200"
                    >
                      Send Another Inquiry
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-8">
                    <Field id="name" label="Full Name" required value={form.name} onChange={set("name")} validate={nameError} />
                    <Field id="phone" label="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
                    <Field id="email" label="Email Address" type="email" required colSpan2 value={form.email} onChange={set("email")} validate={emailError} />

                    <CustomSelect label="Desired Coverage *" value={form.service} onChange={(v) => setForm((p) => ({ ...p, service: v }))} options={COVERAGE_OPTIONS} />

                    <div className="relative">
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#F5F1E8]/40 mb-2">Event Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={set("date")}
                        className="w-full bg-transparent border-0 border-b border-[#F5F1E8]/15 px-0 py-2.5 text-sm text-[#F5F1E8] focus:ring-0 focus:border-[#C19B6C] transition-colors [color-scheme:dark]"
                      />
                    </div>

                    <Field id="location" label="Venue Location / City" value={form.location} onChange={set("location")} />

                    <CustomSelect label="Estimated Budget" value={form.budget} onChange={(v) => setForm((p) => ({ ...p, budget: v }))} options={BUDGET_OPTIONS} />

                    <div className="md:col-span-2 relative group mt-1">
                      <textarea
                        rows={1} id="message" required placeholder=" "
                        maxLength={MESSAGE_LIMIT}
                        value={form.message} onChange={set("message")}
                        className="peer w-full bg-transparent border-0 border-b border-[#F5F1E8]/15 px-0 py-3 text-base text-[#F5F1E8] placeholder-transparent focus:ring-0 focus:border-[#C19B6C] transition-colors resize-none overflow-hidden"
                        onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                        }}
                      />
                      <label htmlFor="message" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#F5F1E8]/40 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#F5F1E8]/30 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-[#C19B6C]">
                        Tell Us About Your Vision *
                      </label>
                      <span className={`absolute right-0 -bottom-5 text-[10px] font-mono tabular-nums ${form.message.length > MESSAGE_LIMIT * 0.9 ? "text-[#C19B6C]" : "text-[#F5F1E8]/25"
                        }`}>
                        {form.message.length}/{MESSAGE_LIMIT}
                      </span>
                    </div>

                    <div className="md:col-span-2 pt-6 flex items-center justify-between flex-wrap gap-4">
                      <MagneticButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
                          {isSubmitting ? "Sending" : "Action — Submit"}
                        </span>
                      </MagneticButton>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#F5F1E8]/30">
                        Response within 24h
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Advanced Google Maps Studio & Destination Radar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24"
        >
          <GoogleStudioMap />
        </motion.div>
      </div>

      {/* Cinematic letterbox bar — bottom */}
      <div className="relative h-8 md:h-10 border-t border-[#C19B6C]/20 flex items-center justify-center px-5">
        <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#F5F1E8]/25 font-mono">
          © {new Date().getFullYear()} Roma Film Production — All Rights Reserved
        </span>
      </div>
    </section>
  );
}