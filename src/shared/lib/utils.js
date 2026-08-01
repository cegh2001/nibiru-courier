/* CLSX */
import { clsx } from 'clsx';
/* Tailwind CSS Merge */
import { twMerge } from 'tailwind-merge';

// FUNCIONES
/* Funcionalidad para la Combinación de Clases */
export const cn = (...inputs) => twMerge(clsx(inputs));
