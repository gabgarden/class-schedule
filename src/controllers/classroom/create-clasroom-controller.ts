import { Request, Response } from 'express';
import { CreateClassroomDTO } from '../../domain/dtos/classroom/create-classroom-dto';
import { ICommandUseCase } from '../../contracts/i-command-uc';
import { Classroom } from '../../domain/entities/Classroom';
import { IValidationService } from '../../contracts/i-validation-service';
import { ValidationException } from '../../exceptions/validation-exception';

export class CreateClassroomController {
  private readonly usecase: ICommandUseCase<CreateClassroomDTO, Classroom>;
  private readonly validationService: IValidationService;

  constructor(
    usecase: ICommandUseCase<CreateClassroomDTO, Classroom>,
    validationService: IValidationService
  ) {
    this.usecase = usecase;
    this.validationService = validationService;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedDto =
        await this.validationService.validate<CreateClassroomDTO>(
          CreateClassroomDTO,
          req.body
        );

      const classroom = await this.usecase.perform(validatedDto);

      return res.status(201).json(classroom);
    } catch (error: any) {
      if (error instanceof ValidationException) {
        return res.status(400).json({
          message: error.message,
          errors: error.errors,
        });
      }

      console.error('CreateClassroomController error:', error);

      return res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
}
