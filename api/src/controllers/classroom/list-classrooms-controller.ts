import { Request, Response } from 'express';
import { IQueryUseCase } from '../../contracts/i-query-uc';
import { Teacher } from '../../domain/entities/Teacher';
import { Classroom } from '../../domain/entities/Classroom';

export class ListClassroomsController {
  usecase: IQueryUseCase<Classroom[]>;

  constructor(usecase: IQueryUseCase<Classroom[]>) {
    this.usecase = usecase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const classrooms = await this.usecase.perform();
      res.status(200).json({
        success: true,
        data: classrooms,
        count: classrooms.length,
      });
    } catch (error) {
      console.error('Error in ListClassroomsController:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list classrooms',
      });
    }
  }
}
