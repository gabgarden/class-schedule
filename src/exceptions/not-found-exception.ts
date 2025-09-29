export class NotFoundException extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with ID "${id}" was not found`);
    this.name = 'NotFoundException';
  }
}
