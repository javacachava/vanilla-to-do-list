import { FILTER_TYPES } from '../constants/filterTypes.js';

/**
 * @typedef {import('../models/Task.js').Task} Task
 * @typedef {(task: Task) => boolean} FilterStrategy
 */

/**
 * Registro de estrategias de filtrado (predicados).
 *
 * OCP (Open/Closed): el código está ABIERTO a extensión y CERRADO a
 * modificación. Para agregar un filtro nuevo (por ejemplo "vencidas") basta con
 * añadir una entrada aquí; no hay que tocar TaskService ni el controlador, que
 * antes usaban un `if/else if` que crecía con cada caso nuevo.
 *
 * @type {Record<string, FilterStrategy>}
 */
export const FILTER_STRATEGIES = Object.freeze({
  [FILTER_TYPES.ALL]: () => true,
  [FILTER_TYPES.ACTIVE]: (task) => !task.completed,
  [FILTER_TYPES.COMPLETED]: (task) => task.completed,
});

/**
 * Obtiene la estrategia asociada a un tipo de filtro.
 * Si el filtro no existe, cae de forma segura en "mostrar todas".
 * @param {string} filterType
 * @returns {FilterStrategy}
 */
export function getFilterStrategy(filterType) {
  return FILTER_STRATEGIES[filterType] ?? FILTER_STRATEGIES[FILTER_TYPES.ALL];
}
