import { Request, Response } from 'express';
import { DeleteTeacherController } from '../../../src/controllers/teacher/delete-teacher-controller';
import { DeleteTeacherDTO } from '../../../src/domain/dtos/teacher/delete-teacher-dto';
import { IByIdUseCase } from '../../../src/contracts/i-byid-uc';
import { IValidationService } from '../../../src/contracts/i-validation-service';
import { ValidationException } from '../../../src/exceptions/validation-exception';
import { NotFoundException } from '../../../src/exceptions/not-found-exception';

// ========================================
// STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeDeleteTeacherUseCase implements IByIdUseCase<void> {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public receivedId: string | null = null;

  async perform(id: string): Promise<void> {
    this.performWasCalled = true;
    this.receivedId = id;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }
  }

  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.receivedId = null;
  }
}

class FakeValidationService implements IValidationService {
  public shouldFail = false;
  public validationErrors: any[] = [];
  public validateWasCalled = false;
  public lastDtoClass: any | null = null;
  public lastData: any = null;

  async validate<T>(dtoClass: any, data: any): Promise<T> {
    this.validateWasCalled = true;
    this.lastDtoClass = dtoClass;
    this.lastData = data;

    if (this.shouldFail) {
      throw new ValidationException('Validation failed', this.validationErrors);
    }

    return data as T;
  }

  reset() {
    this.shouldFail = false;
    this.validationErrors = [];
    this.validateWasCalled = false;
    this.lastDtoClass = null;
    this.lastData = null;
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

describe('DeleteTeacherController', () => {
  let controller: DeleteTeacherController;
  let fakeUseCase: FakeDeleteTeacherUseCase;
  let fakeValidationService: FakeValidationService;

  beforeEach(() => {
    fakeUseCase = new FakeDeleteTeacherUseCase();
    fakeValidationService = new FakeValidationService();
    controller = new DeleteTeacherController(fakeUseCase, fakeValidationService);
  });

  // ========================================
  // STEP 4: Success Tests
  // ========================================

  test('Should delete teacher successfully and return status 204', async () => {

    // Arrange
    const req = createMockRequest({ teacherId: 't123' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(204);
    expect(res.ended).toBe(true);
    expect(fakeUseCase.performWasCalled).toBe(true);
    expect(fakeUseCase.receivedId).toBe('t123');
  });


  test('Should call validationService with DeleteTeacherDTO and request body', async () => {

    //Arrange
    const req = createMockRequest({ teacherId: 't456' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeValidationService.validateWasCalled).toBe(true);
    expect(fakeValidationService.lastDtoClass).toBe(DeleteTeacherDTO);
    expect(fakeValidationService.lastData).toEqual({ teacherId: 't456' });
  });

  // ========================================
  // STEP 5: Validation Error Tests
  // ========================================

  test('Should return 400 when validation fails', async () => {

    // Arrange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [
      { field: 'teacherId', message: 'TeacherId is required' },
    ];

    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.jsonData.message).toBe('Validation failed');
    expect(res.jsonData.errors).toEqual([
      { field: 'teacherId', message: 'TeacherId is required' },
    ]);
    expect(fakeUseCase.performWasCalled).toBe(false);
  });

  // ========================================
  // STEP 6: NotFound Error Tests
  // ========================================

  test('Should return 404 when teacher is not found', async () => {
    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new NotFoundException('Teacher', 'not-exists');

    const req = createMockRequest({ teacherId: 'not-exists' });
    const res = createMockResponse();

    //Act
    await controller.handle(req as Request, res as any);

    //Assert
    expect(res.statusCode).toBe(404);
    expect(res.jsonData.message).toBe('Teacher with ID "not-exists" was not found');
  });

  // ========================================
  // STEP 7: Internal Error Tests
  // ========================================

  test('Should return 500 when unexpected error occurs', async () => {

    //Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database crashed');

    const req = createMockRequest({ teacherId: 't80fff' });
    const res = createMockResponse();

    //Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Database crashed');
  });

  test('Should return generic 500 when error has no message', async () => {

    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;

    const req = createMockRequest({ teacherId: 't745EEE' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Internal Server Error');
  });
});
