import { Request, Response } from 'express';
import { ICommandUseCase } from '../../contracts/i-command-uc';
import { CreateScheduleDTO } from '../../domain/dtos/create-schedule-dto';
import { Schedule } from '../../domain/entities/Schedule';

export class CreateScheduleController {
  private readonly usecase: ICommandUseCase<CreateScheduleDTO, Schedule>;

  constructor(usecase: ICommandUseCase<CreateScheduleDTO, Schedule>) {
    this.usecase = usecase;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateScheduleDTO = req.body;

      const schedule = await this.usecase.perform(data);

      return res.status(201).json(schedule).end();
    } catch (error) {
      console.error(error);

      return res.status(500).json({ message: 'Internal server error' }).end();
    }
  }
}
