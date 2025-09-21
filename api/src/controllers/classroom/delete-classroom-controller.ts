import { IByIdUseCase } from '../../contracts/i-byid-uc';
import { Request, Response } from 'express';

export class DeleteClasssroomController {
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
      return res.status(500).json({ message: 'Internal Server Error' }).end();
    }
  }
}
