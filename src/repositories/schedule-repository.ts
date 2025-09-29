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

  /*
  async findByField(
    field: keyof Schedule,
    value: any
  ): Promise<Schedule | null> {
    try {
      const result = await scheduleSchema
        .findOne({ [field]: value })
        .populate('teacher')
        .populate('classroom')
        .exec();
      if (!result) return null;

      const teacher = await this.teacherRe.findById(
        result.teacher._id.toString()
      );
      const classroom = await this.classroomRepo.findById(
        result.classroom._id.toString()
      );

      if (!teacher || !classroom) {
        throw new Error('Related teacher or classroom not found');
      }

      const schedule = new Schedule(
        teacher,
        classroom,
        result.scheduledDate,
        result.period,
        result.subject,
        result.description,
        result.maxStudents,
        result.isRecurring,
        result.recurrenceEndDate
      );

      return schedule;
    } catch (error) {
      console.error('Error finding schedule by field:', error);
      throw new Error('Failed to query schedule');
    }
  }
  
  */

  async findByField(): Promise<Schedule | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const updatedSchedule = await scheduleSchema
        .findByIdAndUpdate(id, data, { new: true })
        .populate('teacher')
        .populate('classroom')
        .exec();

      if (!updatedSchedule) {
        throw new Error('Schedule not found');
      }

      return updatedSchedule.toObject<Schedule>();
    } catch (error) {
      console.error('Error updating schedule in database:', error);
      throw new Error('Failed to update schedule');
    }
  }
}
