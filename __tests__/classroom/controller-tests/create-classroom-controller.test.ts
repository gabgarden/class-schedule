import { Request, Response } from 'express';
import { CreateClassroomController } from '../../../src/controllers/classroom/create-clasroom-controller';
import { CreateClassroomDTO } from '../../../src/domain/dtos/classroom/create-classroom-dto';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { ICommandUseCase } from '../../../src/contracts/i-command-uc';
import { IValidationService } from '../../../src/contracts/i-validation-service';
import { ValidationException } from '../../../src/exceptions/validation-exception';

// ========================================
// STEP 1: Criar Test Doubles (Fakes)
// ========================================

// Fake UseCase - simulates real behavior
class FakeCreateClassroomUseCase {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public receivedDto: CreateClassroomDTO | null = null;

  async perform(dto: CreateClassroomDTO): Promise<Classroom> {
    this.performWasCalled = true;
    this.receivedDto = dto;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }

    // Returns a fake classroom matching the schema
    return {
      id: '123',
      classroomNumber: dto.classroomNumber,
      capacity: dto.capacity,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Classroom;
  }

  // Helper method to reset state between tests
  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.receivedDto = null;
  }
}

// Fake ValidationService
class FakeValidationService implements IValidationService {
  public shouldFail = false;
  public validationErrors: any[] = [];
  public validateWasCalled = false;

  async validate<T>(dtoClass: any, data: any): Promise<T> {
    this.validateWasCalled = true;

    if (this.shouldFail) {
      throw new ValidationException('Validation failed', this.validationErrors);
    }

    // Returns data as if it were validated
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
  return {
    body,
  };
}

// Custom type for our mock response with test properties
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
    status: function (code: number) {
      res.statusCode = code;
      return res;
    },
    json: function (data: any) {
      res.jsonData = data;
      return res;
    },
    end: function () {
      res.ended = true;
      return res;
    },
  };

  return res;
}

// ========================================
// STEP 3: Setup dos testes
// ========================================

describe('CreateClassroomController', () => {
  let controller: CreateClassroomController;
  let fakeUseCase: FakeCreateClassroomUseCase;
  let fakeValidationService: FakeValidationService;

  // Executed before each test
  beforeEach(() => {
    fakeUseCase = new FakeCreateClassroomUseCase();
    fakeValidationService = new FakeValidationService();
    controller = new CreateClassroomController(
      fakeUseCase,
      fakeValidationService
    );
  });

  // ========================================
  // STEP 4: Success Tests
  // ========================================

  test('Should create a classroom successfully and return status 201', async () => {
    // Arrange (Prepare)
    const requestBody = {
      classroomNumber: 101,
      capacity: 30,
    };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act (Execute)
    await controller.handle(req as Request, res as any);

    // Assert (Verify)
    expect(res.statusCode).toBe(201);
    expect(res.jsonData).toBeDefined();
    expect(res.jsonData.id).toBe('123');
    expect(res.jsonData.classroomNumber).toBe(101);
    expect(res.jsonData.capacity).toBe(30);
  });

  test('Should call validationService with correct data', async () => {
    // Arrange
    const requestBody = { classroomNumber: 102, capacity: 25 };
    const req = createMockRequest(requestBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeValidationService.validateWasCalled).toBe(true);
  });

  test('Should call usecase with validated DTO', async () => {
    // Arrange
    const requestBody = { classroomNumber: 103, capacity: 20 };
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
      { field: 'classroomNumber', message: 'Classroom number is required' },
    ];

    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.jsonData.message).toBe('Validation failed');
    expect(res.jsonData.errors).toEqual([
      { field: 'classroomNumber', message: 'Classroom number is required' },
    ]);
  });

  test('Should not call usecase when validation fails', async () => {
    // Arrange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [
      { field: 'classroomNumber', message: 'Invalid' },
    ];

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
    fakeUseCase.errorToThrow = new Error('Database connection failed');

    const req = createMockRequest({ classroomNumber: 104, capacity: 30 });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Database connection failed');
  });

  test('Should return generic message when error has no message', async () => {
    // Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;

    const req = createMockRequest({ classroomNumber: 105, capacity: 30 });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Internal server error');
  });
});

// ========================================
// STEP 7: How to run the tests
// ========================================

/*
STEP-BY-STEP EXPLANATION:

1. **Test Doubles (Fakes)**: 
   - We create fake classes that implement the interfaces
   - They have properties to control behavior (shouldFail, errorToThrow)
   - They have properties to verify if they were called (performWasCalled)
   - reset() method to clear state between tests

2. **Request/Response Mocks**:
   - Functions that create objects simulating Express Request and Response
   - Response stores status and data so we can verify later

3. **Setup (beforeEach)**:
   - Creates new instances before each test
   - Ensures tests are independent

4. **AAA Pattern (Arrange, Act, Assert)**:
   - Arrange: Prepare data and configure behavior
   - Act: Execute the function we're testing
   - Assert: Verify the result is as expected

5. **Success Tests**:
   - Verifies it returns 201
   - Verifies it calls the correct services
   - Verifies it passes correct data

6. **Error Tests**:
   - Verifies ValidationException handling
   - Verifies generic error handling
   - Verifies code doesn't execute after error

ADVANTAGES of this approach:
- ✅ No external dependencies
- ✅ Easy to understand and debug
- ✅ Full control over behavior
- ✅ Maintainable and extensible
- ✅ Fast to execute

To run: npm test or jest CreateClassroomController.test.ts
*/
