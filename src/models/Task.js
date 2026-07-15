/**
 * Entidad de dominio que representa una tarea.
 *
 * Concentra la forma de una tarea y su comportamiento propio (alternar estado).
 * Antes la "tarea" era un objeto literal creado a mano dentro de addTask(), sin
 * ningún lugar responsable de su estructura ni de sus invariantes.
 */
export class Task {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.text
   * @param {boolean} [params.completed=false]
   * @param {string} [params.createdAt]
   */
  constructor({ id, text, completed = false, createdAt = new Date().toISOString() }) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  /** Alterna el estado de completado de la tarea. */
  toggleCompleted() {
    this.completed = !this.completed;
  }

  /**
   * Reconstruye una Task a partir de un objeto plano (por ejemplo, lo leído
   * desde localStorage). Mantiene en un solo lugar la lógica de rehidratación.
   * @param {object} raw
   * @returns {Task}
   */
  static fromRaw(raw) {
    return new Task(raw);
  }
}
