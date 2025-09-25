import { Types } from 'mongoose';
import { IRepository } from '../contracts/i-repository';
import { Schedule } from '../domain/entities/Schedule';
import scheduleSchema from '../infra/schemas/schedule-schema';

export class ScheduleRepository implements IRepository<Schedule, string> {
  async create(schedule: Schedule): Promise<Schedule> {
    try {
      const createdSchedule = await scheduleSchema.create(schedule);

      const populatedSchedule = await createdSchedule.populate([
        { path: 'teacher' },
        { path: 'classroom' },
      ]);

      return populatedSchedule.toObject<Schedule>();
    } catch (error) {
      console.error('Error creating schedule in database:', error);
      throw new Error('Failed to create schedule');
    }
  }

  async findById(id: string): Promise<Schedule | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const schedule = await scheduleSchema
        .findById(id)
        .populate('teacher')
        .populate('classroom')
        .exec();

      return schedule ? schedule.toObject<Schedule>() : null;
    } catch (error) {
      console.error(`Error finding schedule by ID (${id}):`, error);
      throw new Error('Failed to find schedule');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const result = await scheduleSchema.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error('Error deleting schedule in database:', error);
      throw new Error('Failed to delete schedule');
    }
  }

  async list(): Promise<Schedule[]> {
    try {
      const schedules = await scheduleSchema
        .find()
        .populate('teacher')
        .populate('classroom')
        .sort({ scheduledDate: 1, period: 1 })
        .exec();

      return schedules.map((schedule) => schedule.toObject<Schedule>());
    } catch (error) {
      console.error('Error listing schedules from database:', error);
      throw new Error('Failed to list schedules');
    }
  }

  async existsTeacherConflict(
    teacherId: string,
    scheduledDate: Date,
    period: string
  ): Promise<boolean> {
    const conflict = await scheduleSchema.exists({
      teacher: teacherId,
      scheduledDate,
      period,
    });
    return Boolean(conflict);
  }

  async existsClassroomConflict(
    classroomId: string,
    scheduledDate: Date,
    period: string
  ): Promise<boolean> {
    const conflict = await scheduleSchema.exists({
      classroom: classroomId,
      scheduledDate,
      period,
    });
    return Boolean(conflict);
  }
}
