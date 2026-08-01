import { useState, useCallback, useMemo } from "react";

// Hook común para manejar paginación y expansión
export function useLocalPagination(items) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = useMemo(
    () => Math.max(Math.ceil(items.length / itemsPerPage), 1),
    [items, itemsPerPage]
  );

  const currentItems = useMemo(
    () => items.slice(indexOfFirstItem, indexOfLastItem),
    [items, indexOfFirstItem, indexOfLastItem]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleExpand = useCallback(
    (increment) => {
      setItemsPerPage((prevItemsPerPage) => {
        const newItemsPerPage = prevItemsPerPage + increment;
        return Math.min(Math.max(newItemsPerPage, 10), items.length);
      });
    },
    [items]
  );

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    handlePageChange,
    handleExpand,
  };
}