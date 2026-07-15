import { Task } from '../models/Task.js';
import { TaskRepository } from './TaskRepository.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';

/**
 * Implementación de TaskRepository que persiste en el almacenamiento del
 * navegador (localStorage por defecto).
 *
 * El objeto de almacenamiento se inyecta por constructor, así que también es
 * una aplicación de DIP a bajo nivel: la clase no queda amarrada a la variable
 * global `localStorage` y puede probarse con un doble en memoria.
 */
export class LocalStorageTaskRepository extends TaskRepository {
  /** @type {Storage} */
  #storage;
  /** @type {string} */
  #key;

  /**
   * @param {Storage} [storage=window.localStorage]
   * @param {string} [key=STORAGE_KEYS.TASKS]
   */
  constructor(storage = window.localStorage, key = STORAGE_KEYS.TASKS) {
    super();
    this.#storage = storage;
    this.#key = key;
  }

  /** @returns {Task[]} */
  getAll() {
    const raw = this.#storage.getItem(this.#key);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Task.fromRaw) : [];
    } catch {
      // Antes, un JSON corrupto reventaba toda la app al cargar. Ahora se
      // registra el problema y se parte de una lista vacía de forma segura.
      console.error('Datos de tareas corruptos en el almacenamiento. Se reinicia la lista.');
      return [];
    }
  }

  /** @param {Task[]} tasks */
  saveAll(tasks) {
    this.#storage.setItem(this.#key, JSON.stringify(tasks));
  }
}
