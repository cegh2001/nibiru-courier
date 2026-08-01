import React, { Fragment, useRef, useCallback } from "react";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { IoIosClose } from "react-icons/io";

export const ModalLayout = ({
  children,
  closeModal,
  handleKeyDown,
  icon,
  isOpen,
  item,
  title,
  titleCenter,
  preventAutoClose = false, // Nueva prop para prevenir cierre automático
}) => {
  const preventCloseRef = useRef(false);

  // Handler personalizado para el cierre
  const handleClose = useCallback(() => {
    // Solo cerrar si no está prevenido
    if (!preventCloseRef.current && !preventAutoClose) {
      closeModal();
    }
  }, [closeModal, preventAutoClose]);

  // Función para permitir/prevenir el cierre temporalmente
  const setPreventClose = useCallback((prevent) => {
    preventCloseRef.current = prevent;
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleClose}
        onKeyDown={handleKeyDown}
      >
        {/* Fondo semitransparente */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        {/* Contenedor del modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Encabezado con fondo de color */}
                <div className="relative bg-navy-dark p-4 rounded-t-lg border-b border-navy-lighter/20">
                  <button
                    type="button"
                    className="absolute top-2.5 right-2.5 text-white/70 rounded-md hover:text-white hover:bg-crimson/20 p-0.5 transition-all duration-200"
                    onClick={closeModal} // El botón X siempre puede cerrar
                  >
                    <IoIosClose className="w-6 h-6" />
                  </button>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    <div
                      className={`flex items-center ${
                        titleCenter ? "justify-center" : ""
                      } gap-2 font-bold`}
                    >
                      {icon}
                      {title}
                      
                    </div>
                  </DialogTitle>
                </div>

                {/* Contenido del modal con contexto para controlar cierre */}
                <div 
                  className="px-6 pb-6"
                  data-modal-content="true"
                  onFocusCapture={(e) => {
                    // Detectar si el foco está en un select dropdown
                    const target = e.target;
                    if (target && (
                      target.getAttribute('role') === 'combobox' ||
                      target.closest('[role="combobox"]') ||
                      target.closest('[data-radix-select-trigger]') ||
                      target.closest('[data-radix-select-content]')
                    )) {
                      preventCloseRef.current = true;
                      // Resetear después de un breve delay
                      setTimeout(() => {
                        preventCloseRef.current = false;
                      }, 300);
                    }
                  }}
                >
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
