import { Request, Response } from 'express';
import { UpdateClassroomController } from '../../../src/controllers/classroom/update-classroom-controller';
import { UpdateClassroomDTO } from '../../../src/domain/dtos/classroom/update-classroom-dto';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IUpdateUseCase } from '../../../src/contracts/i-update-uc';
import { IValidationService } from '../../../src/contracts/i-validation-service';
import { ValidationException } from '../../../src/exceptions/validation-exception';

// ========================================
// STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeUpdateClassroomUseCase implements IUpdateUseCase<UpdateClassroomDTO, Classroom> {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public receivedId: string | null = null;
  public receivedDto: UpdateClassroomDTO | null = null;

  async perform(id: string, dto: UpdateClassroomDTO): Promise<Classroom> {
    this.performWasCalled = true;
    this.receivedId = id;
    this.receivedDto = dto;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }

    return {
      id,
      classroomNumber: dto.classroomNumber || 101,
      capacity: dto.capacity || 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Classroom;
  }

  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.receivedId = null;
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
      res.statusCode = code;
      return res;
    },
    json(data: any) {
      res.jsonData = data;
      return res;
    },
    end() {
      res.ended = true;
      return res;
    },
  };
  return res;
}

// ========================================
// STEP 3: Setup tests
// ========================================

describe('UpdateClassroomController', () => {

  let controller: UpdateClassroomController;
  let fakeUseCase: FakeUpdateClassroomUseCase;
  let fakeValidationService: FakeValidationService;

  beforeEach(() => {
    fakeUseCase = new FakeUpdateClassroomUseCase();
    fakeValidationService = new FakeValidationService();
    controller = new UpdateClassroomController(fakeUseCase, fakeValidationService);
  });

  // ========================================
  //        STEP 4: Success Tests
  // ========================================

  test('Should update classroom successfully and return status 200', async () => {

    // Arange
    const reqBody = { classroomId: '1', classroomNumber: 201, capacity: 40 };
    const req = createMockRequest(reqBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toBeDefined();
    expect(res.jsonData.id).toBe('1');
    expect(res.jsonData.classroomNumber).toBe(201);
    expect(res.jsonData.capacity).toBe(40);
  });


  test('Should call validationService with correct data', async () => {

    // Arange 
    const reqBody = { classroomId: '2', classroomNumber: 202, capacity: 35 };
    const req = createMockRequest(reqBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeValidationService.validateWasCalled).toBe(true);
  });


  test('Should call usecase with correct id and DTO', async () => {

    // Arange
    const reqBody = { classroomId: '3', classroomNumber: 203, capacity: 25 };
    const req = createMockRequest(reqBody);
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeUseCase.performWasCalled).toBe(true);
    expect(fakeUseCase.receivedId).toBe('3');
    expect(fakeUseCase.receivedDto).toEqual(reqBody);
  });

  // ========================================
  //     STEP 5: Validation Error Tests
  // ========================================

  test('Should return 400 when validation fails', async () => {

    // Arange
    fakeValidationService.shouldFail = true;
    fakeValidationService.validationErrors = [
      { field: 'classroomNumber', message: 'Classroom number is required' },
    ];
    const req = createMockRequest({});
    const res = createMockResponse();

    // act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.jsonData.message).toBe('Validation failed');
    expect(res.jsonData.errors).toEqual([
      { field: 'classroomNumber', message: 'Classroom number is required' },
    ]);
  });

  test('Should not call usecase when validation fails', async () => {
    // Arange
    fakeValidationService.shouldFail = true;
    const req = createMockRequest({});
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeUseCase.performWasCalled).toBe(false);
  });

  // ========================================
  //      STEP 6: Internal Error Tests
  // ========================================

  test('Should return 500 when usecase throws an error', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database failure');
    const req = createMockRequest({ classroomId: '4', classroomNumber: 204, capacity: 20 });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Database failure');
  });

  test('Should return generic 500 message when error has no message', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = {} as Error;
    const req = createMockRequest({ classroomId: '5', classroomNumber: 205, capacity: 30 });
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.message).toBe('Internal server error');
  });
});
