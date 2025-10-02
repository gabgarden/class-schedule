import { UpdateClassroomUseCase } from '../../../src/domain/usecases/classroom/update-classroom-uc';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IRepository } from '../../../src/contracts/i-repository';
import { NotFoundException } from '../../../src/exceptions/not-found-exception';

// ========================================
//        Mock Repository Correct
// ========================================

class MockClassroomRepository implements IRepository<Classroom, string> {
  private classrooms: { id: string; entity: Classroom }[] = [];
  public findByIdWasCalled = false;
  public updateWasCalled = false;
  public receivedUpdateData: Partial<Classroom> | null = null;

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  async create(entity: Classroom): Promise<Classroom> {
    const id = this.generateId();
    this.classrooms.push({ id, entity });
    return entity;
  }

  async findById(id: string): Promise<Classroom | null> {
    this.findByIdWasCalled = true;
    const found = this.classrooms.find((c) => c.id === id);
    return found ? found.entity : null;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    this.updateWasCalled = true;
    this.receivedUpdateData = data;

    const index = this.classrooms.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Should not happen');

    const current = this.classrooms[index].entity;
    const updated = { ...current, ...data } as Classroom;
    this.classrooms[index].entity = updated;
    return updated;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async list(): Promise<Classroom[]> {
    return this.classrooms.map((c) => c.entity);
  }

  reset() {
    this.classrooms = [];
    this.findByIdWasCalled = false;
    this.updateWasCalled = false;
    this.receivedUpdateData = null;
  }

  getFirstId(): string | null {
    return this.classrooms.length > 0 ? this.classrooms[0].id : null;
  }
}

// ========================================
//          Mock Repository Error
// ========================================
class MockClassroomRepositoryError implements IRepository<Classroom, string> {
  public findByIdWasCalled = false;
  public updateWasCalled = false;
  public errorToThrow = new Error('Database error');

  async create(entity: Classroom): Promise<Classroom> {
    return entity;
  }

  async findById(id: string): Promise<Classroom | null> {
    this.findByIdWasCalled = true;

    return new Classroom(1, 30);
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    this.updateWasCalled = true;
    throw this.errorToThrow;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async list(): Promise<Classroom[]> {
    return [];
  }
}

// ========================================
//                 Tests
// ========================================
describe('UpdateClassroomUseCase', () => {
  test('Should update a classroom successfully', async () => {
    // Arange
    const mockRepo = new MockClassroomRepository();
    const existing = new Classroom(101, 30);
    await mockRepo.create(existing);
    const id = mockRepo.getFirstId()!;
    const useCase = new UpdateClassroomUseCase(mockRepo);
    const updateData: Partial<Classroom> = { capacity: 35 };

    // Act
    const result = await useCase.perform(id, updateData);

    // Assert
    expect(result).toBeDefined();
    expect(result.classroomNumber).toBe(101);
    expect(result.capacity).toBe(35);
    expect(mockRepo.findByIdWasCalled).toBe(true);
    expect(mockRepo.updateWasCalled).toBe(true);
    expect(mockRepo.receivedUpdateData).toEqual(updateData);
  });

  test('Should throw NotFoundException if classroom does not exist', async () => {
    // Arange
    const mockRepo = new MockClassroomRepository();
    const useCase = new UpdateClassroomUseCase(mockRepo);
    const updateData: Partial<Classroom> = { capacity: 35 };

    // Act and Assert
    await expect(useCase.perform('noExistId', updateData)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepo.findByIdWasCalled).toBe(true);
    expect(mockRepo.updateWasCalled).toBe(false);
  });

  test('Should throw error if repository fails on update', async () => {
    // Arange
    const mockRepoError = new MockClassroomRepositoryError();
    const useCase = new UpdateClassroomUseCase(mockRepoError);
    const updateData: Partial<Classroom> = { capacity: 35 };

    // Act and Assert
    await expect(useCase.perform('k5sd4', updateData)).rejects.toThrow(
      'Database error'
    );

    expect(mockRepoError.findByIdWasCalled).toBe(true);
    expect(mockRepoError.updateWasCalled).toBe(true);
  });
});
