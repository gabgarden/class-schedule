import { Request, Response } from 'express';
import { IByIdUseCase } from '../../contracts/i-byid-uc';

export class DeleteTeacherController {
  usecase: IByIdUseCase<void>;

  constructor(usecase: IByIdUseCase<void>) {
    this.usecase = usecase;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const id: string = req.params.id;

      if (!id) {
        return res.status(400).json({ message: 'ID is required' }).end();
      }

      await this.usecase.perform(id);

      return res.status(204).end();
    } catch (error) {
      console.error(error);

      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ message: 'Teacher not found' }).end();
      }

      return res.status(500).json({ message: 'Internal server error' }).end();
    }
  }
}
