import { Request, response, Response } from 'express';
import { CreateTeacherDTO } from '../../domain/dtos/teacher/create-teacher-dto';
import { ICommandUseCase } from '../../contracts/i-command-uc';
import { Teacher } from '../../domain/entities/Teacher';
import { IValidationService } from '../../contracts/i-validation-service';
import { ValidationException } from '../../exceptions/validation-exception';

export class CreateTeacherController {
  usecase: ICommandUseCase<CreateTeacherDTO, Teacher>;
  validationService: IValidationService;

  constructor(
    usecase: ICommandUseCase<CreateTeacherDTO, Teacher>,
    validationService: IValidationService
  ) {
    this.usecase = usecase;
    this.validationService = validationService;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedDto =
        await this.validationService.validate<CreateTeacherDTO>(
          CreateTeacherDTO,
          req.body
        );

      const teacher = await this.usecase.perform(validatedDto);

      return res.status(201).json(teacher).end();
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
