/**
 * Formatea una fecha de Firestore Timestamp o Date a string legible
 */
export function formatDate(date: any): string {
  // Verificar si es null o undefined
  if (!date || date === null || date === undefined) return 'N/A';
  
  try {
    // Si es un objeto Firestore Timestamp con método toDate
    if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
      const dateObj = date.toDate();
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Si es un objeto con seconds y nanoseconds (Firestore Timestamp)
    if (date && typeof date === 'object' && 'seconds' in date && date.seconds) {
      const dateObj = new Date(date.seconds * 1000);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Si es un string ISO
    if (typeof date === 'string' && date.trim() !== '') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleString('es-PE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
    
    // Si es un objeto Date
    if (date instanceof Date) {
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'N/A';
  }
}

