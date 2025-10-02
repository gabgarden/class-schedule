import { Not } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/internal/type.d';
import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { Classroom } from '../../entities/Classroom';
import { NotFoundException } from '../../../exceptions/not-found-exception';

export class FindByIdClassroomUseCase implements IByIdUseCase<Classroom> {
  constructor(private readonly repository: IRepository<Classroom, string>) {}

  async perform(id: string): Promise<Classroom> {
    const classroom = await this.repository.findById(id);

    if (!classroom) {
      throw new NotFoundException('Classroom', id);
    }

    return classroom;
  }
}
