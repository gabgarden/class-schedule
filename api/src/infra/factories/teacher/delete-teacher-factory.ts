import { DeleteTeacherController } from '../../../controllers/teacher/delete-teacher-controller';
import { DeleteTeacherUseCase } from '../../../domain/usecases/teacher-uc/delete-teacher-uc';
import { TeacherRepository } from '../../../repositories/teacher-repository';

export function DeleteTeacherFactory() {
  const repository = new TeacherRepository();
  const useCase = new DeleteTeacherUseCase(repository);
  const controller = new DeleteTeacherController(useCase);

  return controller;
}
