import { ListTeachersUseCase } from '../../../src/domain/usecases/teacher/list-teachers-uc';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { IRepository } from '../../../src/contracts/i-repository';

// ========================================
//       Mock Repository Correct
// ========================================
class MockTeacherRepository implements IRepository<Teacher, string> {
  private teachers: Teacher[] = [];
  public listWasCalled = false;

  async list(): Promise<Teacher[]> {
    this.listWasCalled = true;
    return [...this.teachers];
  }

  async create(entity: Teacher): Promise<Teacher> { 
    return entity; 
  }
  
  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> { 
    return null; 
  }

  async findById(id: string): Promise<Teacher | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> { 
    return new Teacher('', '', []); 
  }

  async delete(id: string): Promise<boolean> { 
    return true; 
  }

  reset() {
    this.teachers = [];
    this.listWasCalled = false;
  }
}

// ========================================
//         Mock Repository Null
// ========================================
class MockTeacherRepositoryNull implements IRepository<Teacher, string> {
  public listWasCalled = false;

  async list(): Promise<Teacher[]> {
    this.listWasCalled = true;
    return null as any;
  }

  async create(entity: Teacher): Promise<Teacher> { 
    return entity; 
  }

  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> { 
    return null; 
  }

  async findById(id: string): Promise<Teacher | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> { 
    return new Teacher('', '', []); 
  }

  async delete(id: string): Promise<boolean> { 
    return true; 
  }
}

// ========================================
//        Mock Repository Error
// ========================================
class MockTeacherRepositoryError implements IRepository<Teacher, string> {
  public listWasCalled = false;
  public errorToThrow = new Error('Database error');

  async list(): Promise<Teacher[]> {
    this.listWasCalled = true;
    throw this.errorToThrow;
  }

  async create(entity: Teacher): Promise<Teacher> { 
    return entity; 
  }

  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> { 
    return null; 
  }

  async findById(id: string): Promise<Teacher | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> { 
    return new Teacher('', '', []); 
  }

  async delete(id: string): Promise<boolean> { 
    return true; 
  }
}

// ========================================
//            Tests
// ========================================
describe('ListTeachersUseCase', () => {

  test('Should list all teachers successfully', async () => {

    // Arrange
    const mockRepo = new MockTeacherRepository();
    const teacher1 = new Teacher('teach1', 'Maria', []);
    const teacher2 = new Teacher('teahc2', 'Marcos', []);
    (mockRepo as any).teachers.push(teacher1, teacher2);
    const useCase = new ListTeachersUseCase(mockRepo);

    // Act
    const result = await useCase.perform();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([teacher1, teacher2]);
    expect(mockRepo.listWasCalled).toBe(true);
  });

  test('Should return empty array if repository returns null', async () => {
    //Arrange
    const fakeRepoNull= new MockTeacherRepositoryNull();
    const useCase = new ListTeachersUseCase(fakeRepoNull);

    // Act
    const result = await useCase.perform();

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(fakeRepoNull.listWasCalled).toBe(true);
  });

  test('Should throw error if repository fails on list', async () => {

    // Arrange
    const fakeRepoError = new MockTeacherRepositoryError();
    const useCase = new ListTeachersUseCase(fakeRepoError);

    // Act and Assert
    await expect(useCase.perform()).rejects.toThrow('Database error');
    expect(fakeRepoError.listWasCalled).toBe(true);
  });
});
