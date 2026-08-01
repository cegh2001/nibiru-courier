import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * useInViewAnimation - Pausa/reanuda animaciones basado en visibilidad del viewport.
 * 
 * Usa IntersectionObserver para detectar si un elemento está visible.
 * Cuando no es visible, las animaciones se pausan para ahorrar CPU/GPU.
 * 
 * @param {Object} options
 * @param {number} [options.threshold=0.1] - Porcentaje mínimo visible para activar (0-1)
 * @param {string} [options.rootMargin='50px'] - Margen extra (pre-carga antes de ser visible)
 * @param {boolean} [options.once=false] - Si true, solo anima una vez y se detiene
 * @param {boolean} [options.freezeOnceHidden=false] - Si true, mantiene último frame al salir del viewport
 * 
 * @returns {{ ref: React.RefObject, isInView: boolean, animationState: string }}
 * 
 * @example
 * // Uso básico
 * const { ref, isInView } = useInViewAnimation();
 * 
 * return (
 *   <div ref={ref} style={{ animationPlayState: isInView ? 'running' : 'paused' }}>
 *     <AnimatedComponent />
 *   </div>
 * );
 * 
 * @example
 * // Con Framer Motion
 * const { ref, animationState } = useInViewAnimation();
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial="hidden"
 *     animate={animationState}
 *     variants={myVariants}
 *   />
 * );
 */
export function useInViewAnimation({
  threshold = 0.1,
  rootMargin = '50px',
  once = false,
  freezeOnceHidden = false,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );
  const hasBeenVisible = useRef(false);

  const handleIntersection = useCallback(([entry]) => {
    const visible = entry.isIntersecting;
    
    if (once && hasBeenVisible.current) {
      return; // Ya se animó una vez, no volver a animar
    }

    if (visible) {
      hasBeenVisible.current = true;
      setIsInView(true);
    } else if (!freezeOnceHidden) {
      setIsInView(false);
    }
  }, [once, freezeOnceHidden]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Verificar soporte de IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  // animationState para uso directo con Framer Motion variants
  const animationState = isInView ? 'show' : 'hidden';

  return {
    ref,
    isInView,
    animationState,
    // Utilidad CSS directa
    playState: isInView ? 'running' : 'paused',
  };
}
