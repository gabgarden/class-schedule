export class ScheduleConflictException extends Error {
  public readonly type: 'TEACHER_CONFLICT' | 'CLASSROOM_CONFLICT';
  public readonly details: {
    entityType: string;
    entityId: string;
    conflictDate: string;
    conflictPeriod: string;
  };

  constructor(
    message: string,
    type: 'TEACHER_CONFLICT' | 'CLASSROOM_CONFLICT',
    details: {
      entityType: string;
      entityId: string;
      conflictDate: string;
      conflictPeriod: string;
    }
  ) {
    super(message);
    this.name = 'ScheduleConflictException';
    this.type = type;
    this.details = details;
  }
}
