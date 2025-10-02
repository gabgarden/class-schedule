import { FindByIdClassroomController } from '../../../controllers/classroom/find-byid-classroom-controller';
import { ValidationService } from '../../../domain/services/validation-service';
import { FindByIdClassroomUseCase } from '../../../domain/usecases/classroom/find-byid-classroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function FindByIdClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new FindByIdClassroomUseCase(repository);
  const validationService = new ValidationService();
  const controller = new FindByIdClassroomController(
    useCase,
    validationService
  );

  return controller;
}
