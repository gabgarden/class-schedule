import { CreateScheduleUseCase } from '../../../src/domain/usecases/schedule/create-schedule-uc';
import { CreateScheduleDTO } from '../../../src/domain/dtos/schedule/create-schedule-dto';
import { Schedule } from '../../../src/domain/entities/Schedule';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { ScheduleStatus } from '../../../src/domain/enums/schedule-status-enum';
import { IRepository } from '../../../src/contracts/i-repository';
import { IScheduleDomainService } from '../../../src/contracts/i-schedule-domain-service';
import { TimeSlotPeriod } from '../../../src/domain/enums/time-slot-period-enum';
import { SubjectsEnum } from '../../../src/domain/enums/subjetcs-enum';

// ==========================
//       Mocks Repositorys
// ==========================

class MockScheduleRepository implements IRepository<Schedule, string> {
  public created: Schedule | null = null;
  public createWasCalled = false;
  async create(entity: Schedule): Promise<Schedule> {
    this.createWasCalled = true;
    this.created = entity;
    return entity;
  }
  async findById(id: string): Promise<Schedule | null> { 
    return null; 
  }

  async findByField(field: keyof Schedule, value: any): Promise<Schedule | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> { 
    return {} as any; 
  }

  async delete(id: string): Promise<boolean> {
    return true; 
  }

  async list(): Promise<Schedule[]> { 
    return []; 
  }
}

class StubTeacherRepository implements IRepository<Teacher, string> {

  async findById(id: string): Promise<Teacher | null> {
    return new Teacher('Maria Santos', 'maria@gmail.com', [SubjectsEnum.ALGORITHMS]);
  }
  async create(entity: Teacher): Promise<Teacher> { 
    return {} as any; 
  }

  async findByField(field: keyof Teacher, value: any): Promise<Teacher | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> { 
    return {} as any; 
  }

  async delete(id: string): Promise<boolean> { 
    return true; 
  }

  async list(): Promise<Teacher[]> { 
    return []; 
  }
}

class StubClassroomRepository implements IRepository<Classroom, string> {
  async findById(id: string): Promise<Classroom | null> {
    return new Classroom(101, 30);
  }
  
  async create(entity: Classroom): Promise<Classroom> { 
    return {} as any; 
  }

  async findByField(field: keyof Classroom, value: any): Promise<Classroom | null> { 
    return null; 
  }

  async update(id: string, data: Partial<Classroom>): Promise<Classroom> { 
    
    return {} as any; 
  }

  async delete(id: string): Promise<boolean> { 
    return true; 
  }

  async list(): Promise<Classroom[]> { 
    return []; 
  }
}
class StubTeacherRepositoryNotFound extends StubTeacherRepository {

  async findById(id: string): Promise<Teacher | null> { 
    return null; 
  }
}
class StubClassroomRepositoryNotFound extends StubClassroomRepository {
  async findById(id: string): Promise<Classroom | null> { 
    return null; 
  }
}

// Simulate conflit
class FakeScheduleDomainServiceConflict implements IScheduleDomainService {
  async checkConflicts(dto: CreateScheduleDTO): Promise<void> {
    throw new Error('Schedule conflict detected');
  }
}

// No Conflit
class FakeScheduleDomainService implements IScheduleDomainService {
  async checkConflicts(dto: CreateScheduleDTO): Promise<void> { /* ok */ }
}

// ==========================
//         Tests
// ==========================

describe('CreateScheduleUseCase', () => {

  test('Should create a schedule successfully', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepository(),
      new StubClassroomRepository(),
      new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 't1',
      classroomId: 'c1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
      description: 'Algorithms class',
      maxStudents: 30
    };

    // Act
    const result = await useCase.perform(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.teacher.name).toBe('Maria Santos');
    expect(result.classroom.classroomNumber).toBe(101);
    expect(result.period).toBe(dto.period);
    expect(result.subject).toBe(dto.subject);
    expect(result.status).toBe(ScheduleStatus.ACTIVE);
  });

  test('Should throw error if teacher not found', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepositoryNotFound(),
      new StubClassroomRepository(),
      new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'class1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
      description: 'Algorithms class',
      maxStudents: 30
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow('Teacher not found');
  });

  
  test('Should throw error if classroom not found', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepository(),
      new StubClassroomRepositoryNotFound(),
      new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'class1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
      description: 'Algorithms class',
      maxStudents: 30
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow('Classroom not found');
  });

  test('Should throw error if schedule is recurring but recurrenceEndDate is missing', async () => {

    // Arange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepository(),
      new StubClassroomRepository(),
      new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'class1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: true,
      description: 'Algebra class',
      maxStudents: 30
    
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow(
      'Recurrence end date required when schedule is recurring'
    );
  });

  test('Should throw error if recurrenceEndDate is before scheduledDate', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepository(),
      new StubClassroomRepository(),
      new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'class1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: true,
      description: 'Algorithms class',
      maxStudents: 30,
      recurrenceEndDate: new Date(Date.now() - 3600000).toISOString()
    };

    // act and assert
    await expect(useCase.perform(dto)).rejects.toThrow(
      'Recurrence end date must be after scheduled date'
    );
  });

  test('Should throw error on schedule conflict', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
      new MockScheduleRepository(),
      new StubTeacherRepository(),
      new StubClassroomRepository(),
      new FakeScheduleDomainServiceConflict()
    );

    const dto: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'class1',
      scheduledDate: new Date(Date.now() + 3600000).toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
      description: 'Algorithms class',
      maxStudents: 30
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow('Schedule conflict detected');
  });

  test('Should throw error if scheduled date is in the past', async () => {

    // Arrange
    const useCase = new CreateScheduleUseCase(
        new MockScheduleRepository(),
        new StubTeacherRepository(),
        new StubClassroomRepository(),
        new FakeScheduleDomainService()
    );

    const dto: CreateScheduleDTO = {
        teacherId: 'teacher1',
        classroomId: 'class1',
        scheduledDate: new Date(Date.now() - 3600000).toISOString(),
        period: TimeSlotPeriod.PERIOD_NIGHT_1,
        subject: SubjectsEnum.ALGORITHMS,
        isRecurring: false,
        description: 'Algoritms class',
        maxStudents: 30
    };

    // Act and Assert
    await expect(useCase.perform(dto)).rejects.toThrow(
        'Scheduled date cannot be in the past'
    );
    });


});
