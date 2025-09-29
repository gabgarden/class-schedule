import scheduleSchema from '../../infra/schemas/schedule-schema';
import { CreateScheduleDTO } from '../dtos/schedule/create-schedule-dto';
import { IScheduleDomainService } from '../../contracts/i-schedule-domain-service';
import { ScheduleConflictException } from '../../exceptions/schedule-conflict-exception';

export class ScheduleDomainService implements IScheduleDomainService {
  private async existsTeacherConflict(
    dto: CreateScheduleDTO
  ): Promise<boolean> {
    const conflict = await scheduleSchema.exists({
      teacher: dto.teacherId,
      scheduledDate: new Date(dto.scheduledDate),
      period: dto.period,
    });
    return Boolean(conflict);
  }

  private async existsClassroomConflict(
    dto: CreateScheduleDTO
  ): Promise<boolean> {
    const conflict = await scheduleSchema.exists({
      classroom: dto.classroomId,
      scheduledDate: new Date(dto.scheduledDate),
      period: dto.period,
    });
    return Boolean(conflict);
  }

  async checkConflicts(dto: CreateScheduleDTO): Promise<void> {
    const teacherConflict = await this.existsTeacherConflict(dto);
    if (teacherConflict) {
      throw new ScheduleConflictException(
        'Teacher is already scheduled for this date and period',
        'TEACHER_CONFLICT',
        {
          entityType: 'teacher',
          entityId: dto.teacherId,
          conflictDate: dto.scheduledDate,
          conflictPeriod: dto.period,
        }
      );
    }

    const classroomConflict = await this.existsClassroomConflict(dto);
    if (classroomConflict) {
      throw new ScheduleConflictException(
        'Classroom is already booked for this date and period',
        'CLASSROOM_CONFLICT',
        {
          entityType: 'classroom',
          entityId: dto.classroomId,
          conflictDate: dto.scheduledDate,
          conflictPeriod: dto.period,
        }
      );
    }
  }
}
