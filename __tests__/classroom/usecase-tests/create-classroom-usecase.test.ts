import { CreateClassroomUseCase } from '../../../src/domain/usecases/classroom/create-clasroom-uc';
import { CreateClassroomDTO } from '../../../src/domain/dtos/classroom/create-classroom-dto';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IRepository } from '../../../src/contracts/i-repository';

// ========================================
//        Mock Repository Correct
// ========================================

class MockClassroomRepository implements IRepository<Classroom, string> {
  private classrooms: Classroom[] = [];
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public createWasCalled = false;
  public findByFieldWasCalled = false;
  public receivedCreate: Classroom | null = null;
  public receivedFindField: { field: string; value: any } | null = null;

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    this.findByFieldWasCalled = true;
    this.receivedFindField = { field: field as string, value };
    return this.classrooms.find((c) => c[field] === value) || null;
  }

  async create(entity: Classroom): Promise<Classroom> {
    this.createWasCalled = true;
    this.receivedCreate = entity;

    if (this.shouldFail && this.errorToThrow) throw this.errorToThrow;

    this.classrooms.push(entity);
    return entity;
  }

  async findById(id: string): Promise<Classroom | null> {
    return {} as any;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async delete(id: string): Promise<boolean> {
    return false;
  }

  async list(): Promise<Classroom[]> {
    return {} as any;
  }

  reset() {
    this.classrooms = [];
    this.shouldFail = false;
    this.errorToThrow = null;
    this.createWasCalled = false;
    this.findByFieldWasCalled = false;
    this.receivedCreate = null;
    this.receivedFindField = null;
  }
}

// ========================================
//         Mock Repository Error
// ========================================

class MockClassroomRepositoryError implements IRepository<Classroom, string> {
  public createWasCalled = false;
  public errorToThrow = new Error('Database error');

  async create(entity: Classroom): Promise<Classroom> {
    this.createWasCalled = true;
    throw this.errorToThrow;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async findById(id: string): Promise<Classroom | null> {
    return {} as any;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async delete(id: string): Promise<boolean> {
    return false;
  }

  async list(): Promise<Classroom[]> {
    return {} as any;
  }
}

// ========================================
//                  Tests
// ========================================

describe('CreateClassroomUseCase', () => {
  // ========================================
  //              Success Test
  // ========================================

  test('Should create a classroom successfully', async () => {
    // Arrange
    const mockRepo = new MockClassroomRepository();
    const useCase = new CreateClassroomUseCase(mockRepo);
    const dto: CreateClassroomDTO = { classroomNumber: 101, capacity: 30 };

    // Act
    const result = await useCase.perform(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.classroomNumber).toBe(101);
    expect(result.capacity).toBe(30);
    expect(mockRepo.findByFieldWasCalled).toBe(true);
    expect(mockRepo.createWasCalled).toBe(true);
    expect(mockRepo.receivedCreate).toEqual(result);
  });

  // ========================================
  //             Validation Error
  // ========================================

  test('Should throw error if classroom number already exists', async () => {
    // Arrange
    const mockRepo = new MockClassroomRepository();
    const useCase = new CreateClassroomUseCase(mockRepo);
    const existingClassroom = new Classroom(102, 25);
    await (mockRepo as any).classrooms.push(existingClassroom);
    const dto: CreateClassroomDTO = { classroomNumber: 102, capacity: 30 };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow(
      'Classroom number 102 already exists'
    );
    expect(mockRepo.findByFieldWasCalled).toBe(true);
    expect(mockRepo.createWasCalled).toBe(false);
  });

  // ========================================
  //           Internal Error Test
  // ========================================

  test('Should throw error if repository fails on create', async () => {
    // Arrange
    const mockRepoError = new MockClassroomRepositoryError();
    const useCase = new CreateClassroomUseCase(mockRepoError);
    const dto: CreateClassroomDTO = { classroomNumber: 103, capacity: 20 };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow('Database error');
    expect(mockRepoError.createWasCalled).toBe(true);
  });
});
