"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    // Delay showing the button so it doesn't pop up instantly on page load
    const timer = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Update phone number and message to your preferences
  const phoneNumber = "12149408492"; 
  const message = "Hello Roma Film Production! I am interested in booking a cinematic session.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (pathname.startsWith('/admin')) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-3 sm:gap-4 pointer-events-none">
      
      {/* Advanced Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 15, scale: 0.9, rotateX: -10 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="w-[calc(100vw-2.5rem)] sm:w-80 max-w-[360px] bg-[#121216]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(37,211,102,0.15)] rounded-2xl overflow-hidden pointer-events-auto origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E2321] to-[#121614] p-4 flex items-center gap-3 border-b border-white/5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[#C19B6C]/40 p-1 shrink-0 overflow-hidden relative flex items-center justify-center">
                  <Image src="/image/logo.png" alt="Roma Film Production Logo" fill className="object-contain p-1 mix-blend-screen" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#121216] rounded-full" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm leading-tight">Roma Concierge</h4>
                <p className="text-white/50 text-[10px] font-medium tracking-wide">Typically replies instantly</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Bubble Area */}
            <div className="p-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="bg-[#2A312D] text-white/90 text-[13px] leading-relaxed p-3.5 rounded-2xl rounded-tr-sm shadow-sm inline-block relative border border-white/5"
              >
                Hi there! 👋 Looking for a cinematic wedding film or photo session?
                <span className="absolute bottom-1 right-2 text-[#25D366]">
                  <CheckCheck size={12} />
                </span>
              </motion.div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-black/60 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl font-bold text-[13px] sm:text-sm tracking-wide transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={18} />
                Open in WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Toggle Button */}
      <motion.div className="relative pointer-events-auto">
        {/* Unread Notification Badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full z-20 shadow-lg border-2 border-[#121216]"
            >
              1
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-layered Animated Pulse Rings (Only show if closed) */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-[#25D366]/30 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute inset-[-8px] border border-[#25D366]/20 rounded-full animate-pulse [animation-duration:2s]" />
          </>
        )}

        <motion.button
          onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative flex items-center justify-center w-14 h-14 sm:w-[60px] sm:h-[60px] bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.5)] border border-white/20 z-10 overflow-hidden group focus:outline-none"
        >
          {/* Glass glare effect inside button */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out -skew-x-12" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 drop-shadow-md" />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* SVG WhatsApp Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 drop-shadow-md"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  );
}
