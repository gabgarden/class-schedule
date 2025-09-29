import { DeleteClassroomController } from '../../../controllers/classroom/delete-classroom-controller';
import { ValidationService } from '../../../domain/services/validation-service';
import { DeleteClassroomUseCase } from '../../../domain/usecases/clasroom/delete-classroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function DeleteClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new DeleteClassroomUseCase(repository);
  const validationService = new ValidationService();
  const controller = new DeleteClassroomController(useCase, validationService);

  return controller;
}
