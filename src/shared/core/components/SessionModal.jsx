// Components
import { ModalLayout } from "@/layouts/components/ModalLayout";
import { TextIconButton } from "@/components/common/buttons/TextIconButton";
// Hooks
import { useSessionDecision } from "@/core/hooks/useSessionDecision";
// Icons
import { TbExclamationCircle } from "react-icons/tb";

export const SessionModal = ({
  isOpen,
}) => {
  const { handleRestore, handleHome } = useSessionDecision();
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={handleHome}
      icon={<TbExclamationCircle className="text-orange-500" />}
      title="¿Qué desea hacer?"
      titleCenter
    >
      <div className="my-4 text-center">
        <p className="text-navy-dark text-md font-bold">
          ¿Desea restaurar su sesión
        </p>
        <p className="text-navy-dark text-md font-bold">o ir a inicio?</p>
      </div>
      <div className="flex items-center justify-center gap-2 py-2">
        <TextIconButton
          margin="my-2"
          padding="py-1 px-3"
          text="Restaurar"
          type="button"
          onClick={handleRestore}
          bgColor="bg-white"
          bgColorHover="hover:bg-emerald"
          shadowAndColor="shadow-xs shadow-green-600"
          shadowAndColorHover="hover:shadow-md hover:shadow-emerald"
          scale="hover:scale-105"
          textColor="text-emerald"
          textWeight="font-bold"
        />
        <TextIconButton
          margin="my-"
          padding="py-1 px-2"
          text="Inicio"
          type="button"
          onClick={handleHome}
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