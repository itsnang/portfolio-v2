"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "motion/react";

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-1000 h-1 origin-left bg-linear-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%",
        className
      )}
      style={{
        scaleX,
      }}
    />
  );
}
