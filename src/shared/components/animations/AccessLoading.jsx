/* Animations */
import { LazyMotion, domMax, motion, useAnimate } from "framer-motion";
import { Plane, Cloud } from "lucide-react";

/* Hooks */
import { useEffect, useMemo } from "react";

/**
 * AccessLoading usa useAnimate que requiere domMax.
 * Se wrapea localmente para no cargar domMax en toda la app.
 */
export const AccessLoading = () => {
  return (
    <LazyMotion features={domMax}>
      <AccessLoadingInner />
    </LazyMotion>
  );
};

const AccessLoadingInner = () => {
  const text = "GONAVI";
  const characters = useMemo(() => text.split(""), [text]);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let isMounted = true;

    const animateLoader = async () => {
      const sequence = [];

      // 1. El avión vuela de izquierda a derecha, simulando un vuelo en el cielo
      sequence.push([
        ".plane-wrapper",
        { x: [-60, 200], opacity: [0, 1, 1, 0], y: [20, -20], scale: [0.8, 1.3, 0.9] },
        { duration: 2.5, ease: "easeInOut" },
      ]);

      // 2. Las letras aparecen una a una (de izquierda a derecha) siguiendo la estela
      characters.forEach((_, i) => {
        sequence.push([
          `.letter-${i}`,
          { opacity: [0, 1], y: [15, 0], filter: ["blur(4px)", "blur(0px)"] },
          { duration: 0.4, at: 0.4 + i * 0.18, ease: "easeOut" },
        ]);
      });

      // 3. Pausa breve para leer el texto
      // 4. Las letras desaparecen suavemente subiendo, de izquierda a derecha
      characters.forEach((_, i) => {
        sequence.push([
          `.letter-${i}`,
          { opacity: 0, y: -15, filter: "blur(4px)" },
          { duration: 0.3, at: 3.2 + i * 0.1, ease: "easeIn" },
        ]);
      });

      // 5. Reiniciamos el avión sin animar
      sequence.push([
        ".plane-wrapper",
        { x: -60, opacity: 0, y: 20 },
        { duration: 0.01, at: 4.2 },
      ]);

      if (isMounted) {
        animate(sequence, {
          repeat: Infinity,
        });
      }
    };

    animateLoader();

    return () => {
      isMounted = false;
    };
  }, [animate, characters]);

  return (
    <div ref={scope} className="relative flex h-full min-h-[250px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-linear-to-b from-sky-300 via-sky-200 to-blue-100 p-4 shadow-inner">
      {/* Nubes de fondo animadas */}
      <motion.div
        className="absolute top-[10%] text-white/60"
        style={{ left: "100%" }}
        animate={{ left: "-20%" }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      >
        <Cloud fill="currentColor" className="h-16 w-16 stroke-none" />
      </motion.div>

      <motion.div
        className="absolute top-[25%] text-white/50"
        style={{ left: "100%" }}
        animate={{ left: "-30%" }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear", delay: 9 }}
      >
        <Cloud fill="currentColor" className="h-24 w-24 stroke-none" />
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] text-white/40"
        style={{ left: "100%" }}
        animate={{ left: "-40%" }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear", delay: 2 }}
      >
        <Cloud fill="currentColor" className="h-28 w-28 stroke-none" />
      </motion.div>

      <motion.div
        className="absolute bottom-[35%] text-white/50"
        style={{ left: "100%" }}
        animate={{ left: "-25%" }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 14 }}
      >
        <Cloud fill="currentColor" className="h-14 w-14 stroke-none" />
      </motion.div>

      <motion.div
        className="absolute top-[45%] text-white/40"
        style={{ left: "100%" }}
        animate={{ left: "-15%" }}
        transition={{ repeat: Infinity, duration: 16, ease: "linear", delay: 6 }}
      >
        <Cloud fill="currentColor" className="h-10 w-10 stroke-none" />
      </motion.div>

      <motion.div
        className="absolute bottom-[5%] text-white/30"
        style={{ left: "100%" }}
        animate={{ left: "-20%" }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear", delay: 4 }}
      >
        <Cloud fill="currentColor" className="h-20 w-20 stroke-none" />
      </motion.div>

      {/* Contenido principal z-10 para estar sobre las nubes */}
      <div className="z-10 flex flex-col items-center">
        {/* Icono de Avión */}
        <motion.div className="plane-wrapper text-white opacity-0 drop-shadow-lg">
          <Plane className="h-8 w-8 fill-white stroke-2" />
        </motion.div>

        {/* Texto GONAVI */}
        <div className="mt-4 flex gap-2" aria-label={text}>
          {characters.map((ch, i) => (
            <motion.span
              key={i}
              className={`letter letter-${i} text-2xl font-bold tracking-[0.2em] text-white opacity-0 drop-shadow-md`}
              aria-hidden="true"
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};
