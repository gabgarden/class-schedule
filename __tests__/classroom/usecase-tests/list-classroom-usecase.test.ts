import { ListClassroomsUseCase } from '../../../src/domain/usecases/classroom/list-classrooms-us';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IRepository } from '../../../src/contracts/i-repository';

// ========================================
//         Mock Repository Correct
// ========================================

class MockClassroomRepository implements IRepository<Classroom, string> {
  private classrooms: Classroom[] = [];
  public listWasCalled = false;

  async list(): Promise<Classroom[]> {
    this.listWasCalled = true;
    return [...this.classrooms];
  }

  async create(entity: Classroom): Promise<Classroom> {
    return {} as any;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async findById(id: string): Promise<Classroom | null> {
    return null;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async delete(id: string): Promise<boolean> {
    return false;
  }

  reset() {
    this.classrooms = [];
    this.listWasCalled = false;
  }
}

// ========================================
//          Mock Repository Error
// ========================================

class MockClassroomRepositoryError implements IRepository<Classroom, string> {
  public listWasCalled = false;
  public errorToThrow = new Error('Database error');

  async list(): Promise<Classroom[]> {
    this.listWasCalled = true;
    throw this.errorToThrow;
  }

  async create(entity: Classroom): Promise<Classroom> {
    return {} as any;
  }

  async findByField(
    field: keyof Classroom,
    value: any
  ): Promise<Classroom | null> {
    return null;
  }

  async findById(id: string): Promise<Classroom | null> {
    return null;
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    return {} as any;
  }

  async delete(id: string): Promise<boolean> {
    return false;
  }
}

// ========================================
//            Tests
// ========================================

describe('ListClassroomsUseCase', () => {
  // ========================================
  //             Success Test
  // ========================================

  test('Should list all classrooms successfully', async () => {
    // Arrange
    const mockRepo = new MockClassroomRepository();
    const classroom1 = new Classroom(101, 30);
    const classroom2 = new Classroom(102, 25);
    (mockRepo as any).classrooms.push(classroom1, classroom2);
    const useCase = new ListClassroomsUseCase(mockRepo);

    // Act
    const result = await useCase.perform();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([classroom1, classroom2]);
    expect(mockRepo.listWasCalled).toBe(true);
  });

  // ========================================
  //          Internal Error Test
  // ========================================

  test('Should throw error if repository fails on list', async () => {
    // Arrange
    const mockRepoError = new MockClassroomRepositoryError();
    const useCase = new ListClassroomsUseCase(mockRepoError);

    // Act and Assert
    await expect(useCase.perform()).rejects.toThrow('Database error');
    expect(mockRepoError.listWasCalled).toBe(true);
  });
});
