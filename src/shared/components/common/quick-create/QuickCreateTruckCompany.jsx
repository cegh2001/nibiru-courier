"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { TbTruck } from "react-icons/tb";
import { useData } from "@/hooks/useData";
import { OP_DATA_ROUTES } from "@/services/apis/op-data";
import { IDENTIFICATION_TYPES } from "@/shared/utils/helpers";
import toast from "react-hot-toast";
import {
  normalizeQuickCreateText,
  resolveCreatedEntity,
} from "@/components/common/quick-create/resolveCreatedEntity";

export const QuickCreateTruckCompany = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [selectedType, setSelectedType] = useState("");
  const { createData, isMutating } = useData(OP_DATA_ROUTES.TRUCK_COMPANIES, {}, false);

  const handleClose = () => {
    reset({
      name: "",
      identification: "",
      address: "",
    });
    setSelectedType("");
    onClose();
  };

  const onSubmit = async (data) => {
    const posting = Object.entries({
      name: data.name?.trim(),
      type: selectedType || undefined,
      identification: data.identification?.trim() || undefined,
      address: data.address?.trim() || undefined,
    }).reduce((accumulator, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});

    try {
      const result = await createData(posting);
      const createdCompany = await resolveCreatedEntity({
        endpoint: OP_DATA_ROUTES.TRUCK_COMPANIES,
        result,
        match: (company) => {
          const sameName =
            normalizeQuickCreateText(company?.name) ===
            normalizeQuickCreateText(posting.name);

          if (!sameName) {
            return false;
          }

          const postingIdentification = normalizeQuickCreateText(posting.identification);

          if (!postingIdentification) {
            return true;
          }

          return (
            normalizeQuickCreateText(company?.identification) === postingIdentification
          );
        },
      });

      toast.success(`Compañía de transporte "${posting.name}" creada con éxito`);
      handleClose();
      onSuccess?.(createdCompany);
    } catch {
      // apiClient interceptor ya muestra los errores del backend
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <TbTruck className="w-5 h-5" />
            Crear Compañía de Transporte
          </DialogTitle>
          <DialogDescription>
            Creación rápida de compañía. Al guardar podrá seleccionarla de inmediato.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.stopPropagation();
            handleSubmit(onSubmit)(event);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Nombre *</Label>
            <Input
              {...register("name", { required: "El nombre es requerido" })}
              placeholder="Nombre de la compañía"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {IDENTIFICATION_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">
                Identificación
              </Label>
              <Input
                {...register("identification")}
                placeholder="Número de identificación"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Dirección</Label>
            <Input
              {...register("address")}
              placeholder="Dirección de la compañía"
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
              disabled={isMutating || !isValid}
            >
              {isMutating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Compañía"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};