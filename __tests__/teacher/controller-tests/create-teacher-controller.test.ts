import { Request } from 'express';
import { CreateTeacherController } from '../../../src/controllers/teacher/create-teacher-controller';
import { CreateTeacherDTO } from '../../../src/domain/dtos/teacher/create-teacher-dto';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { ICommandUseCase } from '../../../src/contracts/i-command-uc';
import { IValidationService } from '../../../src/contracts/i-validation-service';
import { ValidationException } from '../../../src/exceptions/validation-exception';
import { SubjectsEnum } from '../../../src/domain/enums/subjetcs-enum';

// ========================================
// STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeCreateTeacherUseCase implements ICommandUseCase<CreateTeacherDTO, Teacher> {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public receivedDto: CreateTeacherDTO | null = null;

  async perform(dto: CreateTeacherDTO): Promise<Teacher> {
    this.performWasCalled = true;
    this.receivedDto = dto;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }

    return {
      name: dto.name,
      email: dto.email,
      subjects: dto.subjects,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Teacher;
  }

  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.receivedDto = null;
  }
}

class FakeValidationService implements IValidationService {
  public shouldFail = false;
  public validationErrors: any[] = [];
  public validateWasCalled = false;

  async validate<T>(dtoClass: any, data: any): Promise<T> {
    this.validateWasCalled = true;

    if (this.shouldFail) {
      throw new ValidationException('Validation failed', this.validationErrors);
    }

    return data as T;
  }

  reset() {
    this.shouldFail = false;
    this.validationErrors = [];
    this.validateWasCalled = false;
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
// STEP 3: Setup Tests
// ========================================

describe('CreateTeacherController', () => {
  let controller: CreateTeacherController;
  let fakeUseCase: FakeCreateTeacherUseCase;
  let fakeValidationService: FakeValidationService;

  beforeEach(() => {
    fakeUseCase = new FakeCreateTeacherUseCase();
    fakeValidationService = new FakeValidationService();
    controller = new CreateTeacherController(fakeUseCase, fakeValidationService);
  });

  // ========================================
  // STEP 4: Success Tests
  // ========================================

  test('Should create a teacher successfully and return status 201', async () => {

    // Arrange
    const requestBody: CreateTeacherDTO = {
      name: 'Maria Santos',
      email: 'maria@gmail.com',
      subjects: [SubjectsEnum.ALGORITHMS, SubjectsEnum.DATA_STRUCTURES],
    };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(201);
    expect(res.jsonData).toBeDefined();
    expect(res.jsonData.name).toBe('Maria Santos');
    expect(res.jsonData.email).toBe('maria@gmail.com');
  });

  test('Should call validationService with correct data', async () => {

    // Arrange
    const requestBody: CreateTeacherDTO = {
      name: 'Maria Santos',
      email: 'maria@gmail.com',
      subjects: [SubjectsEnum.ALGORITHMS],
    };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeValidationService.validateWasCalled).toBe(true);
  });

  test('Should call usecase with validated DTO', async () => {

    // Arrange
    const requestBody: CreateTeacherDTO = {
      name: 'Marcos Souza',
      email: 'marcos@gmail.com',
      subjects: [SubjectsEnum.ALGORITHMS],
    };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeUseCase.performWasCalled).toBe(true);
    expect(fakeUseCase.receivedDto).toEqual(requestBody);
  });

  // ========================================
  // STEP 5: Validation Error Tests
  // ========================================

  test('Should return 400 when validation fails', async () => {

    // Arrange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [
      { field: 'name', message: 'Name is required' },
    ];

    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.jsonData.message).toBe('Validation failed');
    expect(res.jsonData.errors).toEqual([
      { field: 'name', message: 'Name is required' },
    ]);
  });

  test('Should not call usecase when validation fails', async () => {
    // Arrange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [{ field: 'email', message: 'Invalid' }];

    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeUseCase.performWasCalled).toBe(false);
  });

  // ========================================
  // STEP 6: Internal Error Tests
  // ========================================

  test('Should return 500 when unexpected error occurs in usecase', async () => {

    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database error');

    const req = createMockRequest({
      name: 'ErrorTeacher',
      email: 'error@gmail.com',
      subjects: ['ALGORITHMS'],
    });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Database error');
  });

  test('Should return generic message when error has no message', async () => {
    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;

    const req = createMockRequest({
      name: 'NoMessage',
      email: 'nomsg@gmail.com',
      subjects: ['ALGORITHMS'],
    });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Internal server error');
  });
});
