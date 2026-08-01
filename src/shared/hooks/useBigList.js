/* Hooks */
import { useState, useCallback, useMemo } from "react";
import { useLocalPagination } from "./useLocalPagination";

// Hook para manejar listas grandes
export function useBigListbox({
  options,
  selected,
  setSelected,
  preSelected = [],
  preSelected2 = [],
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [results, setResults] = useState([]);

  const availableOptions = useMemo(() => {
    return (results.length === 0 ? options : results).filter(
      (item) =>
        !selected.some((selectedItem) => selectedItem.id === item.id) &&
        !preSelected.some((preItem) => preItem.id === item.id) &&
        !preSelected2.some((preItem2) => preItem2.id === item.id)
    );
  }, [results, options, selected, preSelected, preSelected2]);

  const filteredPreSelected = useMemo(() => {
    return preSelected.filter((item) =>
      results.length === 0 ? true : results.some((result) => result.id === item.id)
    );
  }, [results, preSelected]);

  const filteredPreSelected2 = useMemo(() => {
    return preSelected2.filter((item) =>
      results.length === 0 ? true : results.some((result) => result.id === item.id)
    );
  }, [results, preSelected2]);

  const combinedOptions = useMemo(() => {
    return [...filteredPreSelected, ...availableOptions, ...filteredPreSelected2]
      .filter(item => !selected.some(selectedItem => selectedItem.id === item.id));
  }, [filteredPreSelected, availableOptions, filteredPreSelected2, selected]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleExpand,
  } = useLocalPagination(combinedOptions);

  const handleSelect = useCallback(
    (option) => {
      if (preSelected2.some((preItem2) => preItem2.id === option.id)) {
        return; // Ignore selection if the item is in preSelected2
      }
      setSelected((prevSelected) =>
        prevSelected.some((item) => item.id === option.id)
          ? prevSelected.filter((item) => item.id !== option.id)
          : [...prevSelected, option]
      );
    },
    [setSelected, preSelected2]
  );

  const handleSelectAll = useCallback(() => {
    setSelected((prevSelected) => {
      const allCurrentSelected = currentItems.every((option) =>
        prevSelected.some((item) => item.id === option.id)
      );
      return allCurrentSelected
        ? prevSelected.filter(
            (item) => !currentItems.some((option) => option.id === item.id)
          )
        : [...prevSelected, ...currentItems.filter(option => !preSelected2.some(preItem2 => preItem2.id === option.id))];
    });
  }, [currentItems, setSelected, preSelected2]);

  const selectable = combinedOptions.length - preSelected2?.length;

  const allSelected = selected.length > 0 && (selectable === 0);

  return {
    currentPage,
    isExpanded,
    itemsPerPage,
    results,
    setResults,
    availableOptions,
    combinedOptions,
    totalPages,
    currentItems,
    handlePageChange,
    handleExpand,
    handleSelect,
    handleSelectAll,
    selectable,
    allSelected,
    setIsExpanded,
  };
}

// Hook para manejar elementos seleccionados de una lista grande
export function useSelectedBigListbox(
  selected,
  preSelected,
  preSelected2,
  handleDeselect
) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [results, setResults] = useState([]);

  const getFilteredItems = useCallback(() => {
    if (results.length === 0) return selected;
    const resultNames = results.map((result) => result.name);
    return selected.filter((item) => resultNames.includes(item.name));
  }, [results, selected]);

  const combinedItems = useMemo(() => {
    const filteredItems = getFilteredItems();
    const resultNames = results.map((result) => result.name);

    const preSelectedFiltered = preSelected.filter((preItem) =>
      resultNames.includes(preItem.name)
    );
    const preSelected2Filtered = preSelected2.filter((preItem) =>
      resultNames.includes(preItem.name)
    );

    const combined = [
      ...preSelectedFiltered,
      ...preSelected2Filtered,
      ...filteredItems,
    ];
    const uniqueCombined = Array.from(
      new Set(combined.map((item) => item.name))
    ).map((name) => combined.find((item) => item.name === name));
    return uniqueCombined;
  }, [preSelected, preSelected2, results, getFilteredItems]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleExpand,
  } = useLocalPagination(combinedItems);

  const handleDeselectAll = useCallback(() => {
    currentItems.forEach((item) => handleDeselect(item));
  }, [currentItems, handleDeselect]);

  return {
    currentPage,
    isExpanded,
    itemsPerPage,
    results,
    combinedItems,
    totalPages,
    currentItems,
    setResults,
    setIsExpanded,
    handlePageChange,
    handleExpand,
    handleDeselectAll,
  };
}