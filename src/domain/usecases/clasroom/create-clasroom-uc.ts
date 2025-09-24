import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IRepository } from '../../../contracts/i-repository';
import { CreateClassroomDTO } from '../../dtos/create-classroom-dto';
import { Classroom } from '../../entities/Classroom';

export class CreateClassroomUseCase
  implements ICommandUseCase<CreateClassroomDTO, Classroom>
{
  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }
  private repository: IRepository<Classroom, string>;
  async perform(data: CreateClassroomDTO): Promise<Classroom> {
    const classroom = new Classroom(data.classroomNumber, data.capacity);
    return await this.repository.create(classroom);
  }
}
