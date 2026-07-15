/**
 * Claves usadas para persistir datos.
 * Centralizarlas elimina los "magic strings" repetidos y da un único punto
 * de cambio si algún día cambia el esquema de almacenamiento.
 */
export const STORAGE_KEYS = Object.freeze({
  TASKS: 'tasks',
});
