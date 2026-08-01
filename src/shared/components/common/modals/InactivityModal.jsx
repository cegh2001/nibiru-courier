/* Components */
import { TextIconButton } from "@/components/common/buttons/TextIconButton";
import { ModalLayout } from "@/layouts/components/ModalLayout"; // Cambiado a ModalLayout
/* Hooks */
import { useLogoutCountDown } from "@/core/hooks/useLogoutCountdown";
/* Icons */
import { TbExclamationCircle } from "react-icons/tb";

export const InactivityModal = ({ onLogout }) => {
  const { countdown, formattedTime, open, keepSessionActive } =
    useLogoutCountDown(onLogout);

  return (
    <ModalLayout
      isOpen={open}
      closeModal={keepSessionActive}
      handleKeyDown={(e) => {
        if (e.key === "Escape") keepSessionActive();
      }}
      icon={<TbExclamationCircle className="text-orange-500" />}
      title="¡Su sesión va a expirar pronto!"
      titleCenter
    >
      {/* Contenido */}
      <div className="mt-2 mb-4 grid grid-cols-3 gap-2">
        <div className="col-span-3 text-center">
          <p className="block text-navy-dark text-md font-bold">
            ¿Desea mantener su sesión activa?
          </p>
        </div>

        {/* Contador de tiempo */}
        <div className="col-span-3 text-center">
          <p className="block text-sm">
            Tiempo restante:{" "}
            <span
              className={`font-bold ${
                countdown <= 10 ? "text-ruby-light animate-pulse" : "text-navy"
              }`}
            >
              {formattedTime}
            </span>
          </p>
        </div>
      </div>

      {/* Botones de Acciones*/}
      <div className="flex items-center justify-center gap-2 py-2">
        <TextIconButton
          margin="my-2"
          padding="py-1 px-3"
          text="Sí"
          type="button"
          onClick={keepSessionActive}
          bgColor="bg-white"
          bgColorHover="hover:bg-emerald"
          shadowAndColor="shadow-xs shadow-green-600"
          shadowAndColorHover="hover:shadow-md hover:shadow-emerald"
          scale="hover:scale-105"
          textColor="text-emerald"
          textWeight="font-bold"
        />
        <TextIconButton
          margin="my-2"
          padding="py-1 px-2"
          text="No"
          type="button"
          onClick={() => {
            onLogout("manual"); // Cierra la sesión
          }}
          bgColor="bg-white"
          bgColorHover="hover:bg-crimson-light"
          shadowAndColor="shadow-xs shadow-crimson-light"
          shadowAndColorHover="hover:shadow-md hover:shadow-crimson-light"
          scale="hover:scale-105"
          textColor="text-crimson-light"
          textWeight="font-medium"
        />
      </div>
    </ModalLayout>
  );
};