/**
 * Vista responsable de los botones de filtro (SRP).
 *
 * Gestiona qué botón se ve activo y avisa hacia afuera cuál filtro eligió el
 * usuario. Determina el filtro leyendo el atributo `data-filter` de cada botón,
 * en lugar de los índices fijos buttons[0]/[1]/[2] del código original, que
 * dependían del orden exacto del HTML y se rompían al reordenarlo.
 */
export class FilterView {
  /** @type {HTMLElement[]} */
  #buttons;
  /** @type {(filter: string) => void} */
  #onFilterChange;

  /**
   * @param {NodeListOf<HTMLElement> | HTMLElement[]} buttons
   * @param {object} handlers
   * @param {(filter: string) => void} handlers.onFilterChange
   */
  constructor(buttons, { onFilterChange }) {
    this.#buttons = Array.from(buttons);
    this.#onFilterChange = onFilterChange;
    this.#bindEvents();
  }

  #bindEvents() {
    this.#buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const { filter } = button.dataset;
        this.setActive(filter);
        this.#onFilterChange(filter);
      });
    });
  }

  /**
   * Marca como activo el botón cuyo data-filter coincide.
   * @param {string} filter
   */
  setActive(filter) {
    this.#buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === filter);
    });
  }
}
