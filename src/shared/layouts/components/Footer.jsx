"use client";

export const Footer = () => {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  
  return (
    <footer className="mt-auto px-6 sm:px-16 mx-auto w-full max-w-8xl print:hidden">
      <div className="py-2 border-t border-gray-200 text-sm text-navy text-center">
        <span className="block sm:inline sm:mr-1 sm:ml-8">
          Sistema del Almacén Aéreo de Gonavi &copy; {currentYear} <strong>G-Aéreo</strong>.
        </span>
        <span className="block sm:inline">Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};