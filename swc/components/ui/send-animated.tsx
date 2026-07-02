"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

export interface SendAnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SendAnimatedIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SEND_VARIANTS: Variants = {
  normal: {
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  animate: {
    x: [0, 5, 0],
    y: [0, -5, 0],
    rotate: [0, 9, 0],
    transition: { duration: 0.65, ease: "easeInOut" },
  },
};

const LINE_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    pathLength: [1, 0.35, 1],
    opacity: [1, 0.6, 1],
    transition: { duration: 0.65, ease: "easeInOut" },
  },
};

const SendAnimatedIcon = forwardRef<SendAnimatedIconHandle, SendAnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 24, ...props }, ref) => {
    const controls = useAnimation();

    const startAnimation = useCallback(() => {
      controls.start("animate");
    }, [controls]);

    const stopAnimation = useCallback(() => {
      controls.start("normal");
    }, [controls]);

    useImperativeHandle(ref, () => ({
      startAnimation,
      stopAnimation,
    }));

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={(event) => {
          startAnimation();
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          stopAnimation();
          onMouseLeave?.(event);
        }}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={controls}
          initial="normal"
        >
          <motion.g variants={SEND_VARIANTS}>
            <path d="M3.5 11.5 21 3 16.2 21 11.3 13.3 3.5 11.5Z" />
            <motion.path d="M11.3 13.3 21 3" variants={LINE_VARIANTS} />
          </motion.g>
        </motion.svg>
      </div>
    );
  },
);

SendAnimatedIcon.displayName = "SendAnimatedIcon";

export { SendAnimatedIcon };
