import { CreateTeacherUseCase } from '../../../domain/usecases/teacher/create-teacher-uc';
import { CreateTeacherController } from '../../../controllers/teacher/create-teacher-controller';

import { TeacherRepository } from '../../../repositories/teacher-repository';

export function CreateTeacherFactory() {
  const repository = new TeacherRepository();
  const useCase = new CreateTeacherUseCase(repository);
  const controller = new CreateTeacherController(useCase);

  return controller;
}
