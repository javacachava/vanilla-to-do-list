import { TaskListView } from './TaskListView.js';
import { StatsView } from './StatsView.js';
import { FilterView } from './FilterView.js';
import { FILTER_TYPES } from '../constants/filterTypes.js';

/**
 * @typedef {import('../services/TaskService.js').TaskService} TaskService
 */

/**
 * Coordinador de la interfaz (patrón controlador).
 *
 * SRP: su única responsabilidad es orquestar —escucha los eventos del usuario,
 * le pide a TaskService que aplique las reglas y manda a las vistas a
 * redibujarse. No contiene reglas de negocio ni lógica de acceso a datos.
 *
 * DIP: recibe TaskService ya construido; no crea sus propias dependencias de
 * negocio.
 */
export class TodoController {
  /** @type {TaskService} */
  #service;
  /** @type {string} */
  #currentFilter = FILTER_TYPES.ALL;

  /** @type {HTMLInputElement} */
  #input;
  /** @type {HTMLElement} */
  #addButton;
  /** @type {HTMLElement} */
  #errorElement;

  /** @type {TaskListView} */
  #taskListView;
  /** @type {StatsView} */
  #statsView;
  /** @type {FilterView} */
  #filterView;

  /**
   * @param {object} params
   * @param {TaskService} params.service
   * @param {ReturnType<import('./domElements.js').getTodoElements>} params.elements
   */
  constructor({ service, elements }) {
    this.#service = service;
    this.#input = elements.input;
    this.#addButton = elements.addButton;
    this.#errorElement = elements.errorElement;

    this.#taskListView = new TaskListView(elements.taskList, {
      onToggle: (id) => this.#handleToggle(id),
      onDelete: (id) => this.#handleDelete(id),
    });
    this.#statsView = new StatsView(elements.stats);
    this.#filterView = new FilterView(elements.filterButtons, {
      onFilterChange: (filter) => this.#handleFilterChange(filter),
    });
  }

  /** Enlaza los eventos iniciales y pinta el primer estado. */
  init() {
    this.#addButton.addEventListener('click', () => this.#handleAddTask());
    this.#input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.#handleAddTask();
      }
    });
    this.#render();
  }

  #handleAddTask() {
    try {
      this.#service.addTask(this.#input.value);
      this.#input.value = '';
      this.#clearError();
      this.#render();
    } catch (error) {
      // La validación vive en el servicio; aquí solo se decide cómo mostrarla.
      // Se reemplaza el alert() bloqueante del original por un mensaje inline.
      this.#showError(error.message);
    }
  }

  /** @param {number} id */
  #handleToggle(id) {
    this.#service.toggleTask(id);
    this.#render();
  }

  /** @param {number} id */
  #handleDelete(id) {
    this.#service.deleteTask(id);
    this.#render();
  }

  /** @param {string} filter */
  #handleFilterChange(filter) {
    this.#currentFilter = filter;
    this.#render();
  }

  /** Redibuja lista y estadísticas con el estado actual. */
  #render() {
    this.#taskListView.render(this.#service.getTasks(this.#currentFilter));
    this.#statsView.render(this.#service.getStats());
  }

  /** @param {string} message */
  #showError(message) {
    this.#errorElement.textContent = message;
  }

  #clearError() {
    this.#errorElement.textContent = '';
  }
}
