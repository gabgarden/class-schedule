import { ListClassroomsController } from '../../../controllers/classroom/list-classrooms-controller';
import { ListClassroomsUseCase } from '../../../domain/usecases/clasroom/list-classrooms-us';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function ListClassroomsFactory() {
  const repository = new ClassroomRepository();
  const useCase = new ListClassroomsUseCase(repository);
  const controller = new ListClassroomsController(useCase);
  return controller;
}
