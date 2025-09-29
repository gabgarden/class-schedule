import { CreateClassroomController } from '../../../controllers/classroom/create-clasroom-controller';
import { ValidationService } from '../../../domain/services/validation-service';
import { CreateClassroomUseCase } from '../../../domain/usecases/clasroom/create-clasroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function CreateClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new CreateClassroomUseCase(repository);
  const validationService = new ValidationService();
  const controller = new CreateClassroomController(useCase, validationService);

  return controller;
}
