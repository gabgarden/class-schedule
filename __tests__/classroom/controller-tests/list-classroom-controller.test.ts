import { Request, Response } from 'express';
import { ListClassroomsController } from '../../../src/controllers/classroom/list-classrooms-controller';
import { Classroom } from '../../../src/domain/entities/Classroom';
import { IQueryUseCase } from '../../../src/contracts/i-query-uc';

// ========================================
//    STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeListClassroomsUseCase implements IQueryUseCase<Classroom[]> {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public classroomsToReturn: Classroom[] = [];

  async perform(): Promise<Classroom[]> {
    this.performWasCalled = true;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.classroomsToReturn;
  }

  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.classroomsToReturn = [];
  }
}

// ========================================
// STEP 2: Create Request and Response Mocks
// ========================================

function createMockRequest(): Partial<Request> {
  return {};
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
//        STEP 3: Setup tests
// ========================================

describe('ListClassroomsController', () => {

  let controller: ListClassroomsController;
  let fakeUseCase: FakeListClassroomsUseCase;

  beforeEach(() => {
    fakeUseCase = new FakeListClassroomsUseCase();
    controller = new ListClassroomsController(fakeUseCase);
  });

  // ========================================
  //        STEP 4: Success Tests
  // ========================================

  test('Should list classrooms successfully with status 200', async () => {

    // Arrange
    fakeUseCase.classroomsToReturn = [
      { classroomNumber: 101, capacity: 30},
      { classroomNumber: 102, capacity: 25}
    ];
    const req = createMockRequest();
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.jsonData.success).toBe(true);
    expect(res.jsonData.data).toHaveLength(2);
    expect(res.jsonData.count).toBe(2);
  });

  test('Should call usecase perform method', async () => {

    // Arange
    const req = createMockRequest();
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(fakeUseCase.performWasCalled).toBe(true);
  });

  // ========================================
  //          STEP 5: Error Tests
  // ========================================

  test('Should return 500 when usecase throws an error', async () => {

    // Arange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database failure');
    const req = createMockRequest();
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.success).toBe(false);
    expect(res.jsonData.error).toBe('Failed to list classrooms');
  });
});