import { CreateTeacherUseCase } from '../../../domain/usecases/teacher/create-teacher-uc';
import { CreateTeacherController } from '../../../controllers/teacher/create-teacher-controller';

import { TeacherRepository } from '../../../repositories/teacher-repository';
import { ValidationService } from '../../../domain/services/validation-service';

export function CreateTeacherFactory() {
  const repository = new TeacherRepository();
  const validationService = new ValidationService();
  const useCase = new CreateTeacherUseCase(repository);
  const controller = new CreateTeacherController(useCase, validationService);

  return controller;
}
