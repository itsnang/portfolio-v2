"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  UseInViewOptions,
  Variants,
} from "framer-motion";
import { useRef } from "react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
}

export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.6,
  delay = 0,
  yOffset = 20,
  inView = false,
  inViewMargin = "-100px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: {
      y: yOffset,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: delay,
          duration,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
          type: "tween",
        }}
        className={className}
        style={{ background: "transparent" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
