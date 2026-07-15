import { Task } from '../models/Task.js';
import { TaskRepository } from './TaskRepository.js';

/**
 * Implementación de TaskRepository que guarda las tareas en memoria.
 *
 * Existe para demostrar LSP: es intercambiable con LocalStorageTaskRepository
 * sin que TaskService cambie una sola línea. Útil también para pruebas
 * unitarias y para ejecutar la app sin tocar el almacenamiento del navegador.
 *
 * Se clona la colección en cada operación para que quien la use no pueda
 * mutar el estado interno por referencia (mismo aislamiento que da serializar
 * a JSON en la versión de localStorage).
 */
export class InMemoryTaskRepository extends TaskRepository {
  /** @type {object[]} */
  #tasks = [];

  /** @returns {Task[]} */
  getAll() {
    return this.#tasks.map((task) => Task.fromRaw({ ...task }));
  }

  /** @param {Task[]} tasks */
  saveAll(tasks) {
    this.#tasks = tasks.map((task) => ({ ...task }));
  }
}
