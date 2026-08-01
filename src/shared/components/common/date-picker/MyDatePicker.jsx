"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

// shadcn/ui
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Tu calendario ya existente
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------
 * Utils mínimas para manejar horas/minutos/segundos y convertir 12/24h
 * ------------------------------------------------------------------ */
function isValidHour(value) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}
function isValid12Hour(value) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}
function isValidMinuteOrSecond(value) {
  return /^[0-5][0-9]$/.test(value);
}

function getValidNumber(value, { max, min = 0, loop = false }) {
  let numericValue = parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      // loop = true => si me paso del max, vuelvo a min y viceversa
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }
  return "00";
}
function getValidHour(value) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}
function getValid12Hour(value) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}
function getValidMinuteOrSecond(value) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

function display12HourValue(hours) {
  // 0 = 12 AM, 12 = 12 PM, etc.
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}
function convert12HourTo24Hour(hour, period) {
  if (period === "PM") {
    if (hour <= 11) return hour + 12;
    return hour;
  }
  // AM
  if (hour === 12) return 0;
  return hour;
}

function setHours(date, value) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}
function setMinutes(date, value) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}
function setSeconds(date, value) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}
function set12Hours(date, value, period) {
  const hr = parseInt(getValid12Hour(value), 10);
  date.setHours(convert12HourTo24Hour(hr, period));
  return date;
}

function getDateByType(date, picker) {
  if (!date) return "00";
  switch (picker) {
    case "hours":
      return getValidHour(String(date.getHours()));
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "12hours":
      return getValid12Hour(String(display12HourValue(date.getHours())));
    default:
      return "00";
  }
}

function setDateByType(date, value, picker, period) {
  switch (picker) {
    case "hours":
      return setHours(date, value);
    case "minutes":
      return setMinutes(date, value);
    case "seconds":
      return setSeconds(date, value);
    case "12hours":
      return set12Hours(date, value, period);
    default:
      return date;
  }
}

function getValidArrowNumber(value, { min, max, step }) {
  let numericValue = parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}
function getArrowByType(value, step, picker) {
  switch (picker) {
    case "hours":
      return getValidArrowNumber(value, { min: 0, max: 23, step });
    case "minutes":
      return getValidArrowNumber(value, { min: 0, max: 59, step });
    case "seconds":
      return getValidArrowNumber(value, { min: 0, max: 59, step });
    case "12hours":
      return getValidArrowNumber(value, { min: 1, max: 12, step });
    default:
      return "00";
  }
}

/* ------------------------------------------------------------------
 * TimePickerInput: Campo individual para horas, minutos o segundos
 * ------------------------------------------------------------------ */
