import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Classroom } from '../../entities/Classroom';
import { NotFoundException } from '../../../exceptions/not-found-exception';

export class DeleteClassroomUseCase implements IByIdUseCase<void> {
  private readonly repository: IRepository<Classroom, string>;

  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }

  async perform(id: string): Promise<void> {
    const classroom = await this.repository.findById(id);

    if (!classroom) {
      throw new NotFoundException('Classroom', id);
    }

    await this.repository.delete(id);
  }
}
