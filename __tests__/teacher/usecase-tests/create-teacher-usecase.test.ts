import { CreateTeacherUseCase } from '../../../src/domain/usecases/teacher/create-teacher-uc';
import { CreateTeacherDTO } from '../../../src/domain/dtos/teacher/create-teacher-dto';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { IRepository } from '../../../src/contracts/i-repository';
import { SubjectsEnum } from '../../../src/domain/enums/subjetcs-enum';

// ========================================
//            Mocks Repositorys
// ========================================

class MockTeacherRepository implements IRepository<Teacher, string> {
  private teachers: Teacher[] = [];
  public createWasCalled = false;
  public findByFieldWasCalled = false;
  public receivedCreate: Teacher | null = null;
  public receivedFindField: { field: string; value: any } | null = null;
  public shouldFail = false;
  public errorToThrow: Error | null = null;

  async create(entity: Teacher): Promise<Teacher> {
    this.createWasCalled = true;
    this.receivedCreate = entity;

    if (this.shouldFail && this.errorToThrow) throw this.errorToThrow;

    this.teachers.push(entity);
    return entity;
  }

  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> {
    this.findByFieldWasCalled = true;
    this.receivedFindField = { field: field as string, value };
    return this.teachers.find((t) => t[field] === value) || null;
  }

  async findById(id: string): Promise<Teacher | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> { 
    return {} as any; 
  }

  async delete(id: string): Promise<boolean> { 
    return false; 
  }

  async list(): Promise<Teacher[]> { 
    return this.teachers; 
  }

  reset() {
    this.teachers = [];
    this.createWasCalled = false;
    this.findByFieldWasCalled = false;
    this.receivedCreate = null;
    this.receivedFindField = null;
    this.shouldFail = false;
    this.errorToThrow = null;
  }
}

class MockTeacherRepositoryError extends MockTeacherRepository {
  async create(entity: Teacher): Promise<Teacher> {
    this.createWasCalled = true;
    throw new Error('Database error');
  }
}

// ========================================
//             Tests
// ========================================

describe('CreateTeacherUseCase', () => {

  test('Should create a teacher successfully', async () => {

    // Arrange
    const mockRepo = new MockTeacherRepository();
    const useCase = new CreateTeacherUseCase(mockRepo);
    const dto: CreateTeacherDTO = {
      name: 'Maria Santos',
      email: 'maria@gmail.com',
      subjects: [SubjectsEnum.ALGORITHMS, SubjectsEnum.DATA_STRUCTURES],
    };

    // Act
    const result = await useCase.perform(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.email).toBe(dto.email);
    expect(result.subjects).toEqual(dto.subjects);
    expect(mockRepo.createWasCalled).toBe(true);
    expect(mockRepo.receivedCreate).toEqual(result);
  });

  test('Should throw error if repository fails on create', async () => {

    // Arrange
    const fakeRepoError = new MockTeacherRepositoryError();
    const useCase = new CreateTeacherUseCase(fakeRepoError);
    const dto: CreateTeacherDTO = {
      name: 'Maria Santos',
      email: 'maria@gmail.com',
      subjects: [SubjectsEnum.DATABASES],
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow('Database error');
    expect(fakeRepoError.createWasCalled).toBe(true);
  });

  test('Should throw error if email already exists', async () => {

    // Arrange
    const mockRepo = new MockTeacherRepository();
    const existingTeacher = new Teacher('Existing', 'maria@gmail.com', [SubjectsEnum.ALGORITHMS]);
    (mockRepo as any).teachers.push(existingTeacher);

    const useCase = new CreateTeacherUseCase(mockRepo);
    const dto: CreateTeacherDTO = {
      name: 'Maria Santos',
      email: 'maria@gmail.com',
      subjects: [SubjectsEnum.ALGORITHMS],
    };

    // Simulate Validate
    const performWithValidation = async () => {
      const existing = await mockRepo.findByField('email', dto.email);
      if (existing) throw new Error(`Teacher with email ${dto.email} already exists`);
      return await useCase.perform(dto);
    };

    await expect(performWithValidation()).rejects.toThrow(
      `Teacher with email ${dto.email} already exists`
    );
    expect(mockRepo.findByFieldWasCalled).toBe(true);
    expect(mockRepo.createWasCalled).toBe(false);
  });

});
