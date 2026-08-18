"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  heading,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className={cn(
        "mb-8 md:mb-12 flex flex-col gap-4 md:gap-5",
        isCenter ? "text-center mx-auto" : "text-left",
        className
      )}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: isCenter ? 0 : -10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className={cn(
            "inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-[#C19B6C]/20 bg-[#C19B6C]/5 backdrop-blur-md shadow-sm",
            isCenter ? "mx-auto self-center" : "self-start"
          )}
        >
          {isCenter && <Sparkles size={12} className="text-[#C19B6C] animate-pulse" />}
          <span className="text-[11px] sm:text-[13px] font-bold tracking-[0.18em] uppercase text-zinc-800 dark:text-zinc-200">
            {eyebrow}
          </span>
          {<Sparkles size={12} className="text-[#C19B6C] animate-pulse" />}
        </motion.div>
      )}

      {/* Heading */}
      <h2 className="h2 text-zinc-900 dark:text-white">
        {heading}
      </h2>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: "80px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className={cn(
          "h-[2px] bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent",
          isCenter ? "mx-auto" : ""
        )}
      />

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={cn(
            "lede",
            isCenter ? "mx-auto" : ""
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
