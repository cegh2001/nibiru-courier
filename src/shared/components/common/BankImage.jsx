import { useState } from "react";
import Image from "next/image";
import { TbBuildingBank } from "react-icons/tb";

/**
 * Componente general para mostrar imágenes de bancos con fallback
 * Utiliza el estilo más elegante y compacto
 */
export const BankImage = ({ 
  bankCode, 
  bankName, 
  size = "sm",
  className = "" 
}) => {
  const [hasError, setHasError] = useState(false);
  const imagePath = `/assets/banks/${bankCode}.png`;

  const handleImageError = () => {
    setHasError(true);
  };

  // Configuraciones de tamaño
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      fallbackPadding: "p-1"
    },
    md: {
      container: "w-10 h-10", 
      icon: "w-5 h-5",
      fallbackPadding: "p-2"
    },
    lg: {
      container: "w-12 h-12",
      icon: "w-6 h-6", 
      fallbackPadding: "p-2"
    }
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  if (hasError) {
    return (
      <div className={`${config.fallbackPadding} bg-navy/5 rounded flex items-center justify-center ${config.container} ${className}`}>
        <TbBuildingBank className={`${config.icon} text-navy`} />
      </div>
    );
  }

  return (
    <div className={`relative ${config.container} rounded overflow-hidden border border-navy/10 bg-gray-50 ${className}`}>
      <Image
        src={imagePath}
        alt={`Logo ${bankName}`}
        fill
        className="object-contain"
        onError={handleImageError}
        sizes={config.container.includes('w-8') ? "32px" : config.container.includes('w-10') ? "40px" : "48px"}
      />
    </div>
  );
};
