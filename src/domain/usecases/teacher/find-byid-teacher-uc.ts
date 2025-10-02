import { IByIdUseCase } from '../../../contracts/i-byid-uc';
import { IRepository } from '../../../contracts/i-repository';
import { NotFoundException } from '../../../exceptions/not-found-exception';
import { Teacher } from '../../entities/Teacher';

export class FindByIdTeacherUseCase implements IByIdUseCase<Teacher> {
  constructor(private readonly repository: IRepository<Teacher, string>) {}

  async perform(id: string): Promise<Teacher> {
    const teacher = await this.repository.findById(id);

    if (!teacher) {
      throw new NotFoundException('Teacher', id);
    }

    return teacher;
  }
}
