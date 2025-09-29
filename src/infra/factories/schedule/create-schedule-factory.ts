import { ClassroomRepository } from './../../../repositories/classroom-repository';
import { TeacherRepository } from './../../../repositories/teacher-repository';
import { ScheduleRepository } from './../../../repositories/schedule-repository';
import { CreateScheduleUseCase } from '../../../domain/usecases/schedule/create-schedule-uc';
import { CreateScheduleController } from '../../../controllers/schedule/create-schedule-controller';
import { ScheduleDomainService } from '../../../domain/services/schedule-domain-service';

export function CreateScheduleFactory() {
  const scheduleRepository = new ScheduleRepository();
  const teacherRepository = new TeacherRepository();
  const classroomRepository = new ClassroomRepository();
  const scheduleDomainService = new ScheduleDomainService();

  const useCase = new CreateScheduleUseCase(
    scheduleRepository,
    teacherRepository,
    classroomRepository,
    scheduleDomainService
  );
  const controller = new CreateScheduleController(useCase);

  return controller;
}
