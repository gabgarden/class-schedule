import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Classroom } from '../../entities/Classroom';

export class DeleteClassroomUseCase implements IByIdUseCase<void> {
  private repository: IRepository<Classroom, string>;

  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }

  async perform(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
