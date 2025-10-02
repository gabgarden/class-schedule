import { ScheduleRepository } from '../../../repositories/schedule-repository';
import { ListSchedulesUseCase } from '../../../domain/usecases/schedule/list-schedules-uc';
import { ListSchedulesController } from '../../../controllers/schedule/list-schedules-controller';

export function ListSchedulesFactory() {
  const repository = new ScheduleRepository();
  const useCase = new ListSchedulesUseCase(repository);
  const controller = new ListSchedulesController(useCase);

  return controller;
}
