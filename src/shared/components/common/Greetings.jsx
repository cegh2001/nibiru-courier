/* Hooks */
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";

/* Icons */
import { TbSun, TbMoon, TbSunset2 } from "react-icons/tb";

/* Utils */
import { getGreeting } from "@/shared/utils/helpers";

/* Framer Motion */
import { motion } from "framer-motion";

export const Greetings = ({ hasIcon, isAnimated }) => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState(getGreeting());
  const [reverse, setReverse] = useState(false);

  const mounted = typeof window !== "undefined";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, []);
  
  // Cambia el estado después de 15 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setReverse(true);
    }, 15000); // 15 segundos

    return () => clearTimeout(timer);
  }, []);

  const icon = useMemo(() => {
    const iconsMap = {
      "Buenos días": <TbSun className="w-full h-full" />,
      "Buenas tardes": <TbSunset2 className="w-full h-full" />,
      "Buenas noches": <TbMoon className="w-full h-full" />,
    };
    return iconsMap[greeting] || <TbMoon className="w-full h-full" />;
  }, [greeting]);

  const colorClasses = useMemo(() => {
    const colorsMap = {
      "Buenos días": {
        bg: "bg-yellow-400",
        shadow: "shadow-yellow-400/50",
      },
      "Buenas tardes": {
        bg: "bg-orange-400",
        shadow: "shadow-orange-400/50",
      },
      "Buenas noches": {
        bg: "bg-indigo-400",
        shadow: "shadow-indigo-400/50",
      },
    };
    return colorsMap[greeting] || colorsMap["Buenas noches"];
  }, [greeting]);

  const animatedContent = (isAnimated && mounted) ? createPortal(
    <motion.div
      className={`fixed z-[9] left-0 top-[80px] lg:top-[120px] p-2 lg:p-3 ${colorClasses.bg} rounded-r-xl shadow-lg ${colorClasses.shadow}`}
      initial={{ x: "-100%" }}
      animate={{ x: reverse ? "-100%" : "0%" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="flex flex-col pl-2">
          <div className="text-white font-bold text-sm sm:text-base leading-tight">{greeting}</div>
          <div className="text-white font-medium text-sm sm:text-base truncate max-w-[140px] leading-tight">
            {session?.user?.name || "Usuario"}
          </div>
        </div>
        {hasIcon && (
          <div className="flex items-center text-white mr-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8">
              {icon}
            </div>
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  ) : null;

  return (
    <>
      {animatedContent}
      {!isAnimated && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold">{greeting}</span>
            {hasIcon && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-navy">
                {icon}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};