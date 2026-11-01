"use client";
import { motion, useReducedMotion } from "framer-motion";

export function Apparition({
  children,
  delai = 0,
  className,
}: {
  children: React.ReactNode;
  delai?: number;
  className?: string;
}) {
  const reduit = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduit ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delai, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}