import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Teacher } from '../../entities/Teacher';

export class DeleteTeacherUseCase implements IByIdUseCase<void> {
  private repository: IRepository<Teacher, string>;

  constructor(repository: IRepository<Teacher, string>) {
    this.repository = repository;
  }

  async perform(id: string): Promise<void> {
    const teacher = await this.repository.findById(id);

    await this.repository.delete(id);
  }
}
