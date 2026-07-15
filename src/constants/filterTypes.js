/**
 * Tipos de filtro disponibles para la lista de tareas.
 * Antes estaban dispersos como cadenas mágicas ('all', 'active', 'completed')
 * dentro de los condicionales. Centralizarlos evita errores de tipeo y da
 * autocompletado.
 */
export const FILTER_TYPES = Object.freeze({
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
});
