"use client";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options, groupBy) {
  // Ajustar para agrupar con itemLabelKey, itemValueKey
  if (options.length === 0) return {};
  if (!groupBy) return { "": options };

  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption, picked, itemValueKey) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p[itemValueKey] === val[itemValueKey])
    );
  }
  return cloneOption;
}

function isOptionsExist(groupOption, targetOption) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * El `CommandEmpty` de shadcn/ui causa que el cmdk empty no se renderice correctamente.
 * Por eso creamos uno propio copiando la implementación de `Empty` desde `cmdk`.
 */
const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("pt-3 pb-1 text-center text-sm text-navy", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef((props, ref) => {
  const {
    value,
    onChange,
    placeholder,
    defaultOptions: arrayDefaultOptions = [],
    options: arrayOptions,
    delay,
    onSearch,
    onSearchSync,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps,
    hideClearAllButton = false,
    itemValueKey = "value",
    itemLabelKey = "label",
    shortcut,
    hasLabel = false,
    labelName = "Lista de registros",
    margin,
  } = props;

  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [onScrollbar, setOnScrollbar] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const [selected, setSelected] = React.useState(value || []);
  const [options, setOptions] = React.useState(
    transToGroupOption(arrayDefaultOptions, groupBy)
  );
  const [inputValue, setInputValue] = React.useState("");
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

  React.useImperativeHandle(
    ref,
    () => ({
      get selectedValue() {
        return [...selected];
      },
      get input() {
        return inputRef.current;
      },
      focus: () => {
        inputRef?.current?.focus();
      },
      reset: () => {
        setSelected([]);
      },
    }),
    [selected]
  );

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  const handleUnselect = React.useCallback(
    (option) => {
      const newOptions = selected.filter(
        (s) => s[itemValueKey] !== option[itemValueKey]
      );
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected, itemValueKey]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, selected]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  useEffect(() => {
    // Si hay onSearch, no recargamos las options "manualmente".
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

  // Búsqueda "sincrónica"
  useEffect(() => {
    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;
      if (triggerSearchOnFocus) {
        doSearchSync();
      }
      if (debouncedSearchTerm) {
        doSearchSync();
      }
    };
    void exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearchSync]);

  // Búsqueda "asíncrona"
  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;
      if (triggerSearchOnFocus) {
        await doSearch();
      }
      if (debouncedSearchTerm) {
        await doSearch();
      }
    };
    void exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearch]);

  const CreatableItem = () => {
    if (!creatable) return null;
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find((s) => s.value === inputValue)
    ) {
      return null;
    }

    const itemNode = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(val) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue("");
          const newOption = {
            [itemValueKey]: val,
            [itemLabelKey]: val,
          };
          const newOptions = [...selected, newOption];
          setSelected(newOptions);
          onChange?.(newOptions);
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // Para modo "creatable" sin onSearch
    if (!onSearch && inputValue.length > 0) {
      return itemNode;
    }

    // Para modo "creatable" con onSearch, evitando mostrar el item antes de la primera búsqueda
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return itemNode;
    }
    return null;
  };

  const EmptyItem = React.useCallback(() => {
    if (!emptyIndicator) return null;
    // Para búsqueda async
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      );
    }
    return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  const selectables = React.useMemo(
    () => removePickedOption(options, selected, itemValueKey),
    [options, selected, itemValueKey]
  );

  const commandFilter = React.useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }
    if (creatable) {
      return (value, search) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      };
    }
    // Filtro por defecto de cmdk si no hay "creatable"
    return undefined;
  }, [creatable, commandProps?.filter]);

  return (
    <div className={`flex flex-col ${margin}`}>
      {hasLabel && (
        <label className={`text-xs font-medium text-navy mb-1 block ${disabled ? "opacity-50" : ""}`}>
          {labelName}
        </label>
      )}
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn(
          "h-auto overflow-visible bg-transparent shadow-xs shadow-navy-light",
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        }
        filter={commandFilter()}
      >
        <div
          className={cn(
            "min-h-9 rounded-md text-base md:text-sm ring-offset-background focus-within:ring-ring focus-within:ring-offset-2 duration-300",
            {
              "px-3 py-2": selected.length !== 0,
              "cursor-text": !disabled && selected.length !== 0,
            },
            className
          )}
          onClick={() => {
            if (disabled) return;
            inputRef?.current?.focus();
          }}
        >
          <div className="relative flex flex-wrap gap-1">
            {selected.map((option) => {
              return (
                <Badge
                  key={option[itemValueKey]}
                  className={cn(
                    "relative data-disabled:bg-muted-foreground data-disabled:text-muted data-disabled:hover:bg-muted-foreground ",
                    "data-fixed:bg-muted-foreground data-fixed:text-muted data-fixed:hover:bg-muted-foreground",
                    badgeClassName
                  )}
                  data-fixed={option.fixed}
                  data-disabled={disabled || undefined}
                >
                  {option[itemLabelKey]}
                  <button
                    className={cn(
                      "absolute top-0 right-0 translate-x-1 -translate-y-1 bg-ruby-light hover:scale-125 rounded-full outline-hidden ring-offset-background focus:ring-ring focus:ring-offset-2 duration-150",
                      (disabled || option.fixed) && "hidden"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(val) => {
                setInputValue(val);
                inputProps?.onValueChange?.(val);
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false);
                }
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                if (triggerSearchOnFocus) {
                  onSearch?.(debouncedSearchTerm);
                }
                inputProps?.onFocus?.(event);
              }}
              placeholder={
                hidePlaceholderWhenSelected && selected.length !== 0
                  ? ""
                  : placeholder
              }
              className={cn(
                "flex h-9 w-full rounded-md bg-transparent py-2 text-sm focus:ring-0 focus:outline-hidden border-0 outline-hidden placeholder:text-navy/50 hover:placeholder:text-navy disabled:cursor-not-allowed disabled:opacity-50 font-medium text-navy hover:text-navy hover:bg-navy-rgba ",
                {
                  "w-full": hidePlaceholderWhenSelected,
                  "px-3 py-2": selected.length === 0,
                  "ml-": selected.length !== 0,
                },
                inputProps?.className
              )}
            />

            <button
              type="button"
              onClick={() => {
                const remainingFixed = selected.filter((s) => s.fixed);
                setSelected(remainingFixed);
                onChange?.(remainingFixed);
              }}
              className={cn(
                "absolute bottom-0 -translate-y-1/2 right-1 h-5 w-5 p-0",
                (hideClearAllButton ||
                  disabled ||
                  selected.length < 1 ||
                  selected.filter((s) => s.fixed).length === selected.length) &&
                  "hidden"
              )}
            >
              <X className="pr-2 text-navy hover:text-red-500 duration-150" />
            </button>
          </div>
        </div>
        <div className="relative">
          {open && (
            <CommandList
              className="scrollbar absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in"
              onMouseLeave={() => {
                setOnScrollbar(false);
              }}
              onMouseEnter={() => {
                setOnScrollbar(true);
              }}
              onMouseUp={() => {
                inputRef?.current?.focus();
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}
                  {Object.entries(selectables).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                    >
                      <>
                        {dropdowns.map((option) => {
                          return (
                            <CommandItem
                              key={option[itemValueKey]}
                              value={option[itemLabelKey]}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                if (selected.length >= maxSelected) {
                                  onMaxSelected?.(selected.length);
                                  return;
                                }
                                setInputValue("");
                                const newOption = {
                                  [itemValueKey]: option[itemValueKey],
                                  [itemLabelKey]: option[itemLabelKey],
                                };
                                const newOptions = [...selected, newOption];
                                setSelected(newOptions);
                                onChange?.(newOptions);
                              }}
                              className={cn(
                                "cursor-pointer data-[selected=true]:bg-navy data-[selected=true]:text-white text-navy",
                                option.disable &&
                                  "cursor-default text-muted-foreground"
                              )}
                            >
                              {option[itemLabelKey]}
                            </CommandItem>
                          );
                        })}
                      </>
                    </CommandGroup>
                  ))}
                  {shortcut && <div className="border-t">{shortcut}</div>}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    </div>
  );
});

MultipleSelector.displayName = "MultipleSelector";
export { MultipleSelector };
