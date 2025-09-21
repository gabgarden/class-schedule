import { Types } from 'mongoose';
import { Teacher } from '../domain/entities/Teacher';
import { IRepository } from '../contracts/i-repository';
import teacherSchema from '../infra/schemas/teacher-schema';

export class TeacherRepository implements IRepository<Teacher, string> {
  async create(teacher: Teacher): Promise<Teacher> {
    try {
      const createdTeacher = await teacherSchema.create(teacher);
      return createdTeacher.toObject() as Teacher;
    } catch (error) {
      console.error('Error creating teacher in database:', error);
      throw new Error('Failed to create teacher');
    }
  }

  async findById(id: string): Promise<Teacher | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const teacher = await teacherSchema.findById(id).exec();
      return teacher ? (teacher.toObject() as Teacher) : null;
    } catch (error) {
      console.error('Error finding teacher by ID in database:', error);
      throw new Error('Failed to find teacher');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const result = await teacherSchema.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error('Error deleting teacher in database:', error);
      throw new Error('Failed to delete teacher');
    }
  }

  async list(): Promise<Teacher[]> {
    try {
      const teachers = await teacherSchema.find().exec();
      return teachers.map((teacher) => teacher.toObject() as Teacher);
    } catch (error) {
      console.error('Error listing teachers from database:', error);
      throw new Error('Failed to list teachers');
    }
  }
}
