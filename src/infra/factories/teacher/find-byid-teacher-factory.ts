import { FindByIdClassroomController } from '../../../controllers/classroom/find-byid-classroom-controller';
import { FindByIdTeacherController } from '../../../controllers/teacher/find-byid-teacher-controller';
import { ValidationService } from '../../../domain/services/validation-service';
import { FindByIdTeacherUseCase } from '../../../domain/usecases/teacher/find-byid-teacher-uc';
import { TeacherRepository } from '../../../repositories/teacher-repository';

export function FindByIdTeacherFactory() {
  const repository = new TeacherRepository();
  const useCase = new FindByIdTeacherUseCase(repository);
  const validationService = new ValidationService();
  const controller = new FindByIdTeacherController(useCase, validationService);

  return controller;
}
