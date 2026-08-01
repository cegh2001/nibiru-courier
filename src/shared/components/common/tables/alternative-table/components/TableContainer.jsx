import React from "react";
import { TbPlaylistAdd, TbPencil } from "react-icons/tb";

export function TableContainer({
  title,
  description,
  containerRef,
  showAddButton,
  showEditButton,
  isEditing,
  onShowAdd,
  onShowEdit,
}) {
  if (!title && !description && !showAddButton && !showEditButton) {
    return null;
  }

  return (
    <div className="sm:flex sm:items-center" ref={containerRef}>
      <div className="sm:flex-auto">
        {title && (
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        )}
        {description && (
          <p className="mt-1 text-xs text-gray-700">{description}</p>
        )}
      </div>
      
      {(showAddButton || showEditButton) && (
        <div className="flex gap-1 mt-2 sm:ml-8 sm:mt-0 sm:flex-none">
          {showAddButton && (
            <ActionButton
              onClick={onShowAdd}
              disabled={!isEditing}
              title={isEditing ? "Agregar Guía Master" : "Habilite el modo edición para agregar Guía Master"}
              icon={<TbPlaylistAdd className="w-4 h-4" />}
            />
          )}
          {showEditButton && (
            <ActionButton
              onClick={onShowEdit}
              disabled={!isEditing}
              title={isEditing ? "Editar Guía Master" : "Habilite el modo edición para editar Guía Master"}
              icon={<TbPencil className="w-4 h-4" />}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, disabled, title, icon }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={`block rounded px-1 py-1 text-center text-xs font-medium
        text-white shadow-sm focus-visible:outline-2 
        focus-visible:outline-offset-2 transition-colors duration-200
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 cursor-pointer'
        }`}
      onClick={disabled ? undefined : onClick}
    >
      {icon}
    </button>
  );
}
