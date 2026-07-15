/**
 * @typedef {import('../models/Task.js').Task} Task
 */

/**
 * Contrato de persistencia de tareas (actúa como interfaz).
 *
 * - ISP (Interface Segregation): expone SOLO lo que las capas superiores
 *   necesitan —leer todo y guardar todo—, sin métodos de más que obliguen a
 *   implementar cosas que no se usan.
 * - DIP (Dependency Inversion): TaskService dependerá de esta abstracción y no
 *   de una tecnología concreta (localStorage, API, IndexedDB, etc.).
 * - LSP (Liskov Substitution): cualquier subclase debe respetar este contrato
 *   para poder sustituirla sin romper a quien la consume.
 */
export class TaskRepository {
  /**
   * Devuelve todas las tareas persistidas.
   * @returns {Task[]}
   */
  getAll() {
    throw new Error('TaskRepository.getAll() debe ser implementado por una subclase');
  }

  /**
   * Persiste la colección completa de tareas.
   * @param {Task[]} _tasks
   * @returns {void}
   */
  saveAll(_tasks) {
    throw new Error('TaskRepository.saveAll() debe ser implementado por una subclase');
  }
}
