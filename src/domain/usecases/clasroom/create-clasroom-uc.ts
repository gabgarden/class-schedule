import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IRepository } from '../../../contracts/i-repository';
import { CreateClasroomDTO } from '../../dtos/create-classroom-dto';
import { Classroom } from '../../entities/Classroom';

export class CreateClassroomUseCase
  implements ICommandUseCase<CreateClasroomDTO, Classroom>
{
  constructor(repository: IRepository<Classroom, string>) {
    this.repository = repository;
  }
  private repository: IRepository<Classroom, string>;
  async perform(data: CreateClasroomDTO): Promise<Classroom> {
    const classroom = new Classroom(data.classroomNumber, data.capacity);
    return await this.repository.create(classroom);
  }
}
