import scheduleSchema from '../../infra/schemas/schedule-schema';
import { CreateScheduleDTO } from '../dtos/create-schedule-dto';
import { IScheduleDomainService } from '../../contracts/i-schedule-domain-service';

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
      throw new Error('Teacher is already scheduled for this date and period');
    }

    const classroomConflict = await this.existsClassroomConflict(dto);
    if (classroomConflict) {
      throw new Error(
        'Classroom is already scheduled for this date and period'
      );
    }
  }
}
