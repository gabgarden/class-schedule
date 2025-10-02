import { DeleteTeacherUseCase } from '../../../src/domain/usecases/teacher/delete-teacher-uc';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { IRepository } from '../../../src/contracts/i-repository';
import { NotFoundException } from '../../../src/exceptions/not-found-exception';

// ========================================
//          Mocks Repositorys
// ========================================

class MockTeacherRepository implements IRepository<Teacher, string> {
  private teachers: { id: string; teacher: Teacher }[] = [];
  public deleteWasCalled = false;
  public findByIdWasCalled = false;
  public receivedId: string | null = null;

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  async create(entity: Teacher): Promise<Teacher & { id: string }> {
    const id = this.generateId();
    this.teachers.push({ id, teacher: entity });
    return { ...entity, id };
  }

  async findById(id: string): Promise<(Teacher & { id: string }) | null> {
    this.findByIdWasCalled = true;
    this.receivedId = id;
    const found = this.teachers.find((t) => t.id === id);
    return found ? { ...found.teacher, id: found.id } : null;
  }

  async delete(id: string): Promise<boolean> {
    this.deleteWasCalled = true;
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Teacher', id);
    this.teachers.splice(index, 1);
    return true;
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> {
    return {} as Teacher;
  }
  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> {
    return null;
  }
  async list(): Promise<Teacher[]> {
    return this.teachers.map((t) => t.teacher);
  }

  reset() {
    this.teachers = [];
    this.deleteWasCalled = false;
    this.findByIdWasCalled = false;
    this.receivedId = null;
  }
}

class MockTeacherRepositoryError extends MockTeacherRepository {
  async delete(id: string): Promise<boolean> {
    this.deleteWasCalled = true;
    throw new Error('Database error');
  }
}

// ========================================
//              Tests
// ========================================

describe('DeleteTeacherUseCase', () => {
  test('Should delete a teacher successfully', async () => {
    //Arrange
    const mockRepo = new MockTeacherRepository();
    const teacher = new Teacher('Maria Santos', 'maria@gmail.com', [
      'ALGORITHMS',
    ]);
    const created = await mockRepo.create(teacher);
    const useCase = new DeleteTeacherUseCase(mockRepo);

    // Act
    const result = await useCase.perform(created.id);

    // Assert
    expect(result).toBeUndefined();
    expect(mockRepo.deleteWasCalled).toBe(true);
    expect((mockRepo as any).teachers.length).toBe(0);
  });

  test('Should throw NotFoundException if teacher does not exist', async () => {
    const mockRepo = new MockTeacherRepository();
    const useCase = new DeleteTeacherUseCase(mockRepo);

    await expect(useCase.perform('noExistentId')).rejects.toThrow(
      NotFoundException
    );
    expect(mockRepo.findByIdWasCalled).toBe(true);
    expect(mockRepo.deleteWasCalled).toBe(false); // ✅ Should be false
  });

  test('Should throw error if repository fails on delete', async () => {
    // Arrange
    const mockRepoError = new MockTeacherRepositoryError();
    const teacher = new Teacher('Maria Santos', 'maria@gmail.com', [
      'ALGORITHMS',
    ]);
    const created = await mockRepoError.create(teacher);
    const useCase = new DeleteTeacherUseCase(mockRepoError);

    // Act and Assert
    await expect(useCase.perform(created.id)).rejects.toThrow('Database error');
    expect(mockRepoError.deleteWasCalled).toBe(true);
  });
});
