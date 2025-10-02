import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { IUpdateUseCase } from '../../../contracts/i-update-uc';
import { NotFoundException } from '../../../exceptions/not-found-exception';
import { Classroom } from '../../entities/Classroom';

export class UpdateClassroomUseCase
  implements IUpdateUseCase<Partial<Classroom>, Classroom>
{
  private readonly repository: IRepository<Classroom, string>;

  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }

  async perform(id: string, data: Partial<Classroom>): Promise<Classroom> {
    const classroom = await this.repository.findById(id);

    if (!classroom) {
      throw new NotFoundException('Classroom', id);
    }

    const updatedClassroom = await this.repository.update(id, data);
    return updatedClassroom;
  }
}
