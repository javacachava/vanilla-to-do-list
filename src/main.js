import './style.css';
import { LocalStorageTaskRepository } from './repositories/LocalStorageTaskRepository.js';
import { TaskService } from './services/TaskService.js';
import { TodoController } from './ui/TodoController.js';
import { getTodoElements } from './ui/domElements.js';

/**
 * Composition Root: único lugar donde se instancian y se "cablean" las
 * dependencias concretas de la aplicación.
 *
 * Aquí se ve el pago de DIP: para migrar la persistencia a otra tecnología
 * (por ejemplo InMemoryTaskRepository para pruebas, o un repositorio contra una
 * API REST) basta con cambiar la línea del repositorio. Ni TaskService ni el
 * controlador ni las vistas se enteran.
 */
function bootstrap() {
  const repository = new LocalStorageTaskRepository();
  const service = new TaskService(repository);
  const controller = new TodoController({ service, elements: getTodoElements() });
  controller.init();
}

document.addEventListener('DOMContentLoaded', bootstrap);
