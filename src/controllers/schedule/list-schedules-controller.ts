import { Request, Response } from 'express';
import { IQueryUseCase } from '../../contracts/i-query-uc';
import { Classroom } from '../../domain/entities/Classroom';
import { Schedule } from '../../domain/entities/Schedule';

export class ListSchedulesController {
  usecase: IQueryUseCase<Schedule[]>;

  constructor(usecase: IQueryUseCase<Schedule[]>) {
    this.usecase = usecase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await this.usecase.perform();
      res.status(200).json({
        success: true,
        data: schedules,
        count: schedules.length,
      });
    } catch (error) {
      console.error('Error in ListSchedulesController:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list schedules',
      });
    }
  }
}
