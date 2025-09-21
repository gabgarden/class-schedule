import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IRepository } from '../../../contracts/i-repository';
import { CreateTeacherDTO } from '../../dtos/create-teacher-dto';
import { Teacher } from '../../entities/Teacher';

export class CreateTeacherUseCase
  implements ICommandUseCase<CreateTeacherDTO, Teacher>
{
  private repository: IRepository<Teacher, string>;

  constructor(repository: IRepository<Teacher, string>) {
    this.repository = repository;
  }

  async perform(data: CreateTeacherDTO): Promise<Teacher> {
    return await this.repository.create(data);
  }
}
