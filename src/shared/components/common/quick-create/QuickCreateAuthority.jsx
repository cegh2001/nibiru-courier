"use client";

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
import { TbShield } from "react-icons/tb";
import { useData } from "@/hooks/useData";
import { OP_DATA_ROUTES } from "@/services/apis/op-data";
import { IDENTIFICATION_TYPES } from "@/shared/utils/helpers";
import { MyCombobox } from "@/components/common/combobox/MyCombobox";
import { useState } from "react";
import toast from "react-hot-toast";

const resolveAuthorityTypeUnit = (authorityType) => authorityType?.unit ?? authorityType?.units ?? null;
const getAuthorityTypeUnitLabel = (authorityType) => {
  const unit = resolveAuthorityTypeUnit(authorityType);
  if (!unit) return "";
  return typeof unit === "string" ? unit : (unit.name || "");
};

/**
 * Modal de creación rápida de Autoridad.
 * Campos: nombre, tipo identificación, identificación, tipo de autoridad.
 *
 * @prop {boolean} isOpen - Estado del modal
 * @prop {Function} onClose - Cerrar modal
 * @prop {Function} onSuccess - Callback con la nueva autoridad creada
 */
export const QuickCreateAuthority = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { createData, isMutating } = useData(
    OP_DATA_ROUTES.AUTHORITIES,
    {},
    false
  );
  const { data: authorityTypes } = useData(OP_DATA_ROUTES.AUTHORITIES_TYPES);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedAuthorityType, setSelectedAuthorityType] = useState(null);
  const selectedAuthorityTypeUnit = resolveAuthorityTypeUnit(selectedAuthorityType);

  const [nameValue, identificationValue] = useWatch({
    control,
    name: ["name", "identification"],
  });

  const isFormValid =
    nameValue &&
    identificationValue &&
    !errors.name &&
    !errors.identification &&
    selectedType &&
    selectedAuthorityType;

  const onSubmit = async (data) => {
    const posting = {
      ...data,
      type: selectedType.id,
      authority_type_id: selectedAuthorityType.id,
    };

    try {
      const result = await createData(posting);

      const authorityTypeSource = result?.authority_type ?? selectedAuthorityType ?? null;
      const normalizedAuthorityType = typeof authorityTypeSource === "string"
        ? { name: authorityTypeSource }
        : authorityTypeSource;

      const unitSource = result?.units ?? result?.unit ?? selectedAuthorityTypeUnit ?? null;
      const normalizedUnit = typeof unitSource === "string"
        ? { name: unitSource }
        : unitSource;

      const normalizedAuthority = {
        ...result,
        name: result?.name ?? data.name,
        type: result?.type ?? selectedType?.id,
        identification: result?.identification ?? data.identification,
        authority_type_id: result?.authority_type_id ?? selectedAuthorityType?.id,
        authority_type: normalizedAuthorityType,
        unit: result?.unit ?? normalizedUnit,
        units: normalizedUnit,
      };

      toast.success(`Autoridad "${data.name}" creada con éxito`);
      handleClose();
      onSuccess?.(normalizedAuthority);
    } catch {
      // apiClient interceptor ya muestra errores del backend
    }
  };

  const handleClose = () => {
    reset();
    setSelectedType(null);
    setSelectedAuthorityType(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <TbShield className="w-5 h-5" />
            Crear Autoridad
          </DialogTitle>
          <DialogDescription>
            Creación rápida de autoridad para la inspección AVSEC.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Nombre *</Label>
            <Input
              {...register("name", { required: "Requerido" })}
              placeholder="Nombre de la autoridad"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <Separator />

          {/* Tipo de identificación + Número */}
          <div className="grid grid-cols-[140px_1fr] gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">
                Tipo ID *
              </Label>
              <MyCombobox
                items={IDENTIFICATION_TYPES}
                selectedItem={selectedType}
                onChange={setSelectedType}
                getItemKey={(item) => item.id}
                getItemLabel={(item) => item.name}
                placeholder="V, E, J..."
                searchPlaceholder="Buscar..."
                emptyMessage="Sin resultados"
                useShadcnStyles 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">
                Identificación *
              </Label>
              <Input
                {...register("identification", { required: "Requerido" })}
                placeholder="Número de identificación"
              />
              {errors.identification && (
                <p className="text-xs text-red-500">
                  {errors.identification.message}
                </p>
              )}
            </div>
          </div>

          {/* Tipo de autoridad */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">
              Cargo de Autoridad *
            </Label>
            <MyCombobox
              items={authorityTypes || []}
              selectedItem={selectedAuthorityType}
              onChange={setSelectedAuthorityType}
              getItemKey={(item) => item.id}
              getItemLabel={(item) => item.name}
              renderItemContent={(item) => {
                const unitLabel = getAuthorityTypeUnitLabel(item);
                return (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{item.name}</span>
                    {unitLabel ? (
                      <span className="text-xs text-muted-foreground shrink-0">
                        · {unitLabel}
                      </span>
                    ) : null}
                  </div>
                );
              }}
              placeholder="Seleccione cargo de autoridad"
              searchPlaceholder="Buscar cargo..."
              emptyMessage="No se encontraron cargos"
              useShadcnStyles
            />
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
              disabled={isMutating || !isFormValid}
            >
              {isMutating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Autoridad"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
