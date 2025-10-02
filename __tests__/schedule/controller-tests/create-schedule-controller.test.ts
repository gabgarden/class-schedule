import { Request } from 'express';
import { CreateScheduleController } from '../../../src/controllers/schedule/create-schedule-controller';
import { CreateScheduleDTO } from '../../../src/domain/dtos/schedule/create-schedule-dto';
import { Schedule } from '../../../src/domain/entities/Schedule';
import { ICommandUseCase } from '../../../src/contracts/i-command-uc';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { ScheduleConflictException } from '../../../src/exceptions/schedule-conflict-exception';
import { TimeSlotPeriod } from '../../../src/domain/enums/time-slot-period-enum';
import { SubjectsEnum } from '../../../src/domain/enums/subjetcs-enum';
import { ScheduleStatus } from '../../../src/domain/enums/schedule-status-enum';

// ========================================
//   STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeCreateScheduleUseCase implements ICommandUseCase<CreateScheduleDTO, Schedule> {
  public performWasCalled = false;
  public receivedDto: CreateScheduleDTO | null = null;
  public shouldFail = false;
  public errorToThrow: Error | null = null;

  async perform(dto: CreateScheduleDTO): Promise<Schedule> {
    this.performWasCalled = true;
    this.receivedDto = dto;

    if (this.shouldFail && this.errorToThrow) throw this.errorToThrow;

    // Returns a fake schedule matching the schema
    const teacher = new Teacher('Fake Teacher', 'fakeT@gmail.com', ['ALGORITHMS']);
    const classroom: Classroom = { classroomNumber: 101, capacity: 30 } as Classroom;

    return new Schedule(
      teacher,
      classroom,
      new Date(dto.scheduledDate),
      dto.period,
      dto.subject,
      ScheduleStatus.ACTIVE,
      dto.isRecurring,
      dto.description,
      dto.maxStudents,
      dto.recurrenceEndDate ? new Date(dto.recurrenceEndDate) : undefined
    );
  }

  reset() {
    this.performWasCalled = false;
    this.receivedDto = null;
    this.shouldFail = false;
    this.errorToThrow = null;
  }
}

// ========================================
// STEP 2: Create Request and Response Mocks
// ========================================

function createMockRequest(body: any = {}): Partial<Request> {
  return { body };
}

interface MockResponse {
  statusCode: number;
  jsonData: any;
  ended: boolean;
  status(code: number): MockResponse;
  json(data: any): MockResponse;
  end(): MockResponse;
}

function createMockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    jsonData: null,
    ended: false,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonData = data;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
  return res;
}

// ========================================
//      STEP 3: Setup dos testes
// ========================================

describe('CreateScheduleController', () => {
  let controller: CreateScheduleController;
  let fakeUseCase: FakeCreateScheduleUseCase;

  // Executed before each test
  beforeEach(() => {
    fakeUseCase = new FakeCreateScheduleUseCase();
    controller = new CreateScheduleController(fakeUseCase as any);
  });

  // ========================================
  //         STEP 4: Success Tests
  // ========================================

  test('Should create a schedule successfully and return status 201', async () => {

    // Arrange
    const requestBody: CreateScheduleDTO = {
      teacherId: 'teacher1',
      classroomId: 'classroom1',
      scheduledDate: new Date().toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
    };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(201);
    expect(res.jsonData).toBeDefined();
    expect(res.jsonData.teacher.name).toBe('Fake Teacher');
    expect(res.jsonData.period).toBe(TimeSlotPeriod.PERIOD_NIGHT_1);
    expect(fakeUseCase.performWasCalled).toBe(true);
    expect(fakeUseCase.receivedDto).toEqual(requestBody);
  });

  // ========================================
  // STEP 5: Error Tests
  // ========================================

  test('Should return 409 when schedule conflict occurs', async () => {

    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new ScheduleConflictException(
      'Teacher has another schedule',
      'TEACHER_CONFLICT',
      {
        entityType: 'Teacher',
        entityId: 'teacher1',
        conflictDate: new Date().toISOString(),
        conflictPeriod: 'MORNING',
      }
    );

    const req = createMockRequest({
      teacherId: 'teacher1',
      classroomId: 'classroom1',
      scheduledDate: new Date().toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
    });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(409);
    expect(res.jsonData.error).toBe('Schedule conflict');
  });

  test('Should return 422 on business rule violation', async () => {

    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Teacher cannot be in the past');

    const req = createMockRequest({
      teacherId: 'teacher1',
      classroomId: 'classroom1',
      scheduledDate: new Date().toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
    });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(422);
    expect(res.jsonData.error).toBe('Business rule violation');
  });

  test('Should return 500 when unexpected error occurs', async () => {

    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;

    const req = createMockRequest({
      teacherId: 'teacher1',
      classroomId: 'classroom1',
      scheduledDate: new Date().toISOString(),
      period: TimeSlotPeriod.PERIOD_NIGHT_1,
      subject: SubjectsEnum.ALGORITHMS,
      isRecurring: false,
    });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.error).toBe('Internal server error');
  });
});
