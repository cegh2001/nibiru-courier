import React from "react";
import { motion } from "framer-motion";
import { TbPlaylistX, TbPencilX } from "react-icons/tb";

export function FormContainer({
  title,
  description,
  children,
  onCancel,
  cancelIcon = "add",
  containerRef,
}) {
  const CancelIcon = cancelIcon === "add" ? TbPlaylistX : TbPencilX;

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }}
    >
      {(title || description) && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {title && (
              <h1 className="text-base font-semibold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-gray-700">{description}</p>
            )}
          </div>
          <div className="flex gap-2 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              title="Cancelar"
              className="block rounded-md bg-red-600 px-1.5 py-1 text-center text-xs font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={onCancel}
            >
              <CancelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4 flow-root">
        <div className="lg:min-h-[430px] xl:min-h-[373px]">
          <div className="inline-block min-w-full py-2 align-middle">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