const TimePickerInput = React.forwardRef(function TimePickerInput(
  {
    className,
    type = "tel",
    value,
    id,
    name,
    date,
    onDateChange,
    onChange,
    onKeyDown,
    picker,
    period,
    onLeftFocus,
    onRightFocus,
    ...props
  },
  ref
) {
  const [flag, setFlag] = React.useState(false);
  const [prevIntKey, setPrevIntKey] = React.useState("0");

  // Si pasan 2s sin pulsar la siguiente tecla, se resetea el flag
  React.useEffect(() => {
    if (flag) {
      const timer = setTimeout(() => {
        setFlag(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [flag]);

  const calculatedValue = React.useMemo(() => {
    return getDateByType(date || null, picker);
  }, [date, picker]);

  const calculateNewValue = (key) => {
    if (picker === "12hours") {
      // Caso especial "0" => 10, 11, 12
      if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0") {
        return `0${key}`;
      }
    }
    return !flag ? `0${key}` : calculatedValue.slice(1, 2) + key;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") return;
    e.preventDefault();

    if (e.key === "ArrowRight") onRightFocus?.();
    if (e.key === "ArrowLeft") onLeftFocus?.();

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const step = e.key === "ArrowUp" ? 1 : -1;
      const newValue = getArrowByType(calculatedValue, step, picker);
      if (flag) setFlag(false);
      const tempDate = date ? new Date(date) : new Date();
      onDateChange?.(setDateByType(tempDate, newValue, picker, period));
    }

    if (e.key >= "0" && e.key <= "9") {
      if (picker === "12hours") setPrevIntKey(e.key);

      const newValue = calculateNewValue(e.key);
      if (flag) onRightFocus?.();
      setFlag((prev) => !prev);
      const tempDate = date ? new Date(date) : new Date();
      onDateChange?.(setDateByType(tempDate, newValue, picker, period));
    }
  };

  return (
    <Input
      ref={ref}
      id={id || picker}
      name={name || picker}
      className={cn(
        "w-[48px] text-center font-mono text-navy-dark tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
      value={value || calculatedValue}
      onChange={(e) => {
        e.preventDefault();
        onChange?.(e);
      }}
      type={type}
      inputMode="decimal"
      onKeyDown={(e) => {
        onKeyDown?.(e);
        handleKeyDown(e);
      }}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------
 * Selección de AM/PM
 * ------------------------------------------------------------------ */
const TimePeriodSelect = React.forwardRef(function TimePeriodSelect(
  { period, setPeriod, date, onDateChange, onRightFocus, onLeftFocus },
  ref
) {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") onRightFocus?.();
    if (e.key === "ArrowLeft") onLeftFocus?.();
  };

  const handleValueChange = (val) => {
    setPeriod?.(val);
    // Ajustar inmediatamente la hora si se cambia AM <-> PM
    if (date) {
      const tempDate = new Date(date);
      const hrs12 = display12HourValue(tempDate.getHours());
      const opposite = period === "AM" ? "PM" : "AM";
      onDateChange?.(setDateByType(tempDate, hrs12, "12hours", opposite));
    }
  };

  return (
    <div className="flex h-10 items-center">
      <Select defaultValue={period} onValueChange={handleValueChange}>
        <SelectTrigger
          ref={ref}
          className="w-[65px] focus:bg-accent focus:text-accent-foreground"
          onKeyDown={handleKeyDown}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

/* ------------------------------------------------------------------
 * TimePicker: Contenedor para Inputs de hora, minuto, segundo + AM/PM
 * ------------------------------------------------------------------ */
const TimePicker = React.forwardRef(function TimePicker(
  { date, onChange, hourCycle = 24, granularity = "minute" },
  ref
) {
  const minuteRef = React.useRef(null);
  const hourRef = React.useRef(null);
  const secondRef = React.useRef(null);
  const periodRef = React.useRef(null);
  const [period, setPeriod] = React.useState(
    date && date.getHours() >= 12 ? "PM" : "AM"
  );

  React.useImperativeHandle(ref, () => ({
    minuteRef: minuteRef.current,
    hourRef: hourRef.current,
    secondRef: secondRef.current,
    periodRef: periodRef.current,
  }));

  // Cada vez que se cambie la fecha (date) desde fuera, recalculamos AM/PM
  React.useEffect(() => {
    if (!date) return;
    setPeriod(date.getHours() >= 12 ? "PM" : "AM");
  }, [date]);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Icono de reloj como label */}
      <label htmlFor="datetime-picker-hour-input" className="cursor-pointer">
        <Clock className="mr-2 h-4 w-4 text-navy" />
      </label>

      {/* Horas (24h o 12h) */}
      <TimePickerInput
        picker={hourCycle === 24 ? "hours" : "12hours"}
        date={date}
        id="datetime-picker-hour-input"
        onDateChange={onChange}
        ref={hourRef}
        period={period}
        onRightFocus={() => minuteRef?.current?.focus()}
      />

      {(granularity === "minute" || granularity === "second") && (
        <>
          :
          <TimePickerInput
            picker="minutes"
            date={date}
            onDateChange={onChange}
            ref={minuteRef}
            onLeftFocus={() => hourRef?.current?.focus()}
            onRightFocus={
              granularity === "second"
                ? () => secondRef?.current?.focus()
                : undefined
            }
          />
        </>
      )}

      {granularity === "second" && (
        <>
          :
          <TimePickerInput
            picker="seconds"
            date={date}
            onDateChange={onChange}
            ref={secondRef}
            onLeftFocus={() => minuteRef?.current?.focus()}
            onRightFocus={
              hourCycle === 12 ? () => periodRef?.current?.focus() : undefined
            }
          />
        </>
      )}

      {hourCycle === 12 && (
        <div className="grid gap-1 text-center">
          <TimePeriodSelect
            period={period}
            setPeriod={setPeriod}
            date={date}
            onDateChange={onChange}
            ref={periodRef}
            onLeftFocus={
              granularity === "second"
                ? () => secondRef?.current?.focus()
                : () => minuteRef?.current?.focus()
            }
          />
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------
 * MyDatePicker: Tu componente actual, extendido con la opción de hora
 * ------------------------------------------------------------------ */
export function MyDatePicker({
  value,
  onChange,
  className,
  hasLabel = false,
  labelName = "Fecha",
  withTime = false,
  hourCycle = 24,
  granularity = "minute",
  // Prop para usar estilos de shadcn
  useShadcnStyles = false,
}) {
  const [internalDate, setInternalDate] = React.useState(value || null);

  React.useEffect(() => {
    setInternalDate(value);
  }, [value]);

  function handleSelectDate(date) {
    if (!date) {
      setInternalDate(null);
      onChange?.(null);
      return;
    }

    const newDate = new Date(date);

    // Si internalDate es null, usamos la hora actual
    if (!internalDate) {
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    } else {
      // Si ya hay una fecha seleccionada, mantenemos la hora previa
      newDate.setHours(
        internalDate.getHours(),
        internalDate.getMinutes(),
        internalDate.getSeconds()
      );
    }

    setInternalDate(newDate);
    onChange?.(newDate);
  }

  function handleTimeChange(newDate) {
    if (!newDate) return;
    setInternalDate(newDate);
    onChange?.(newDate);
  }

  return (
    <div className="flex flex-col w-full">
      {hasLabel && (
        <label className={useShadcnStyles ? "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1" : "text-xs font-medium text-navy mb-1 block"}>
          {labelName}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              useShadcnStyles ? "w-full justify-between" : [
                "min-w-[240px] justify-between font-medium border-0 text-navy hover:text-navy hover:bg-navy-rgba shadow-xs shadow-navy-light",
                !internalDate && "text-navy/70"
              ],
              className
            )}
          >
            <span className="truncate shrink text-left mr-2">
              {internalDate ? (
                format(internalDate, withTime ? "PPpp" : "PPP", { locale: es })
              ) : (
                <span className="font-normal text-sm">Seleccionar fecha</span>
              )}
            </span>
            <CalendarIcon className={`shrink-0 ${useShadcnStyles ? "" : "text-navy/70"}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={internalDate}
            defaultMonth={internalDate || undefined}
            onSelect={handleSelectDate}
            locale={es}
            weekStartsOn={1}
            initialFocus
          />
          {withTime && internalDate && (
            <div className="border-t border-border p-3">
              <TimePicker
                date={internalDate}
                onChange={handleTimeChange}
                hourCycle={hourCycle}
                granularity={granularity}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}