import { Request, response, Response } from 'express';
import { CreateTeacherDTO } from '../../domain/dtos/create-teacher-dto';
import { ICommandUseCase } from '../../contracts/i-command-uc';
import { Teacher } from '../../domain/entities/Teacher';

export class CreateTeacherController {
  usecase: ICommandUseCase<CreateTeacherDTO, Teacher>;

  constructor(usecase: ICommandUseCase<CreateTeacherDTO, Teacher>) {
    this.usecase = usecase;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateTeacherDTO = req.body;

      const teacher = await this.usecase.perform(data);

      return res.status(201).json(teacher).end();
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Internal server error' })
        .end();
    }
  }
}
