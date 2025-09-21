import { DeleteClasssroomController } from '../../../controllers/classroom/delete-classroom-controller';
import { DeleteClassroomUseCase } from '../../../domain/usecases/clasroom/delete-classroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function DeleteClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new DeleteClassroomUseCase(repository);
  const controller = new DeleteClasssroomController(useCase);

  return controller;
}
