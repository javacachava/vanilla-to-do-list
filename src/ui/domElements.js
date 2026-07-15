/**
 * Punto único donde se seleccionan los elementos del DOM que usa la app.
 *
 * Centralizar los selectores evita tener getElementById/querySelector regados
 * por toda la lógica (como en el main.js original) y deja un solo lugar que
 * cambiar si cambia el HTML.
 *
 * @returns {{
 *   input: HTMLInputElement,
 *   addButton: HTMLElement,
 *   taskList: HTMLElement,
 *   stats: HTMLElement,
 *   errorElement: HTMLElement,
 *   filterButtons: NodeListOf<HTMLElement>
 * }}
 */
export function getTodoElements() {
  return {
    input: document.getElementById('taskInput'),
    addButton: document.getElementById('addBtn'),
    taskList: document.getElementById('taskList'),
    stats: document.getElementById('stats'),
    errorElement: document.getElementById('error'),
    filterButtons: document.querySelectorAll('.filter-btn'),
  };
}
