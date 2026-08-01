/* Components */
import { TableHeader } from "./TableHeader";
import { DeleteModal } from "@/components/common/modals/DeleteModal";
import { PaginationButtons } from "@/components/common/tables/standard-table/PaginationButtons";

/* Hooks */
import { useState } from "react";

/* Icons */
import { RiEmotionSadLine } from "react-icons/ri";

export const Table = ({
  dataLength,
  data,
  handleDestroy,
  handleUpdate,
  columns,
  icon,
  type,
  CustomEditModal,
  CustomDeleteModal = DeleteModal,
  CustomShowModal,
  BodyTable,
  setButtonStates,
  setPreSelected,
  isRoles,
  loading,
  refreshData,
  pagination,
  goToUrl,
  extraButtons = [],
  deleteModalProps = {},
  showModalProps = {},
  // Nueva prop para búsqueda y filtros
  searchAndFilters = null,
}) => {
  const [editingId, setEditingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [viewingId, setViewingId] = useState("");
  let [isOpen, setIsOpen] = useState(true);
  let [confirm, setConfirm] = useState(true);
  let [view, setView] = useState(true);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const closeConfirm = () => setConfirm(false);
  const openConfirm = () => setConfirm(true);
  const closeView = () => setView(false);
  const openView = () => setView(true);

  // Funciones helper para encontrar items de forma segura
  const findItemById = (id) => data?.find((item) => item.id === id) || null;

  return (
    <div className="flex flex-col my-4 min-w-0 overflow-hidden">
        {/* Barra de búsqueda y filtros opcional */}
        {searchAndFilters && (
          <div className="mb-4">
            {searchAndFilters}
          </div>
        )}

        <div className="rounded-lg shadow-center-lg shadow-navy-lighter overflow-hidden relative">
            <table className="relative w-full min-w-[600px]">
              <thead className="absolute -z-10 top-0 w-full h-10 bg-navy"></thead>
              <TableHeader columns={columns} />
              <tbody className="bg-white">
              {loading && dataLength === 0 ? (
                <tr className="text-navy-dark text-md font-semibold">
                  <td className="px-4 py-3" colSpan="10">
                    <div className="flex items-center justify-center">
                      Cargando registros...
                    </div>
                  </td>
                </tr>
              ) : dataLength === 0 ? (
                <tr className="font-semibold text-navy-dark text-md">
                  <td className="px-4 py-3" colSpan="10">
                    <div className="flex items-center justify-center">
                      No hay registros para mostrar
                      <RiEmotionSadLine className="w-6 h-6 ml-2" />
                    </div>
                  </td>
                </tr>
              ) : (
                <BodyTable
                  data={data}
                  setEditingId={setEditingId}
                  openModal={openModal}
                  setDeletingId={setDeletingId}
                  openConfirm={openConfirm}
                  setViewingId={setViewingId}
                  openView={openView}
                  isRoles={isRoles}
                  setButtonStates={setButtonStates}
                  setPreSelected={setPreSelected}
                  extraButtons={extraButtons}
                />
              )}
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <td className="pb-1.5" colSpan="10">
                  <PaginationButtons
                    pagination={pagination}
                    goToUrl={goToUrl}
                  />
                </td>
              </tr>
            </tfoot>
            </table>
        </div>

        {editingId && (
          <CustomEditModal
            item={findItemById(editingId)}
            handleUpdate={handleUpdate}
            isOpen={isOpen}
            closeModal={closeModal}
            data={data}
            loading={loading}
            refreshData={refreshData}
            icon={icon}
            type={type}
          />
        )}

        {deletingId && (
          <CustomDeleteModal
            isOpen={confirm}
            closeModal={closeConfirm}
            handleDestroy={handleDestroy}
            item={findItemById(deletingId)}
            data={data}
            loading={loading}
            refreshData={refreshData}
            type={type}
            {...deleteModalProps}
          />
        )}

        {viewingId && (
          <CustomShowModal
            isOpen={view}
            closeModal={closeView}
            item={findItemById(viewingId)}
            {...showModalProps}
          />
        )}
      </div>
  );
};
