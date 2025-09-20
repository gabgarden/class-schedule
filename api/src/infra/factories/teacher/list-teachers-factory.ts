import { List } from './../../../../node_modules/mongodb/src/utils';
import { ListTeachersUseCase } from '../../../domain/usecases/teacher-uc/list-teachers-uc';
import { TeacherRepository } from '../../../repositories/teacher-repository';
import { ListTeacherController } from '../../../controllers/teacher/list-teacher-controller';

export function ListTeachersFactory() {
  const repository = new TeacherRepository();
  const useCase = new ListTeachersUseCase(repository);
  const controller = new ListTeacherController(useCase);

  return controller;
}
