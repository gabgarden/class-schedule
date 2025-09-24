import { Classroom } from '../../domain/entities/Classroom';
import { Request, response, Response } from 'express';
import { CreateClassroomDTO } from '../../domain/dtos/create-classroom-dto';
import { ICommandUseCase } from '../../contracts/i-command-uc';

export class CreateClassroomController {
  usecase: ICommandUseCase<CreateClassroomDTO, Classroom>;

  constructor(usecase: ICommandUseCase<CreateClassroomDTO, Classroom>) {
    this.usecase = usecase;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateClassroomDTO = req.body;

      const classroom = await this.usecase.perform(data);

      return res.status(201).json(classroom).end();
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Internal server error' })
        .end();
    }
  }
}
