import { IRepository } from '../contracts/i-repository';
import { Classroom } from '../domain/entities/Classroom';
import classroomSchema from '../infra/schemas/classroom-schema';

export class ClassroomRepository implements IRepository<Classroom, string> {
  async create(classroom: Classroom): Promise<Classroom> {
    try {
      const createdClassroom = await classroomSchema.create(classroom);
      return createdClassroom.toObject();
    } catch (error) {
      console.error('Error creating classroom in database:', error);
      throw new Error('Failed to create classroom');
    }
  }

  async findById(id: string): Promise<Classroom | null> {
    try {
      const classroom = await classroomSchema.findById(id).exec();
      return classroom ? (classroom.toObject() as Classroom) : null;
    } catch (error) {
      console.error('Error finding classroom by ID in database:', error);
      throw new Error('Failed to find classroom');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await classroomSchema.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error('Error deleting classroom in database:', error);
      throw new Error('Failed to delete classroom');
    }
  }

  async list(): Promise<Classroom[]> {
    try {
      const classrooms = await classroomSchema.find().exec();
      return classrooms.map((classroom) => classroom.toObject() as Classroom);
    } catch (error) {
      console.error('Error listing classrooms from database:', error);
      throw new Error('Failed to list classrooms');
    }
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    try {
      const result = await classroomSchema.findOne({ [field]: value }).lean();
      return result ? (result as Classroom) : null;
    } catch (error) {
      console.error('Error finding classroom by field:', error);
      throw new Error('Failed to query classroom');
    }
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    try {
      const updatedClassroom = await classroomSchema.findByIdAndUpdate(
        id,
        data
      );
      return updatedClassroom
        ? (updatedClassroom.toObject() as Classroom)
        : ({} as Classroom);
    } catch (error) {
      console.error('Error updating classroom in database:', error);
      throw new Error('Failed to update classroom');
    }
  }
}
