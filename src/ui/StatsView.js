/**
 * Vista responsable únicamente de mostrar el resumen de tareas (SRP).
 * Recibe los números ya calculados por TaskService; no hace cálculos ni conoce
 * el origen de los datos.
 */
export class StatsView {
  /** @type {HTMLElement} */
  #container;

  /** @param {HTMLElement} container */
  constructor(container) {
    this.#container = container;
  }

  /**
   * @param {{ total: number, completed: number, active: number }} stats
   */
  render({ total, completed, active }) {
    this.#container.textContent = `Total: ${total} | Completadas: ${completed} | Activas: ${active}`;
  }
}
