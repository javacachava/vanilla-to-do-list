# Refactorización — SOLID y Clean Code

Documento de decisiones de la refactorización del *to-do list* vanilla. Explica
qué olía mal en el código original y cómo cada cambio aplica un principio.

---

## 1. Diagnóstico del código original

Todo vivía en un único `src/main.js` (~177 líneas) que hacía **todo a la vez**:

| Code smell / deuda técnica | Dónde |
|---|---|
| Estado global mutable (`tasks`, `taskId`, `currentFilter`) | tope del archivo |
| Persistencia mezclada con lógica y con DOM | `addTask`, `toggleTask`, `deleteTask` |
| Duplicación: `localStorage.setItem(...)` repetido 4 veces | varias funciones |
| Duplicación: `renderTasks(); updateStats();` tras cada mutación | varias funciones |
| Cadenas `if/else if` para filtros | `renderTasks`, `filterTasks` |
| Índices mágicos `buttons[0/1/2]` atados al orden del HTML | `filterTasks` |
| *Magic strings* (`'tasks'`, `'all'`, `'active'`, `'completed'`) | en todos lados |
| Bucles `for` manuales en vez de métodos de array | `toggleTask`, `deleteTask`, `updateStats` |
| `==` / `!=` (comparación débil) | validación e igualdad de ids |
| `let` para valores que nunca se reasignan | en todos lados |
| `window.onload` / `.onclick` (sobrescriben handlers) | binding de eventos |
| `onkeypress` (evento obsoleto) | input de tarea |
| `innerHTML` interpolando texto del usuario → riesgo de **XSS** | `renderTasks` |
| Estilos inline dentro de strings de JS | mensaje de lista vacía |
| `alert()` bloqueante para validar | `addTask` |
| Sin manejo de errores en `JSON.parse` → un dato corrupto tumba la app | `window.onload` |
| Bug: `text == ''` deja pasar tareas de solo espacios | `addTask` |

---

## 2. Nueva estructura de carpetas (SRP a nivel de proyecto)

```
src/
├── main.js                  Composition root: cablea dependencias y arranca
├── constants/
│   ├── storageKeys.js       Claves de almacenamiento (sin magic strings)
│   └── filterTypes.js       Tipos de filtro válidos
├── models/
│   └── Task.js              Entidad Task (datos + comportamiento)
├── repositories/
│   ├── TaskRepository.js            Contrato de persistencia (interfaz)
│   ├── LocalStorageTaskRepository.js  Implementación con localStorage
│   └── InMemoryTaskRepository.js      Implementación en memoria (demuestra LSP)
├── filters/
│   └── filterStrategies.js  Estrategias de filtrado (demuestra OCP)
├── services/
│   └── TaskService.js       Lógica de negocio (SRP + DIP)
└── ui/
    ├── domElements.js       Selección centralizada del DOM
    ├── TaskListView.js      Renderiza la lista (SRP, sin XSS)
    ├── StatsView.js         Renderiza el resumen (SRP)
    ├── FilterView.js        Maneja botones de filtro (SRP)
    └── TodoController.js     Orquesta eventos ↔ servicio ↔ vistas
```

Las pruebas unitarias de reglas de negocio están en
`src/services/TaskService.test.js`; usan `InMemoryTaskRepository`, por lo que
no necesitan navegador ni modifican el `localStorage` real.

Cada archivo tiene **una sola razón para cambiar**.

---

## 3. Principios SOLID aplicados

### SRP — Single Responsibility Principle
El monolito se dividió por responsabilidad: `Task` (datos), `TaskRepository`
(persistencia), `TaskService` (reglas), `TaskListView` / `StatsView` /
`FilterView` (presentación) y `TodoController` (orquestación). Cambiar el
formato visual de una tarea ya no obliga a tocar la lógica de guardado, y
viceversa.

### OCP — Open/Closed Principle
Los filtros pasaron de un `if/else if` a un **registro de estrategias**
(`filterStrategies.js`). Agregar un filtro nuevo (p. ej. "vencidas") es añadir
una entrada al mapa; no se modifica `TaskService` ni el controlador. El sistema
queda abierto a extensión y cerrado a modificación.

### LSP — Liskov Substitution Principle
`LocalStorageTaskRepository` e `InMemoryTaskRepository` heredan del mismo
contrato `TaskRepository` y son **intercambiables**: `TaskService` funciona
idéntico con cualquiera. El smoke test lo comprueba usando la versión en
memoria. Ninguna subclase rompe expectativas del contrato.

### ISP — Interface Segregation Principle
`TaskRepository` expone **solo** `getAll()` y `saveAll()`: lo mínimo que las
capas superiores necesitan. No hay métodos de relleno que obliguen a las
implementaciones a cumplir cosas que no usan. Las vistas también reciben
interfaces angostas (callbacks puntuales `onToggle`, `onDelete`,
`onFilterChange`).

### DIP — Dependency Inversion Principle
`TaskService` depende de la **abstracción** `TaskRepository`, inyectada por
constructor, no de `localStorage`. `main.js` (composition root) es el único que
conoce las clases concretas. Migrar a una API REST o a IndexedDB sería crear un
nuevo repositorio y cambiar **una línea** en el bootstrap.

---

## 4. Clean Code aplicado

- **Nombres significativos**: `bootstrap`, `getFilterStrategy`, `#persist`,
  `#nextId`, `errorElement`.
- **Funciones pequeñas**: cada método hace una cosa; se extrajeron helpers como
  `#createTaskElement`, `#createToggleButton`, `#createEmptyMessage`.
- **Eliminación de duplicados**: la persistencia quedó en un único `#persist()`;
  el re-render en un único `#render()`.
- **Manejo de errores**: `JSON.parse` protegido con `try/catch`; validación de
  tarea vacía como excepción que el controlador decide cómo mostrar.
- **Sin efectos secundarios ocultos en la validación**: se quitó `alert()`; el
  error se muestra inline y accesible (`role="alert"`, `aria-live`).
- **Formateo consistente**: `const` por defecto, `===`/`!==`, métodos de array
  (`filter`, `find`, `map`, `reduce`, `forEach`) en vez de bucles manuales,
  `addEventListener` en vez de `on*`.
- **Seguridad**: `textContent` en lugar de `innerHTML` para el texto del usuario
  (elimina el vector de XSS).
- **Estado mutable reducido**: se eliminó el contador global `taskId`; el
  siguiente id se calcula desde la colección (`#nextId`), evitando
  desincronización.

---

## 5. Verificación

- `npm run build` compila la aplicación para producción.
- `npm test` ejecuta **9 pruebas unitarias** de `TaskService`: agregar,
  validar, asignar ids, completar, ignorar ids inexistentes, eliminar, filtrar,
  aplicar el *fallback* seguro y calcular estadísticas. Al usar el repositorio
  en memoria también verifica que la lógica no depende de `localStorage`.

---

## 6. Nota honesta sobre el tamaño

Para un to-do list, esta cantidad de capas es **más de la que exigiría un
proyecto real de este tamaño** — en producción uno arrancaría más plano y
extraería según crezca. Aquí la estructura granular es deliberada: el objetivo
de la actividad es que cada principio SOLID sea visible y señalable de forma
aislada. Es una decisión pedagógica, no una recomendación de sobre-ingeniería
por defecto.
