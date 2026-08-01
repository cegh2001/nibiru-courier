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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { TbUser } from "react-icons/tb";
import { useData } from "@/hooks/useData";
import { OP_DATA_ROUTES } from "@/services/apis/op-data";
import { MyCombobox } from "@/components/common/combobox/MyCombobox";
import { QuickCreateButton } from "@/components/common/quick-create/QuickCreateButton";
import { QuickCreateTruckCompany } from "@/components/common/quick-create/QuickCreateTruckCompany";
import { IDENTIFICATION_TYPES } from "@/shared/utils/helpers";
import {
  normalizeQuickCreateText,
  resolveCreatedEntity,
} from "@/components/common/quick-create/resolveCreatedEntity";
import toast from "react-hot-toast";

/**
 * Modal de creación rápida de Conductor
 *
 * @prop {boolean} isOpen - Estado del modal
 * @prop {Function} onClose - Cerrar modal
 * @prop {Function} onSuccess - Callback con el nuevo conductor creado
 */
export const QuickCreateTruckDriver = ({ isOpen, onClose, onSuccess }) => {
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { createData, isMutating } = useData(OP_DATA_ROUTES.TRUCK_DRIVERS, {}, false);
  const { data: companies, mutate: mutateCompanies } = useData(OP_DATA_ROUTES.TRUCK_COMPANIES);

  const [selectedCompanyId, selectedType] = useWatch({
    control,
    name: ["truck_company_id", "type"],
  });

  const onSubmit = async (data) => {
    const posting = {
      name: data.name?.trim(),
      last_name: data.last_name?.trim(),
      type: data.type,
      identification: data.identification?.trim(),
      truck_company_id: Number(data.truck_company_id),
    };

    try {
      const result = await createData(posting);
      const createdDriver = await resolveCreatedEntity({
        endpoint: OP_DATA_ROUTES.TRUCK_DRIVERS,
        result,
        match: (driver) => (
          normalizeQuickCreateText(driver?.name) === normalizeQuickCreateText(posting.name) &&
          normalizeQuickCreateText(driver?.last_name) === normalizeQuickCreateText(posting.last_name) &&
          normalizeQuickCreateText(driver?.type) === normalizeQuickCreateText(posting.type) &&
          normalizeQuickCreateText(driver?.identification) === normalizeQuickCreateText(posting.identification) &&
          Number(driver?.truck_company_id ?? driver?.truck_company?.id ?? 0) ===
            posting.truck_company_id
        ),
      });

      toast.success(`Conductor "${posting.name} ${posting.last_name}" creado con éxito`);
      handleClose();
      onSuccess?.(createdDriver);
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <TbUser className="w-5 h-5" />
            Crear Conductor
          </DialogTitle>
          <DialogDescription>
            Creación rápida de conductor. Puede completar más datos desde el
            módulo de datos operativos.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Nombre *</Label>
              <Input
                {...register("name", { required: "El nombre es requerido" })}
                placeholder="Nombre"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">
                Apellido *
              </Label>
              <Input
                {...register("last_name", {
                  required: "El apellido es requerido",
                })}
                placeholder="Apellido"
              />
              {errors.last_name && (
                <p className="text-xs text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Tipo de Identificación e Identificación */}
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Tipo *</Label>
              <MyCombobox
                items={IDENTIFICATION_TYPES}
                selectedItem={
                  IDENTIFICATION_TYPES.find((t) => t.id === selectedType) ||
                  null
                }
                onChange={(item) => {
                  setValue("type", item?.id || "", { shouldValidate: true });
                }}
                getItemKey={(item) => item.id}
                getItemLabel={(item) => item.name}
                placeholder="Tipo"
                searchPlaceholder="Buscar..."
                emptyMessage="Sin resultados"
                useShadcnStyles
              />
              <input
                type="hidden"
                {...register("type", { required: "Requerido" })}
              />
              {errors.type && (
                <p className="text-xs text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">
                Identificación *
              </Label>
              <Input
                {...register("identification", {
                  required: "La identificación es requerida",
                })}
                placeholder="Número de identificación"
              />
              {errors.identification && (
                <p className="text-xs text-red-500">
                  {errors.identification.message}
                </p>
              )}
            </div>
          </div>

          {/* Compañía de transporte */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">
              Compañía de Transporte *
            </Label>
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
                "Crear Conductor"
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
