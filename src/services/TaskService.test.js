import { describe, expect, it } from 'vitest';
import { FILTER_TYPES } from '../constants/filterTypes.js';
import { InMemoryTaskRepository } from '../repositories/InMemoryTaskRepository.js';
import { TaskService } from './TaskService.js';

function createService() {
  return new TaskService(new InMemoryTaskRepository());
}

describe('TaskService', () => {
  it('crea una tarea, elimina espacios externos y la persiste', () => {
    const service = createService();

    const task = service.addTask('  Estudiar SOLID  ');

    expect(task).toMatchObject({ id: 1, text: 'Estudiar SOLID', completed: false });
    expect(service.getTasks()).toHaveLength(1);
  });

  it('rechaza tareas vacías o compuestas solo por espacios', () => {
    const service = createService();

    expect(() => service.addTask('   ')).toThrow('El texto de la tarea no puede estar vacío');
    expect(service.getTasks()).toEqual([]);
  });

  it('asigna ids consecutivos aunque se elimine una tarea', () => {
    const service = createService();
    const firstTask = service.addTask('Primera');
    service.addTask('Segunda');
    service.deleteTask(firstTask.id);

    expect(service.addTask('Tercera').id).toBe(3);
  });

  it('alterna el estado de una tarea existente', () => {
    const service = createService();
    const task = service.addTask('Completar actividad');

    service.toggleTask(task.id);

    expect(service.getTasks()[0].completed).toBe(true);
  });

  it('ignora de forma segura el id que no existe', () => {
    const service = createService();
    service.addTask('Tarea existente');

    service.toggleTask(999);

    expect(service.getTasks()[0].completed).toBe(false);
  });

  it('elimina una tarea por id', () => {
    const service = createService();
    const firstTask = service.addTask('Eliminar');
    service.addTask('Conservar');

    service.deleteTask(firstTask.id);

    expect(service.getTasks().map((task) => task.text)).toEqual(['Conservar']);
  });

  it('filtra tareas activas y completadas mediante estrategias', () => {
    const service = createService();
    const completedTask = service.addTask('Terminada');
    service.addTask('Pendiente');
    service.toggleTask(completedTask.id);

    expect(service.getTasks(FILTER_TYPES.ACTIVE).map((task) => task.text)).toEqual(['Pendiente']);
    expect(service.getTasks(FILTER_TYPES.COMPLETED).map((task) => task.text)).toEqual(['Terminada']);
  });

  it('aplica el filtro general como alternativa segura a un filtro inválido', () => {
    const service = createService();
    service.addTask('Una tarea');

    expect(service.getTasks('desconocido')).toEqual(service.getTasks(FILTER_TYPES.ALL));
  });

  it('calcula estadísticas a partir del estado actual', () => {
    const service = createService();
    const completedTask = service.addTask('Completada');
    service.addTask('Activa');
    service.toggleTask(completedTask.id);

    expect(service.getStats()).toEqual({ total: 2, completed: 1, active: 1 });
  });
});
