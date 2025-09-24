import { Schedule } from '../../entities/Schedule';
import { Teacher } from '../../entities/Teacher';
import { Classroom } from '../../entities/Classroom';
import { ScheduleStatus } from '../../enums/schedule-status-enum';
import { CreateScheduleDTO } from '../../dtos/create-schedule-dto';
import { IRepository } from '../../../contracts/i-repository';
import { ICommandUseCase } from '../../../contracts/i-command-uc';

export class CreateScheduleUseCase
  implements ICommandUseCase<CreateScheduleDTO, Schedule>
{
  private readonly scheduleRepository: IRepository<Schedule, string>;
  private readonly teacherRepository: IRepository<Teacher, string>;
  private readonly classroomRepository: IRepository<Classroom, string>;
  constructor(
    scheduleRepository: IRepository<Schedule, string>,
    teacherRepository: IRepository<Teacher, string>,
    classroomRepository: IRepository<Classroom, string>
  ) {
    this.scheduleRepository = scheduleRepository;
    this.teacherRepository = teacherRepository;
    this.classroomRepository = classroomRepository;
  }

  async perform(dto: CreateScheduleDTO): Promise<Schedule> {
    //BUSINESS LOGIC

    //MAKE SURE TEACHER EXISTS
    const teacher = await this.teacherRepository.findById(dto.teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    //MAKE SURE CLASSROOM EXISTS
    const classroom = await this.classroomRepository.findById(dto.classroomId);
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    //CREATE DATE OBJECT
    const scheduledDate = new Date(dto.scheduledDate);

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
      dto.recurrenceEndDate
    );

    return await this.scheduleRepository.create(schedule);
  }
}
