/**
 * @typedef {import('../models/Task.js').Task} Task
 */

/**
 * Vista responsable únicamente de renderizar la lista de tareas en el DOM (SRP).
 *
 * No conoce a TaskService ni al almacenamiento: recibe las tareas ya listas y
 * comunica las intenciones del usuario (completar/eliminar) hacia afuera
 * mediante callbacks. Así la vista queda desacoplada de la lógica de negocio.
 */
export class TaskListView {
  /** @type {HTMLElement} */
  #container;
  /** @type {(id: number) => void} */
  #onToggle;
  /** @type {(id: number) => void} */
  #onDelete;

  /**
   * @param {HTMLElement} container
   * @param {object} handlers
   * @param {(id: number) => void} handlers.onToggle
   * @param {(id: number) => void} handlers.onDelete
   */
  constructor(container, { onToggle, onDelete }) {
    this.#container = container;
    this.#onToggle = onToggle;
    this.#onDelete = onDelete;
  }

  /**
   * Renderiza la lista completa de tareas.
   * @param {Task[]} tasks
   */
  render(tasks) {
    this.#container.replaceChildren();

    if (tasks.length === 0) {
      this.#container.appendChild(this.#createEmptyMessage());
      return;
    }

    const fragment = document.createDocumentFragment();
    tasks.forEach((task) => fragment.appendChild(this.#createTaskElement(task)));
    this.#container.appendChild(fragment);
  }

  /**
   * Construye el elemento de una tarea usando createElement + textContent.
   * Antes se usaba innerHTML interpolando el texto del usuario, lo que abría la
   * puerta a inyección de HTML/JS (XSS). textContent lo evita por completo.
   * @param {Task} task
   * @returns {HTMLElement}
   */
  #createTaskElement(task) {
    const item = document.createElement('div');
    item.className = task.completed ? 'task-item completed' : 'task-item';

    const label = document.createElement('span');
    label.textContent = task.text;

    const buttons = document.createElement('div');
    buttons.className = 'task-buttons';
    buttons.appendChild(this.#createToggleButton(task));
    buttons.appendChild(this.#createDeleteButton(task));

    item.appendChild(label);
    item.appendChild(buttons);
    return item;
  }

  /**
   * @param {Task} task
   * @returns {HTMLButtonElement}
   */
  #createToggleButton(task) {
    const button = document.createElement('button');
    button.className = 'complete-btn';
    button.textContent = task.completed ? 'Reactivar' : 'Completar';
    button.addEventListener('click', () => this.#onToggle(task.id));
    return button;
  }

  /**
   * @param {Task} task
   * @returns {HTMLButtonElement}
   */
  #createDeleteButton(task) {
    const button = document.createElement('button');
    button.className = 'delete-btn';
    button.textContent = 'Eliminar';
    button.addEventListener('click', () => this.#onDelete(task.id));
    return button;
  }

  /** @returns {HTMLElement} */
  #createEmptyMessage() {
    const message = document.createElement('p');
    message.className = 'empty-message';
    message.textContent = 'No hay tareas para mostrar';
    return message;
  }
}
