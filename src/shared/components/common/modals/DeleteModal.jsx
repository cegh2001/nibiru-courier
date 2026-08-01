/* Components */
import { ModalLayout } from "@/layouts/components/ModalLayout";

export const DeleteModal = ({
  handleDestroy,
  item,
  icon,
  identifier = "name",
  isOpen,
  closeModal,
  type,
  title = `Eliminar ${type}`,
  message = "Estás seguro que quieres eliminar a ",
}) => {
  /* Evento para evitar la tecla Enter */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // Validación defensiva: si no hay item, no renderizar el modal
  if (!item) {
    return null;
  }

  // Obtener el valor del identificador de forma segura
  const identifierValue = item[identifier] || "este elemento";

  return (
    <ModalLayout
      isOpen={isOpen}
      item={item}
      title={`${title} ${identifierValue}`}
      closeModal={closeModal}
      handleKeyDown={handleKeyDown}
      icon={icon}
    >
      <div className="my-6 flex flex-wrap gap-1">
        <p className="text-md text-navy">{message}</p>
        <span className="text-crimson-light">{identifierValue}</span>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="inline-flex justify-center rounded-lg border border-transparent py-2 px-2.5 text-sm font-medium shadow-xs shadow-crimson hover:shadow-md hover:shadow-crimson-light bg-white hover:bg-crimson-light text-crimson hover:text-white hover:scale-105 duration-300"
          onClick={() => {
            closeModal();
            handleDestroy(item);
          }}
        >
          Confirmar
        </button>
        <button
          className="inline-flex justify-center rounded-lg border border-transparent py-2 px-2.5 text-sm font-medium shadow-xs shadow-navy-light hover:shadow-md hover:shadow-navy-light bg-white hover:bg-navy-light text-navy hover:text-white hover:scale-105 duration-300"
          onClick={closeModal}
        >
          Cancelar
        </button>
      </div>
    </ModalLayout>
  );
};
