import { DeleteClassroomUseCase } from '../../../src/domain/usecases/classroom/delete-classroom-uc';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IRepository } from '../../../src/contracts/i-repository';
import { NotFoundException } from '../../../src/exceptions/not-found-exception';

// ========================================
//         Mock Repository Correct
// ========================================

class MockClassroomRepository implements IRepository<Classroom, string> {
  private classrooms: { id: string; entity: Classroom }[] = [];
  public deleteWasCalled = false;
  public findByIdWasCalled = false;
  public receivedId: string | null = null;

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  async findById(id: string): Promise<Classroom | null> {
    this.findByIdWasCalled = true;
    this.receivedId = id;
    const found = this.classrooms.find((c) => c.id === id);
    return found ? found.entity : null;
  }

  async delete(id: string): Promise<boolean> {
    this.deleteWasCalled = true;
    const before = this.classrooms.length;
    this.classrooms = this.classrooms.filter((c) => c.id !== id);
    return this.classrooms.length < before;
  }

  async create(entity: Classroom): Promise<Classroom> {
    const id = this.generateId();
    this.classrooms.push({ id, entity });
    return entity;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return {} as any;
  }

  async list(): Promise<Classroom[]> {
    return this.classrooms.map((c) => c.entity);
  }

  reset() {
    this.classrooms = [];
    this.deleteWasCalled = false;
    this.findByIdWasCalled = false;
    this.receivedId = null;
  }

  getFirstId(): string | null {
    return this.classrooms.length > 0 ? this.classrooms[0].id : null;
  }
}

// ========================================
//          Mock Repository Error
// ========================================

class MockClassroomRepositoryError implements IRepository<Classroom, string> {
  public deleteWasCalled = false;
  public errorToThrow = new Error('Database error');

  async findById(id: string): Promise<Classroom | null> {
    return new Classroom(101, 30);
  }

  async delete(id: string): Promise<boolean> {
    this.deleteWasCalled = true;
    throw this.errorToThrow;
  }

  async create(entity: Classroom): Promise<Classroom> {
    return {} as any;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async list(): Promise<Classroom[]> {
    return {} as any;
  }
}

// ========================================
//                Tests
// ========================================

describe('DeleteClassroomUseCase', () => {
  test('Should delete a classroom successfully', async () => {
    // Arrange
    const mockRepo = new MockClassroomRepository();
    const existingClassroom = new Classroom(101, 30);
    await mockRepo.create(existingClassroom);
    const useCase = new DeleteClassroomUseCase(mockRepo);
    const id = mockRepo.getFirstId()!;

    // Act
    const result = await useCase.perform(id);

    // Assert
    expect(result).toBeUndefined();
    expect(mockRepo.findByIdWasCalled).toBe(true);
    expect(mockRepo.deleteWasCalled).toBe(true);
    expect(await mockRepo.list()).toHaveLength(0);
  });

  test('Should throw NotFoundException if classroom does not exist', async () => {
    //Arange
    const mockRepo = new MockClassroomRepository();
    const useCase = new DeleteClassroomUseCase(mockRepo);

    // Act and Assert
    await expect(useCase.perform('nonExistentId')).rejects.toThrow(
      NotFoundException
    );
    expect(mockRepo.findByIdWasCalled).toBe(true);
    expect(mockRepo.deleteWasCalled).toBe(false);
  });

  test('Should throw error if repository fails on delete', async () => {
    // Arange
    const mockRepoError = new MockClassroomRepositoryError();
    const useCase = new DeleteClassroomUseCase(mockRepoError);

    // Act and assert
    await expect(useCase.perform('5s4d5')).rejects.toThrow('Database error');
    expect(mockRepoError.deleteWasCalled).toBe(true);
  });
});
