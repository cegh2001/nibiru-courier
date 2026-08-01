"use client";

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
import { Loader2 } from "lucide-react";
import { IoEarthOutline } from "react-icons/io5";
import { useData } from "@/hooks/useData";
import { OP_DATA_ROUTES } from "@/services/apis/op-data";
import toast from "react-hot-toast";

/**
 * Modal de creación rápida de País
 *
 * @prop {boolean} isOpen - Estado del modal
 * @prop {Function} onClose - Cerrar modal
 * @prop {Function} onSuccess - Callback con el nuevo país creado
 */
export const QuickCreateCountry = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { createData, isMutating } = useData(OP_DATA_ROUTES.COUNTRIES, {}, false);

  const onSubmit = async (data) => {
    try {
      const result = await createData(data);
      toast.success(`País "${data.name}" creado con éxito`);
      handleClose();
      onSuccess?.(result);
    } catch {
      // apiClient interceptor ya muestra los errores de validación del backend
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <IoEarthOutline className="w-5 h-5" />
            Crear País
          </DialogTitle>
          <DialogDescription>
            Creación rápida de un país.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Nombre *</Label>
            <Input
              {...register("name", { required: "Requerido" })}
              placeholder="Nombre del país"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Abreviación *</Label>
            <Input
              {...register("abbreviation", {
                required: "Requerido",
                maxLength: { value: 5, message: "Máx 5 caracteres" },
              })}
              placeholder="Ej: VEN, COL"
              maxLength={5}
            />
            {errors.abbreviation && (
              <p className="text-xs text-red-500">{errors.abbreviation.message}</p>
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
                "Crear País"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
