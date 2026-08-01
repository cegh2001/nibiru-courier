import React from 'react';
import {
  MdOutlineKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown,
} from 'react-icons/md';

export const Footer = ({
  isExpanded,
  isModificable,
  setIsExpanded,
  itemsPerPage,
  availableOptionsLength,
  currentPage,
  totalPages,
  handleExpand,
  handlePageChange,
}) => {
  return (
    <>
      {isExpanded ? (
        <div className="flex items-center justify-center gap-2 py-2 bg-blue-50 rounded-b-3xl shadow-xs shadow-navy-light">
          <button
            onClick={() => handleExpand(-5)}
            disabled={itemsPerPage <= 10}
            className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
            type="button"
            aria-label="Reducir elementos por página"
          >
            <MdOutlineKeyboardDoubleArrowUp />
          </button>
          <button
            onClick={() => handleExpand(5)}
            disabled={itemsPerPage >= availableOptionsLength}
            className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
            type="button"
            aria-label="Aumentar elementos por página"
          >
            <MdKeyboardDoubleArrowDown />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-around h-8 py-1.5 bg-blue-50 rounded-b-3xl shadow-xs shadow-navy-light">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
            type="button"
            aria-label="Página anterior"
          >
            Ant.
          </button>
          <span className="flex items-center justify-center text-xs text-navy">
            Pág. {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
            type="button"
            aria-label="Página siguiente"
          >
            Sig.
          </button>
        </div>
      )}
      {/* Botones externos */}
      {isModificable ? <div className="flex justify-between mt-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
          type="button"
          aria-label="Expandir"
        >
          Expandible
        </button>
        <button
          onClick={() => setIsExpanded(false)}
          className="flex items-center px-2 text-xs text-navy bg-white border rounded-full shadow-xs shadow-navy-light hover:scale-105 duration-300 disabled:opacity-50"
          type="button"
          aria-label="Paginado"
        >
          Paginado
        </button>
      </div> : null}
    </>
  );
};