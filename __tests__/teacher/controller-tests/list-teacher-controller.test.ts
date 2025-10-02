import { Request, Response } from 'express';
import { ListTeachersController } from '../../../src/controllers/teacher/list-teachers-controller';
import { Teacher } from '../../../src/domain/entities/Teacher';
import { IQueryUseCase } from '../../../src/contracts/i-query-uc';

// ========================================
// STEP 1: Create Test Doubles (Fakes)
// ========================================

class FakeListTeachersUseCase implements IQueryUseCase<Teacher[]> {
  public shouldFail = false;
  public errorToThrow: Error | null = null;
  public performWasCalled = false;
  public teachersToReturn: Teacher[] = [];

  async perform(): Promise<Teacher[]> {
    this.performWasCalled = true;

    if (this.shouldFail && this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.teachersToReturn;
  }

  reset() {
    this.shouldFail = false;
    this.errorToThrow = null;
    this.performWasCalled = false;
    this.teachersToReturn = [];
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
//        STEP 3: Setup Tests
// ========================================

describe('ListTeachersController', () => {
  let controller: ListTeachersController;
  let fakeUseCase: FakeListTeachersUseCase;

  beforeEach(() => {
    fakeUseCase = new FakeListTeachersUseCase();
    controller = new ListTeachersController(fakeUseCase);
  });

  // ========================================
  //        STEP 4: Success Tests
  // ========================================

  test('Should list teachers successfully with status 200', async () => {

    //Arrange
    fakeUseCase.teachersToReturn = [
      { name: 'Maria', email: 'maria@gmail.com', subjects: [] },
      { name: 'Marcos', email: 'marcos@gmail.com', subjects: [] },
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
    //Arrange
    const req = createMockRequest();
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    //assert
    expect(fakeUseCase.performWasCalled).toBe(true);
  });

  // ========================================
  // STEP 5: Error Tests
  // ========================================

  test('Should return 500 when usecase throws an error', async () => {
    
    //Arrange
    fakeUseCase.shouldFail = true;
    fakeUseCase.errorToThrow = new Error('Database failure');

    const req = createMockRequest();
    const res = createMockResponse();

    // Act
    await controller.handle(req as Request, res as any);

    // Assert
    expect(res.statusCode).toBe(500);
    expect(res.jsonData.success).toBe(false);
    expect(res.jsonData.error).toBe('Failed to list teachers');
  });
});
