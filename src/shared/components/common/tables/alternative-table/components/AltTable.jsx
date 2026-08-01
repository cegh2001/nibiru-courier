import React from "react";
import { TableContainer } from "./TableContainer";
import { TableContent } from "./TableContent";
import { FormContainer } from "./FormContainer";
import { useTableState } from "../hooks/useTableState";

export function AltTable({
  title = "",
  description = "",
  margin = "mt-16",
  showAddButton = false,
  showEditButton = false,

  // Forms
  addForm: AddForm = null,
  editForm: EditForm = null,
  addFormTitle = "Agregar elemento",
  addFormDescription = "Registre un nuevo elemento.",
  editFormTitle = "Modificar elemento", 
  editFormDescription = "Actualice la información del elemento seleccionado.",

  // Table content - NUEVO: props específicas para contenido personalizado
  customHeader = null, // Componente para el <thead>
  customBody = null,   // Componente para el <tbody>
  children, // Mantenemos children como fallback para compatibilidad
  data = [],
  columns = [],
  loading = false,

  // Edit mode
  isEditing = false,
  shortcutEdit = false,

  // Callbacks
  onStateChange = () => {},

  // Refs
  tableRef = null,
}) {
  const {
    currentView,
    containerRef,
    handleShowAdd,
    handleShowEdit,
    handleCancel,
  } = useTableState({
    shortcutEdit,
    isEditing,
    onStateChange,
  });

  const commonProps = {
    title,
    description,
    containerRef: containerRef || tableRef,
    isEditing,
    onCancel: handleCancel,
  };

  return (
    <div className={margin}>
      {currentView === "table" && (
        <>
          <TableContainer
            {...commonProps}
            showAddButton={showAddButton}
            showEditButton={showEditButton}
            onShowAdd={handleShowAdd}
            onShowEdit={handleShowEdit}
          />
          <TableContent 
            data={data} 
            columns={columns} 
            loading={loading}
            customHeader={customHeader}
            customBody={customBody}
          >
            {children}
          </TableContent>
        </>
      )}

      {currentView === "add" && AddForm && (
        <FormContainer
          {...commonProps}
          title={addFormTitle}
          description={addFormDescription}
          cancelIcon="add"
        >
          <AddForm onCancel={handleCancel} />
        </FormContainer>
      )}

      {currentView === "edit" && EditForm && (
        <FormContainer
          {...commonProps}
          title={editFormTitle}
          description={editFormDescription}
          cancelIcon="edit"
        >
          <EditForm onCancel={handleCancel} />
        </FormContainer>
      )}
    </div>
  );
}
