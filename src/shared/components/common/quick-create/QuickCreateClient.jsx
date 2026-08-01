"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { TbUserDollar, TbReceipt2 } from "react-icons/tb";
import { useData } from "@/hooks/useData";
import { BROKERS_ROUTES } from "@/services/apis/brokers";
import { FINANCE_ROUTES } from "@/services/apis/finance";
import toast from "react-hot-toast";

const IDENTIFICATION_TYPES = [
  { id: "V", name: "V" },
  { id: "E", name: "E" },
  { id: "J", name: "J" },
  { id: "G", name: "G" },
  { id: "P", name: "P" },
];

const IVA_FIXED_RATE = 16;

const isIvaTax = (taxName) => {
  return taxName?.toLowerCase().includes("iva");
};

/**
 * Modal de creación rápida de Cliente
 * Se usa dentro de comboboxes para crear sin salir del formulario actual
 * Incluye configuración de impuestos (IVA e ISLR)
 *
 * @prop {boolean} isOpen - Estado del modal
 * @prop {Function} onClose - Cerrar modal
 * @prop {Function} onSuccess - Callback con el nuevo cliente creado (para seleccionar en el combobox)
 */
export const QuickCreateClient = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [selectedType, setSelectedType] = useState("");
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [taxesInitialized, setTaxesInitialized] = useState(false);

  const { createData, isMutating } = useData(BROKERS_ROUTES.CLIENTS, {}, false);
  const { data: taxesData, isLoading: taxesLoading } = useData(FINANCE_ROUTES.TAXES);

  // Inicializar impuestos por defecto (IVA e ISLR activos)
  useEffect(() => {
    if (taxesData && taxesData.length > 0 && !taxesInitialized) {
      const defaultTaxes = taxesData
        .filter((tax) => {
          const name = tax.name?.toLowerCase();
          return name?.includes("iva") || name?.includes("islr");
        })
        .map((tax) => ({
          tax_id: tax.id,
          rate: isIvaTax(tax.name) ? IVA_FIXED_RATE : null,
          percent_retentions: null,
        }));
      queueMicrotask(() => {
        setSelectedTaxes(defaultTaxes);
        setTaxesInitialized(true);
      });
    }
  }, [taxesData, taxesInitialized]);

  // Toggle de impuesto
  const handleTaxToggle = (tax, checked) => {
    if (checked) {
      setSelectedTaxes((prev) => [
        ...prev,
        {
          tax_id: tax.id,
          rate: isIvaTax(tax.name) ? IVA_FIXED_RATE : null,
          percent_retentions: null,
        },
      ]);
    } else {
      setSelectedTaxes((prev) => prev.filter((t) => t.tax_id !== tax.id));
    }
  };

  // Cambio de configuración de impuesto
  const handleTaxConfigChange = (taxId, config) => {
    setSelectedTaxes((prev) =>
      prev.map((t) =>
        t.tax_id === taxId
          ? { ...t, rate: config.rate, percent_retentions: config.percent_retentions }
          : t
      )
    );
  };

  const onSubmit = async (data) => {
    const posting = Object.entries({
      ...data,
      type: selectedType,
    }).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Agregar impuestos al payload
    if (selectedTaxes.length > 0) {
      posting.tax = selectedTaxes.map((t) => ({
        tax_id: t.tax_id,
        rate: t.rate,
        percent_retentions: t.percent_retentions,
      }));
    } else {
      posting.tax = null;
    }

    try {
      const result = await createData(posting);
      toast.success(`Cliente "${posting.name}" creado con éxito`);
      handleClose();
      onSuccess?.(result);
    } catch {
      // apiClient interceptor ya muestra los errores de validación del backend
    }
  };

  const handleClose = () => {
    reset();
    setSelectedType("");
    setTaxesInitialized(false);
    setSelectedTaxes([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <TbUserDollar className="w-5 h-5" />
            Crear Cliente
          </DialogTitle>
          <DialogDescription>
            Complete los datos del cliente. Al guardar se seleccionará automáticamente.
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
              placeholder="Nombre del cliente"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Identificación */}
          <div className="grid grid-cols-[100px_1fr] gap-2">
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
                Nº Identificación
              </Label>
              <Input
                {...register("identification")}
                placeholder="Número de identificación"
              />
              {errors.identification && (
                <p className="text-xs text-red-500">
                  {errors.identification.message}
                </p>
              )}
            </div>
          </div>

          {/* Email y Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Email</Label>
              <Input
                {...register("email", {
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Email inválido",
                  },
                })}
                placeholder="correo@ejemplo.com"
                type="email"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Contacto</Label>
              <Input
                {...register("contact")}
                placeholder="Persona de contacto"
              />
            </div>
          </div>

          {/* Teléfono y Dirección */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Teléfono</Label>
              <Input
                {...register("phone", {
                  minLength: { value: 10, message: "Mínimo 10 dígitos" },
                })}
                placeholder="Teléfono"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-navy">Dirección</Label>
              <Input
                {...register("address")}
                placeholder="Dirección del cliente"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">
              Descripción (opcional)
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Descripción adicional..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Sección de Impuestos */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <TbReceipt2 className="w-4 h-4 text-navy" />
              <Label className="text-xs font-semibold text-navy">Impuestos</Label>
            </div>

            {taxesLoading ? (
              <p className="text-xs text-slate-500">Cargando impuestos...</p>
            ) : !taxesData?.length ? (
              <p className="text-xs text-slate-500">No hay impuestos disponibles</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {taxesData.map((tax) => {
                  const isSelected = selectedTaxes.some((st) => st.tax_id === tax.id);
                  const selectedTax = selectedTaxes.find((st) => st.tax_id === tax.id);
                  const isIva = isIvaTax(tax.name);

                  return (
                    <div
                      key={tax.id}
                      className={`p-2.5 rounded-lg border transition-all min-w-40 flex-1 ${
                        isSelected
                          ? "border-navy/30 bg-white shadow-sm"
                          : "border-gray-200 bg-gray-25 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Checkbox
                          id={`qc-tax-${tax.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleTaxToggle(tax, checked)}
                          className="data-[state=checked]:bg-navy data-[state=checked]:border-navy h-3.5 w-3.5"
                        />
                        <Label
                          htmlFor={`qc-tax-${tax.id}`}
                          className="text-xs font-medium text-navy cursor-pointer"
                        >
                          {tax.name}
                        </Label>
                      </div>

                      {isSelected && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {isIva ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-500">Valor:</span>
                                <span className="text-[10px] font-semibold text-navy">
                                  {IVA_FIXED_RATE}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-500">Retención:</span>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="0"
                                  value={selectedTax?.percent_retentions ?? ""}
                                  onChange={(e) =>
                                    handleTaxConfigChange(tax.id, {
                                      rate: IVA_FIXED_RATE,
                                      percent_retentions: e.target.value
                                        ? parseFloat(e.target.value)
                                        : null,
                                    })
                                  }
                                  className="w-14 h-5 text-[10px] px-1"
                                />
                                <span className="text-[10px] text-gray-400">%</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-gray-500">Retención:</span>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="0"
                                value={selectedTax?.rate ?? ""}
                                onChange={(e) =>
                                  handleTaxConfigChange(tax.id, {
                                    rate: e.target.value
                                      ? parseFloat(e.target.value)
                                      : null,
                                    percent_retentions: null,
                                  })
                                }
                                className="w-14 h-5 text-[10px] px-1"
                              />
                              <span className="text-[10px] text-gray-400">%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
                "Crear Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
