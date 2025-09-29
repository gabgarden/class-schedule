import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IRepository } from '../../../contracts/i-repository';
import { CreateTeacherDTO } from '../../dtos/teacher/create-teacher-dto';
import { Teacher } from '../../entities/Teacher';

export class CreateTeacherUseCase
  implements ICommandUseCase<CreateTeacherDTO, Teacher>
{
  private repository: IRepository<Teacher, string>;

  constructor(repository: IRepository<Teacher, string>) {
    this.repository = repository;
  }

  async perform(validatedDto: CreateTeacherDTO): Promise<Teacher> {
    const teacher = new Teacher(
      validatedDto.name,
      validatedDto.email,
      validatedDto.subjects
    );
    return await this.repository.create(teacher);
  }
}
