import { Request, Response } from 'express';
import { IByIdUseCase } from '../../contracts/i-byid-uc';
import { FindByIdTeacherDTO } from '../../domain/dtos/teacher/find-byid-teacher-dto';
import { IValidationService } from '../../contracts/i-validation-service';
import { NotFoundException } from '../../exceptions/not-found-exception';
import { ValidationException } from '../../exceptions/validation-exception';
import { Teacher } from '../../domain/entities/Teacher';

export class FindByIdTeacherController {
  usecase: IByIdUseCase<Teacher>;
  validationService: IValidationService;

  constructor(
    usecase: IByIdUseCase<Teacher>,
    validationService: IValidationService
  ) {
    this.usecase = usecase;
    this.validationService = validationService;
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const validatedDto =
        await this.validationService.validate<FindByIdTeacherDTO>(
          FindByIdTeacherDTO,
          req.params
        );

      const { id } = validatedDto;

      const teacher = await this.usecase.perform(id);

      return res.status(200).json(teacher);
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

      console.error('FindByIdTeacherController error:', error);
      return res.status(500).json({
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
