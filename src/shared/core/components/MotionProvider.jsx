'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * MotionProvider - Provider global de LazyMotion
 * 
 * Usa `domAnimation` que carga solo las features básicas (~15KB):
 * - motion.div, motion.span, etc.
 * - AnimatePresence
 * - variants, initial, animate, exit
 * - transition
 * 
 * NO incluye (~35KB extra de `domMax`):  
 * - useAnimate, useMotionValue, useSpring
 * - drag, layout animations
 * - useScroll, useTransform
 * 
 * Componentes que usen features avanzadas (como AccessLoading con useAnimate)
 * deben wrapearse con su propio <LazyMotion features={domMax}>.
 * 
 * @see https://www.framer.com/motion/lazy-motion/
 */
export const MotionProvider = ({ children }) => {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
};
