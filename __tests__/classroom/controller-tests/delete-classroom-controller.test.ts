import { Request, Response } from 'express';
import { DeleteClassroomController } from '../../../src/controllers/classroom/delete-classroom-controller';
import { DeleteClassroomDTO } from '../../../src/domain/dtos/classroom/delete-classroom-dto';
import { IByIdUseCase } from '../../../src/contracts/i-byid-uc';
import { IValidationService } from '../../../src/contracts/i-validation-service';
import { ValidationException } from '../../../src/exceptions/validation-exception';
import { NotFoundException } from '../../../src/exceptions/not-found-exception';

// ========================================
// STEP 1: Create Test Doubles (Fakes)
// ========================================

// Fake UseCase - simulates real behavior
class FakeDeleteClassroomUseCase implements IByIdUseCase<void> {
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

  // Helper method to reset state between tests
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

describe('DeleteClassroomController', () => {
  let controller: DeleteClassroomController;
  let fakeUseCase: FakeDeleteClassroomUseCase;
  let fakeValidationService: FakeValidationService;

  beforeEach(() => {
    fakeUseCase = new FakeDeleteClassroomUseCase();
    fakeValidationService = new FakeValidationService();
    controller = new DeleteClassroomController(fakeUseCase, fakeValidationService);
  });

  // ========================================
  // STEP 4: Success Tests
  // ========================================

  test('Should delete classroom successfully and return status 204', async () => {

    // Arange
    const req = createMockRequest({ classroomId: '123' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(204);
    expect(res.ended).toBe(true);
    expect(fakeUseCase.performWasCalled).toBe(true);
    expect(fakeUseCase.receivedId).toBe('123');
  });

  test('Should call validationService with DeleteClassroomDTO and request body', async () => {

    // Arange
    const req = createMockRequest({ classroomId: 'as5sd4' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeValidationService.validateWasCalled).toBe(true);
    expect(fakeValidationService.lastDtoClass).toBe(DeleteClassroomDTO);
    expect(fakeValidationService.lastData).toEqual({ classroomId: 'as5sd4' });
  });

  // ========================================
  // STEP 5: Validation Error Tests
  // ========================================

  test('Should return 400 when validation fails', async () => {

    // Arange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [
      { field: 'classroomId', message: 'ClassroomId is required' },
    ];
    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.jsonData.message).toBe('Validation failed');
    expect(res.jsonData.errors).toEqual([
      { field: 'classroomId', message: 'ClassroomId is required' },
    ]);
    expect(fakeUseCase.performWasCalled).toBe(false);
  });

  // ========================================
  // STEP 6: NotFound Error Tests
  // ========================================

  test('Should return 404 when classroom is not found', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new NotFoundException('Classroom', 'noExist0');
    const req = createMockRequest({ classroomId: 'noExist0' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(404);
    expect(res.jsonData.message).toBe('Classroom with ID "noExist0" was not found');
  });

  // ========================================
  // STEP 7: Internal Error Tests
  // ========================================

  test('Should return 500 when unexpected error occurs', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database crashed');
    const req = createMockRequest({ classroomId: 'sd5d4d' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Database crashed');
  });

  test('Should return generic 500 when error has no message', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;
    const req = createMockRequest({ classroomId: 'aksj23' });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Internal Server Error');
  });
});