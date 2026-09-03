import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      id="scroll-progress-bar"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-neutral-400 via-white to-neutral-300 origin-left z-50 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      aria-hidden="true"
    />
  );
};
