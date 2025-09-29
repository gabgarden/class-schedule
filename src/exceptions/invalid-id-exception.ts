export class InvalidIdException extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} ID "${id}" is not a valid ObjectId`);
    this.name = 'InvalidIdException';
  }
}
