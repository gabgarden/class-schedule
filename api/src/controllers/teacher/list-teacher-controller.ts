import { Request, Response } from 'express';
import { IQueryUseCase } from '../../contracts/i-query-uc';
import { Teacher } from '../../domain/entities/Teacher';

export class ListTeacherController {
  usecase: IQueryUseCase<Teacher[]>;

  constructor(usecase: IQueryUseCase<Teacher[]>) {
    this.usecase = usecase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const teachers = await this.usecase.perform();
      res.status(200).json({
        success: true,
        data: teachers,
        count: teachers.length,
      });
    } catch (error) {
      console.error('Error in ListTeacherController:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list teachers',
      });
    }
  }
}
