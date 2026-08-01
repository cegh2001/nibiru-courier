import React from 'react'
import { Button } from '@/components/ui/button';
import { TbPrinter } from 'react-icons/tb';

export const PrintButton = ({printableRef}) => {
  // Función para imprimir el componente
  const handlePrint = () => {
    if (printableRef.current) {
      const printContents = printableRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Recargar para restaurar el estado original
    }
  };

  return (
    <Button onClick={handlePrint} className="text-sm rounded-full">
      <TbPrinter />
      Imprimir
    </Button>
  );
}
