import { useState, useEffect, useRef, useCallback } from "react";

export function useTableState({ shortcutEdit, isEditing, onStateChange }) {
  const [currentView, setCurrentView] = useState('table');
  const containerRef = useRef(null);

  const scrollToContainer = useCallback(() => {
    if (containerRef.current) {
      // Usamos requestAnimationFrame para asegurar que el scroll se ejecute 
      // después de que el DOM esté completamente actualizado
      requestAnimationFrame(() => {
        const element = containerRef.current;
        if (element) {
          const elementTop = element.offsetTop;
          const offsetPosition = elementTop - 100; // 100px de margen superior
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }, []);

  // Manejar shortcut de edición
  useEffect(() => {
    if (shortcutEdit && isEditing) {
      queueMicrotask(() => setCurrentView('add'));
      // Delay optimizado para la nueva animación más rápida
      setTimeout(() => {
        scrollToContainer();
      }, 400);
    }
  }, [shortcutEdit, isEditing, scrollToContainer]);

  // Resetear vista cuando se desactiva el modo edición
  useEffect(() => {
    if (!isEditing && currentView !== 'table') {
      queueMicrotask(() => setCurrentView('table'));
    }
  }, [isEditing, currentView]);

  // Notificar cambios de estado
  useEffect(() => {
    onStateChange(currentView);
  }, [currentView, onStateChange]);

  const handleShowAdd = useCallback(() => {
    setCurrentView('add');
    // Delay para permitir que se renderice la animación
    setTimeout(() => {
      scrollToContainer();
    }, 100);
  }, [scrollToContainer]);

  const handleShowEdit = useCallback(() => {
    setCurrentView('edit');
    // Delay para permitir que se renderice la animación
    setTimeout(() => {
      scrollToContainer();
    }, 100);
  }, [scrollToContainer]);

  const handleCancel = useCallback(() => {
    setCurrentView('table');
  }, []);

  return {
    currentView,
    containerRef,
    handleShowAdd,
    handleShowEdit,
    handleCancel,
  };
}
