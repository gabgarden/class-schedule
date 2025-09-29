import { Request, Response } from 'express';
import { ICommandUseCase } from '../../contracts/i-command-uc';
import { CreateScheduleDTO } from '../../domain/dtos/schedule/create-schedule-dto';
import { Schedule } from '../../domain/entities/Schedule';
import { ScheduleConflictException } from '../../exceptions/schedule-conflict-exception';

export class CreateScheduleController {
  private readonly usecase: ICommandUseCase<CreateScheduleDTO, Schedule>;

  constructor(usecase: ICommandUseCase<CreateScheduleDTO, Schedule>) {
    this.usecase = usecase;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateScheduleDTO = req.body;
      const schedule = await this.usecase.perform(data);
      return res.status(201).json(schedule);
    } catch (error: any) {
      if (error instanceof ScheduleConflictException) {
        return res.status(409).json({
          error: 'Schedule conflict',
          message: error.message,
          type: error.type,
          details: error.details,
        });
      }

      if (
        error.message?.includes('not found') ||
        error.message?.includes('cannot be in the past') ||
        error.message?.includes('required when')
      ) {
        return res.status(422).json({
          error: 'Business rule violation',
          message: error.message,
        });
      }

      // Erros desconhecidos (500 - Internal Server Error)
      console.error('CreateScheduleController error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  }
}
