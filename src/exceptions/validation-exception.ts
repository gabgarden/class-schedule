export class ValidationException extends Error {
  constructor(message: string, public readonly errors: any[]) {
    super(message);
    this.name = 'ValidationException';
  }
}
