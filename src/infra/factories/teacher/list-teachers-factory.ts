import { ListTeachersUseCase } from '../../../domain/usecases/teacher-uc/list-teachers-uc';
import { TeacherRepository } from '../../../repositories/teacher-repository';
import { ListTeachersController } from '../../../controllers/teacher/list-teachers-controller';

export function ListTeachersFactory() {
  const repository = new TeacherRepository();
  const useCase = new ListTeachersUseCase(repository);
  const controller = new ListTeachersController(useCase);

  return controller;
}
