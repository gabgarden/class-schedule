import { CreateClasroomController } from '../../../controllers/classroom/create-clasroom-controller';
import { CreateClassroomUseCase } from '../../../domain/usecases/clasroom/create-clasroom-uc';
import { ClassroomRepository } from '../../../repositories/classroom-repository';

export function CreateClassroomFactory() {
  const repository = new ClassroomRepository();
  const useCase = new CreateClassroomUseCase(repository);
  const controller = new CreateClasroomController(useCase);

  return controller;
}
