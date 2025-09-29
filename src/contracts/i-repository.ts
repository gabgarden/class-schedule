export interface IRepository<T, ID = string> {
  create(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
  list(): Promise<T[]>;
  findByField(field: keyof T, value: any): Promise<T | null>;
}
