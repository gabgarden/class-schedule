import { Schedule } from '../../entities/Schedule';
import { Teacher } from '../../entities/Teacher';
import { Classroom } from '../../entities/Classroom';
import { ScheduleStatus } from '../../enums/schedule-status-enum';
import { CreateScheduleDTO } from '../../dtos/schedule/create-schedule-dto';
import { IRepository } from '../../../contracts/i-repository';
import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IScheduleDomainService } from '../../../contracts/i-schedule-domain-service';

export class CreateScheduleUseCase
  implements ICommandUseCase<CreateScheduleDTO, Schedule>
{
  private readonly scheduleRepository: IRepository<Schedule, string>;
  private readonly teacherRepository: IRepository<Teacher, string>;
  private readonly classroomRepository: IRepository<Classroom, string>;
  private readonly scheduleDomainService: IScheduleDomainService;
  constructor(
    scheduleRepository: IRepository<Schedule, string>,
    teacherRepository: IRepository<Teacher, string>,
    classroomRepository: IRepository<Classroom, string>,
    scheduleDomainService: IScheduleDomainService
  ) {
    this.scheduleRepository = scheduleRepository;
    this.teacherRepository = teacherRepository;
    this.classroomRepository = classroomRepository;
    this.scheduleDomainService = scheduleDomainService;
  }

  async perform(dto: CreateScheduleDTO): Promise<Schedule> {
    // CREATE DATE OBJECTS
    const scheduledDate = new Date(dto.scheduledDate);

    let recurrenceEndDate: Date | undefined;
    if (dto.recurrenceEndDate && dto.recurrenceEndDate.trim() !== '') {
      recurrenceEndDate = new Date(dto.recurrenceEndDate);
    }

    // BUSINESS LOGIC
    // MAKE SURE TEACHER EXISTS
    const teacher = await this.teacherRepository.findById(dto.teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // MAKE SURE CLASSROOM EXISTS
    const classroom = await this.classroomRepository.findById(dto.classroomId);
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    if (scheduledDate < new Date()) {
      throw new Error('Scheduled date cannot be in the past');
    }

    // IF RECURRING, RECURRENCE END DATE MUST BE PROVIDED
    if (dto.isRecurring && !recurrenceEndDate) {
      throw new Error(
        'Recurrence end date required when schedule is recurring'
      );
    }

    // IF RECURRENCE END DATE IS PROVIDED, IT MUST BE AFTER SCHEDULED DATE
    if (recurrenceEndDate && recurrenceEndDate <= scheduledDate) {
      throw new Error('Recurrence end date must be after scheduled date');
    }

    // CHECK FOR CONFLICTS
    await this.scheduleDomainService.checkConflicts(dto);

    const schedule = new Schedule(
      teacher,
      classroom,
      scheduledDate,
      dto.period,
      dto.subject,
      ScheduleStatus.ACTIVE,
      dto.isRecurring,
      dto.description,
      dto.maxStudents,
      recurrenceEndDate
    );

    return await this.scheduleRepository.create(schedule);
  }
}
