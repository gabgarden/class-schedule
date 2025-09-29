import { IByIdUseCase } from '../../contracts/i-byid-uc';
import { Request, Response } from 'express';
import { DeleteClassroomDTO } from '../../domain/dtos/classroom/delete-classroom-dto';
import { IValidationService } from '../../contracts/i-validation-service';
import { NotFoundException } from '../../exceptions/not-found-exception';
import { ValidationException } from '../../exceptions/validation-exception';

export class DeleteClassroomController {
  usecase: IByIdUseCase<void>;
  validationService: IValidationService;
  constructor(
    usecase: IByIdUseCase<void>,
    validationService: IValidationService
  ) {
    this.usecase = usecase;
    this.validationService = validationService;
  }
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedDto =
        await this.validationService.validate<DeleteClassroomDTO>(
          DeleteClassroomDTO,
          req.body
        );

      const { classroomId: id } = validatedDto;

      await this.usecase.perform(id);

      return res.status(204).end();
    } catch (error: any) {
      if (error instanceof ValidationException) {
        return res.status(400).json({
          message: error.message,
          errors: error.errors,
        });
      }

      if (error instanceof NotFoundException) {
        return res.status(404).json({
          message: error.message,
        });
      }

      console.error('DeleteClassroomController error:', error);
      return res.status(500).json({
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
