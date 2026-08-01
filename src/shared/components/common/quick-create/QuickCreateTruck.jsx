"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { TbTruck } from "react-icons/tb";
import { useData } from "@/hooks/useData";
import { OP_DATA_ROUTES } from "@/services/apis/op-data";
import { MyCombobox } from "@/components/common/combobox/MyCombobox";
import { QuickCreateButton } from "@/components/common/quick-create/QuickCreateButton";
import { QuickCreateTruckCompany } from "@/components/common/quick-create/QuickCreateTruckCompany";
import {
  normalizeQuickCreateText,
  resolveCreatedEntity,
} from "@/components/common/quick-create/resolveCreatedEntity";
import toast from "react-hot-toast";

/**
 * Modal de creación rápida de Camión
 *
 * @prop {boolean} isOpen - Estado del modal
 * @prop {Function} onClose - Cerrar modal
 * @prop {Function} onSuccess - Callback con el nuevo camión creado
 */
export const QuickCreateTruck = ({ isOpen, onClose, onSuccess }) => {
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { createData, isMutating } = useData(OP_DATA_ROUTES.TRUCKS, {}, false);
  const { data: companies, mutate: mutateCompanies } = useData(OP_DATA_ROUTES.TRUCK_COMPANIES);

  const selectedCompanyId = useWatch({ control, name: "truck_company_id" });

  const onSubmit = async (data) => {
    const posting = {
      register: data.register?.trim(),
      truck_company_id: Number(data.truck_company_id),
    };

    try {
      const result = await createData(posting);
      const createdTruck = await resolveCreatedEntity({
        endpoint: OP_DATA_ROUTES.TRUCKS,
        result,
        match: (truck) => (
          normalizeQuickCreateText(truck?.register) ===
            normalizeQuickCreateText(posting.register) &&
          Number(truck?.truck_company_id ?? truck?.truck_company?.id ?? 0) ===
            posting.truck_company_id
        ),
      });

      toast.success(`Camión "${posting.register}" creado con éxito`);
      handleClose();
      onSuccess?.(createdTruck);
    } catch {
      // apiClient interceptor ya muestra los errores
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <TbTruck className="w-5 h-5" />
            Crear Camión
          </DialogTitle>
          <DialogDescription>
            Creación rápida de camión. Puede completar más datos desde el módulo
            de datos operativos.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/* Placa / Registro */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Placa / Registro *</Label>
            <Input
              {...register("register", { required: "La placa es requerida" })}
              placeholder="Ej: ABC-123"
            />
            {errors.register && (
              <p className="text-xs text-red-500">{errors.register.message}</p>
            )}
          </div>

          {/* Compañía de transporte */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Compañía de Transporte *</Label>
            <MyCombobox
              items={companies || []}
              selectedItem={
                companies?.find((company) => String(company.id) === String(selectedCompanyId)) || null
              }
              onChange={(item) => {
                setValue("truck_company_id", item?.id || null, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              getItemKey={(item) => item.id}
              getItemLabel={(item) => item.name}
              placeholder="Seleccionar compañía"
              searchPlaceholder="Buscar compañía..."
              emptyMessage="No se encontraron compañías"
              useShadcnStyles
              shortcut={
                <QuickCreateButton onClick={() => setShowCreateCompany(true)}>
                  Crear compañía de transporte
                </QuickCreateButton>
              }
            />
            <input
              type="hidden"
              {...register("truck_company_id", {
                required: "La compañía es requerida",
                valueAsNumber: true,
              })}
            />
            {errors.truck_company_id && (
              <p className="text-xs text-red-500">
                {errors.truck_company_id.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isMutating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white"
              disabled={isMutating || !isValid}
            >
              {isMutating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Camión"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <QuickCreateTruckCompany
        isOpen={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
        onSuccess={(newCompany) => {
          mutateCompanies?.();
          setValue("truck_company_id", newCompany?.id ?? null, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />
    </Dialog>
  );
};
