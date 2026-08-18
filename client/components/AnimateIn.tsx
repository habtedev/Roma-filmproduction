"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

const createVariants = (delay: number, shouldReduceMotion: boolean): Variants => {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.4, delay },
      },
    };
  }

  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

export default function AnimateIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      variants={createVariants(delay, shouldReduceMotion)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
