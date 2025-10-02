import { Request, Response } from 'express';
import { IByIdUseCase } from '../../contracts/i-byid-uc';
import { Classroom } from '../../domain/entities/Classroom';
import { FindByIdClassroomDTO } from '../../domain/dtos/classroom/find-byid-classroom-dto';
import { IValidationService } from '../../contracts/i-validation-service';
import { NotFoundException } from '../../exceptions/not-found-exception';
import { ValidationException } from '../../exceptions/validation-exception';

export class FindByIdClassroomController {
  usecase: IByIdUseCase<Classroom>;
  validationService: IValidationService;

  constructor(
    usecase: IByIdUseCase<Classroom>,
    validationService: IValidationService
  ) {
    this.usecase = usecase;
    this.validationService = validationService;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedDto =
        await this.validationService.validate<FindByIdClassroomDTO>(
          FindByIdClassroomDTO,
          req.params
        );

      const { id } = validatedDto;

      const classroom = await this.usecase.perform(id);

      return res.status(200).json(classroom);
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

      console.error('FindByIdClassroomController error:', error);
      return res.status(500).json({
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
