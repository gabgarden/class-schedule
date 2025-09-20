import { IQueryUseCase } from './../../../contracts/i-query-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Teacher } from '../../entities/Teacher';

export class ListTeachersUseCase implements IQueryUseCase<Teacher[]> {
  private repository: IRepository<Teacher, string>;

  constructor(repository: IRepository<Teacher, string>) {
    this.repository = repository;
  }

  async perform(): Promise<Teacher[]> {
    const teachers = await this.repository.list();
    return teachers || [];
  }
}
