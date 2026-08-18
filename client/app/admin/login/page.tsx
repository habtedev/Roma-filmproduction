"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login API Response:", data);

      if (data.success) {
        console.log("Success! Attempting to router.push to /admin...");
        router.push("/admin");
        console.log("router.push called!");
      } else {
        console.error("Login failed:", data.error);
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(`Network/Config Error: ${err.message}. (Did Vercel finish redeploying with the new API URL?)`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-24 md:py-32 px-4 relative">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C19B6C]/20 dark:bg-[#C19B6C]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 glass-card rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-[#121217]/80 backdrop-blur-xl"
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
             <Image src="/image/logo.png" alt="Logo" fill className="object-contain opacity-90 dark:invert-0 invert" />
          </div>
          <h1 className="text-3xl font-display font-light text-black dark:text-white mb-2 tracking-wide">
            Atelier <span className="text-[#C19B6C]">Portal</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono tracking-widest uppercase">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-[#C19B6C] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/5 focus:border-[#C19B6C]/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-all focus:ring-4 ring-[#C19B6C]/10"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-[#C19B6C] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/5 focus:border-[#C19B6C]/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-all focus:ring-4 ring-[#C19B6C]/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#C19B6C] to-[#a07c50] hover:from-[#d4b488] hover:to-[#C19B6C] text-white dark:text-black font-semibold rounded-2xl py-4 mt-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-[#C19B6C]/20"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
            Roma Film Production &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
