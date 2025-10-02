import { IQueryUseCase } from '../../../contracts/i-query-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Schedule } from '../../entities/Schedule';

export class ListSchedulesUseCase implements IQueryUseCase<Schedule[]> {
  private repository: IRepository<Schedule, string>;

  constructor(repository: IRepository<Schedule, string>) {
    this.repository = repository;
  }

  async perform(): Promise<Schedule[]> {
    const schedules = await this.repository.list();
    return schedules || [];
  }
}
