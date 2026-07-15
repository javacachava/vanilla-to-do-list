import { Task } from '../models/Task.js';
import { getFilterStrategy } from '../filters/filterStrategies.js';
import { FILTER_TYPES } from '../constants/filterTypes.js';

/**
 * @typedef {import('../repositories/TaskRepository.js').TaskRepository} TaskRepository
 */

/**
 * Capa de lógica de negocio de las tareas.
 *
 * - SRP: su única responsabilidad son las reglas de negocio (crear, alternar,
 *   eliminar, filtrar y calcular estadísticas). No toca el DOM ni el
 *   almacenamiento directamente.
 * - DIP: depende de la abstracción TaskRepository, inyectada por constructor,
 *   no de una implementación concreta. Cambiar de localStorage a una API sería
 *   cambiar qué repositorio se le pasa, sin modificar esta clase.
 */
export class TaskService {
  /** @type {TaskRepository} */
  #repository;
  /** @type {Task[]} */
  #tasks;

  /**
   * @param {TaskRepository} repository
   */
  constructor(repository) {
    this.#repository = repository;
    this.#tasks = this.#repository.getAll();
  }

  /**
   * Devuelve las tareas aplicando el filtro indicado.
   * @param {string} [filterType=FILTER_TYPES.ALL]
   * @returns {Task[]}
   */
  getTasks(filterType = FILTER_TYPES.ALL) {
    return this.#tasks.filter(getFilterStrategy(filterType));
  }

  /**
   * Crea una tarea nueva a partir de un texto.
   * @param {string} text
   * @returns {Task} la tarea creada
   * @throws {Error} si el texto queda vacío tras limpiarlo
   */
  addTask(text) {
    const cleanText = text.trim();
    if (cleanText === '') {
      throw new Error('El texto de la tarea no puede estar vacío');
    }

    const task = new Task({ id: this.#nextId(), text: cleanText });
    this.#tasks.push(task);
    this.#persist();
    return task;
  }

  /**
   * Alterna el estado de completado de una tarea por id.
   * @param {number} id
   */
  toggleTask(id) {
    const task = this.#tasks.find((current) => current.id === id);
    if (!task) {
      return;
    }
    task.toggleCompleted();
    this.#persist();
  }

  /**
   * Elimina una tarea por id.
   * @param {number} id
   */
  deleteTask(id) {
    this.#tasks = this.#tasks.filter((task) => task.id !== id);
    this.#persist();
  }

  /**
   * Calcula el resumen de tareas.
   * @returns {{ total: number, completed: number, active: number }}
   */
  getStats() {
    const total = this.#tasks.length;
    const completed = this.#tasks.filter((task) => task.completed).length;
    return { total, completed, active: total - completed };
  }

  /**
   * Calcula el siguiente id disponible a partir del mayor existente.
   * Sustituye al contador global `taskId`, que había que mantener sincronizado
   * a mano y podía desalinearse tras recargar o borrar tareas.
   * @returns {number}
   */
  #nextId() {
    return this.#tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  }

  /** Guarda el estado actual a través del repositorio. */
  #persist() {
    this.#repository.saveAll(this.#tasks);
  }
}
