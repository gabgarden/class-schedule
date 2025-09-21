import { IQueryUseCase } from '../../../contracts/i-query-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Classroom } from '../../entities/Classroom';

export class ListClassroomsUseCase implements IQueryUseCase<Classroom[]> {
  private repository: IRepository<Classroom, string>;

  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }
  async perform(): Promise<Classroom[]> {
    return await this.repository.list();
  }
}
