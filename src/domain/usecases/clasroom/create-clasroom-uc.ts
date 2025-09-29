import { ICommandUseCase } from '../../../contracts/i-command-uc';
import { IRepository } from '../../../contracts/i-repository';
import { CreateClassroomDTO } from '../../dtos/classroom/create-classroom-dto';
import { Classroom } from '../../entities/Classroom';

export class CreateClassroomUseCase
  implements ICommandUseCase<CreateClassroomDTO, Classroom>
{
  constructor(private readonly repository: IRepository<Classroom, string>) {}

  async perform(data: CreateClassroomDTO): Promise<Classroom> {
    const existing = await this.repository.findByField(
      'classroomNumber',
      data.classroomNumber
    );
    if (existing) {
      throw new Error(
        `Classroom number ${data.classroomNumber} already exists`
      );
    }

    const classroom = new Classroom(data.classroomNumber, data.capacity);

    return await this.repository.create(classroom);
  }
}
