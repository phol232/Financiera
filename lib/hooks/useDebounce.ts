import { useEffect, useState } from 'react';

/**
 * Hook para debounce de valores
 * Útil para búsquedas y filtros que no deben ejecutarse en cada tecla
 * 
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 500ms)
 * @returns Valor debounced
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * // debouncedSearch solo se actualiza 500ms después de que el usuario deja de escribir
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un timeout para actualizar el valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes de que se cumpla el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
