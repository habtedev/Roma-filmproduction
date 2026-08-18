"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Camera, Sparkles, ArrowRight, Star, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const NAV_LINKS = [
  { label: "Home", href: "#top", icon: Sparkles },
  { label: "About", href: "#about", icon: Camera },
  { label: "Services", href: "#services", icon: Star },
  { label: "Photos", href: "#photos", icon: Camera },
  { label: "Videos", href: "#videos", icon: Play },
  { label: "Packages", href: "#packages", icon: Sparkles },
  { label: "Contact", href: "#contact", icon: ArrowRight },
];

const SOCIAL_LINKS = [
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

// Cinematic letter animation for logo
const CinematicLogo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-[#C19B6C]/0 via-[#C19B6C]/20 to-[#C19B6C]/0 rounded-xl blur-xl"
        animate={{
          opacity: isHovered ? 1 : 0.5,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Shine sweep effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-lg"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: isHovered ? ["-100%", "200%"] : "-100%",
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#top");


  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [overVideo, setOverVideo] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const windowHeight = window.innerHeight;

    setOverVideo(y < windowHeight * 0.8);
    setScrolled(y > 50);

    if (y < 50) {
      setActiveSection("#top");
      return;
    }

    let current = "#top";
    for (const { href } of NAV_LINKS) {
      const id = href.replace("#", "");
      if (id === "top") continue;
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          current = href;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const raf = requestAnimationFrame(() => handleScroll());
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string) => {
      e.preventDefault();
      
      if (pathname !== "/") {
        router.push(href === "#top" ? "/" : `/${href}`);
        setMobileOpen(false);
        return;
      }

      const id = href.replace("#", "");
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) {
          const offset = window.innerWidth < 640 ? 70 : 90;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      setMobileOpen(false);
    },
    []
  );

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-10 transition-all duration-500 min-h-[70px] sm:min-h-[90px] flex items-center",
          scrolled
            ? "py-3 sm:py-4 bg-white/95 dark:bg-[#070709]/95 border-b border-[#C19B6C]/30 shadow-xl shadow-black/5 dark:shadow-black/70 backdrop-blur-xl"
            : overVideo
              ? "py-4 sm:py-6 lg:py-7 bg-transparent"
              : "py-4 sm:py-6 lg:py-7 bg-gradient-to-b from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent backdrop-blur-xl"
        )}
      >
        {/* Animated gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent"
          animate={{
            opacity: scrolled ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between">

          {/* LOGO with cinematic effects */}
          <motion.a
            href="#top"
            onClick={(e) => scrollTo(e, "#top")}
            className="flex items-center gap-4 group relative focus:outline-none"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <CinematicLogo />
            <div className={cn(
              "relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-colors",
              overVideo ? "bg-transparent" : "border border-[#C19B6C]/40 shadow-md group-hover:border-[#C19B6C] bg-white/70 dark:bg-black/70 backdrop-blur-sm"
            )}>
              <Image
                src="/image/logo.png"
                alt="Roma Film Production"
                width={150}
                height={50}
                priority
                className={cn(
                  "h-8 sm:h-10 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105",
                  overVideo ? "mix-blend-screen" : "mix-blend-normal dark:mix-blend-screen"
                )}
              />

              {/* Animated border glow */}
              <motion.div
                className="absolute -inset-px rounded-lg border border-[#C19B6C]/40"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(193,155,108,0)",
                    "0 0 20px rgba(193,155,108,0.3)",
                    "0 0 0px rgba(193,155,108,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map(({ label, href, icon: Icon }, index) => {
              const isActive = activeSection === href;
              const isHovered = hoveredLink === href;

              return (
                <motion.a
                  key={href}
                  href={href}
                  onClick={(e) => scrollTo(e, href)}
                  onHoverStart={() => setHoveredLink(href)}
                  onHoverEnd={() => setHoveredLink(null)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={cn(
                    "relative py-2 text-[11px] xl:text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300 group",
                    isActive
                      ? "text-[#C19B6C]"
                      : overVideo
                        ? "text-white/95 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mix-blend-difference"
                        : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {Icon && (
                      <Icon className={cn(
                        "w-3 h-3 transition-transform duration-300",
                        isHovered ? "scale-125 rotate-12" : ""
                      )} />
                    )}
                    {label}
                  </span>

                  {/* Active Indicator - Animated gradient */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#C19B6C] via-[#D4B896] to-[#C19B6C] shadow-[0_0_12px_rgba(193,155,108,0.6)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Hover effect - Glowing dot */}
                  {isHovered && !isActive && (
                    <motion.div
                      className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C19B6C]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                  )}

                  {/* Hover glow effect */}
                  <motion.div
                    className={cn(
                      "absolute -inset-x-3 -inset-y-1 rounded-lg",
                      overVideo ? "bg-white/5" : "bg-black/5 dark:bg-white/5"
                    )}
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">

            {/* Mobile Menu Button with cinematic effect */}
            <motion.button
              onClick={() => setMobileOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "lg:hidden flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border transition-all duration-300 shadow-xl group relative overflow-hidden",
                overVideo
                  ? "bg-transparent border-white/20 hover:bg-white/10 hover:border-[#C19B6C]/50 text-white drop-shadow-lg"
                  : "bg-white/60 dark:bg-black/60 backdrop-blur-md border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 hover:border-[#C19B6C]/50 text-black dark:text-white hover:shadow-[#C19B6C]/20"
              )}
              aria-label="Open menu"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#C19B6C]/10 to-transparent"
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-[#C19B6C] transition-colors relative z-10" />
            </motion.button>

            <ThemeToggle />

            {/* Admin Login Button */}
            <motion.a
              href="/admin/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors",
                overVideo
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black/60 dark:text-white/60 hover:text-[#C19B6C] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
              )}
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </motion.a>

            {/* Book Session Button with premium effects */}
            <Button
              variant={overVideo ? "default" : "outline"}
              size="sm"
              onClick={(e) => scrollTo(e, "#contact")}
              className={cn(
                "hidden sm:flex shadow-lg",
                overVideo
                  ? "border border-[#E5C599]/40 shadow-[#C19B6C]/25"
                  : "border-zinc-300 dark:border-white/20 shadow-black/5 dark:shadow-white/5"
              )}
            >
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Book A Session
            </Button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU - Enhanced Cinematic Version */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] lg:hidden"
          >
            {/* Backdrop with blur and gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/98 to-[#C19B6C]/10 dark:from-black/95 dark:via-black/98 dark:to-[#C19B6C]/5 backdrop-blur-3xl"
              onClick={() => setMobileOpen(false)}
            />

            {/* Side panel with 3D effect */}
            <motion.div
              initial={{ x: "-100%", opacity: 0, rotateY: -10 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: "-100%", opacity: 0, rotateY: -10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                opacity: { duration: 0.2 }
              }}
              className="absolute left-0 top-0 bottom-0 w-[320px] sm:w-[380px] max-w-[92vw] sm:max-w-[88vw] bg-white dark:bg-[#0A0A0F] border-r border-black/10 dark:border-white/10 flex flex-col justify-between p-6 sm:p-8 shadow-2xl shadow-gray-400/50 dark:shadow-black/50"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#C19B6C] via-[#D4B896] to-transparent" />

              <div>
                {/* Clean Header */}
                <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="px-3 py-2 bg-white/40 dark:bg-black/40 rounded-lg border border-[#C19B6C]/30 relative"
                  >
                    <Image
                      src="/image/logo.png"
                      alt="Roma Film Production"
                      width={130}
                      height={45}
                      className="h-8 sm:h-10 w-auto object-contain mix-blend-normal dark:mix-blend-screen"
                    />

                    {/* Animated glow */}
                    <motion.div
                      className="absolute -inset-1 rounded-lg border border-[#C19B6C]/30"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(193,155,108,0)",
                          "0 0 15px rgba(193,155,108,0.3)",
                          "0 0 0px rgba(193,155,108,0)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    onClick={() => setMobileOpen(false)}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-[#C19B6C]/40 transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-black/70 dark:text-white/70 hover:text-[#C19B6C]" />
                  </motion.button>
                </div>

                <nav className="flex flex-col gap-1 sm:gap-2">
                  {NAV_LINKS.map(({ label, href, icon: Icon }, i) => {
                    const isActive = activeSection === href;
                    return (
                      <motion.a
                        key={href}
                        href={href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.2 + i * 0.06,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{ x: 6 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => scrollTo(e, href)}
                        className={cn(
                          "group relative flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden",
                          isActive
                            ? "bg-[#C19B6C]/15 text-[#C19B6C] border border-[#C19B6C]/30"
                            : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                        )}
                      >
                        {/* Hover gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#C19B6C]/0 via-[#C19B6C]/10 to-transparent"
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0 }}
                          whileHover={{ opacity: 1 }}
                        />

                        <span className="relative z-10 flex items-center gap-2">
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {label}
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C19B6C] to-[#D4B896]"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        {/* Arrow indicator */}
                        <ArrowRight className={cn(
                          "w-4 h-4 transition-all duration-300 relative z-10",
                          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                      </motion.a>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
                <motion.a
                  href="#contact"
                  onClick={(e) => scrollTo(e, "#contact")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl btn-gold text-white text-[10px] sm:text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase shadow-lg relative overflow-hidden group"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                  <span className="relative z-10">Book A Session</span>
                </motion.a>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="flex items-center justify-center gap-4"
                >
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-[#C19B6C] transition-colors border border-black/10 dark:border-white/10"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  ))}
                  
                  {/* Mobile Admin Login */}
                  <motion.a
                    href="/admin/login"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-[#C19B6C] transition-colors border border-black/10 dark:border-white/10"
                    aria-label="Admin Portal"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-[8px] sm:text-[9px] text-center tracking-[0.25em] uppercase text-black/40 dark:text-white/30"
                >
                  © {new Date().getFullYear()} Roma Film Production
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}