import { UpdateClassroomController } from '../../../controllers/classroom/update-classroom-controller';
import { ValidationService } from '../../../domain/services/validation-service';
import { UpdateClassroomUseCase } from '../../../domain/usecases/classroom/update-classroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function UpdateClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new UpdateClassroomUseCase(repository);
  const validationService = new ValidationService();
  const controller = new UpdateClassroomController(useCase, validationService);

  return controller;
}
