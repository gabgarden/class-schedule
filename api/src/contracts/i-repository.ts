export interface IRepository<T, ID = string> {
  create(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  //update(id: ID, data: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
  list(): Promise<T[]>;
}
