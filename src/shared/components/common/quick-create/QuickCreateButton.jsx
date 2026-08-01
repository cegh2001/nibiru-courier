import { TbPlus } from "react-icons/tb";

/**
 * Botón para usar dentro del slot `shortcut` de MyCombobox
 * Abre un modal de creación rápida en vez de navegar a otra página
 *
 * @prop {Function} onClick - Handler para abrir el modal
 * @prop {ReactNode} children - Texto del botón
 */
export const QuickCreateButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className="relative w-full select-none rounded-sm py-1.5 px-2 text-sm outline-hidden"
    >
      <span className="flex justify-between items-center w-full text-sm hover:text-green-600 duration-150">
        {children} <TbPlus className="text-green-500" size={18} />
      </span>
    </button>
  );
};
