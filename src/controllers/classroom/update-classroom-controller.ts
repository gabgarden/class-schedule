import { IUpdateUseCase } from '../../contracts/i-update-uc';
import { IValidationService } from '../../contracts/i-validation-service';
import { UpdateClassroomDTO } from '../../domain/dtos/classroom/update-classroom-dto';
import { Classroom } from '../../domain/entities/Classroom';
import { ValidationException } from '../../exceptions/validation-exception';

export class UpdateClassroomController {
  private readonly updateClassroomUseCase: IUpdateUseCase<
    UpdateClassroomDTO,
    Classroom
  >;
  private readonly validationService: IValidationService;

  constructor(
    updateClassroomUseCase: IUpdateUseCase<UpdateClassroomDTO, Classroom>,
    validationService: IValidationService
  ) {
    this.updateClassroomUseCase = updateClassroomUseCase;
    this.validationService = validationService;
  }

  public async handle(req: any, res: any): Promise<Classroom> {
    try {
      const validatedDto =
        await this.validationService.validate<UpdateClassroomDTO>(
          UpdateClassroomDTO,
          req.body
        );

      const { classroomId: id } = validatedDto;

      const updateClassroom = await this.updateClassroomUseCase.perform(
        id,
        validatedDto
      );
      return res.status(200).json(updateClassroom);
    } catch (error: any) {
      if (error instanceof ValidationException)
        return res.status(400).json({
          message: error.message,
          errors: error.errors,
        });

      console.error('UpdateClassroomController error:', error);
      return res
        .status(500)
        .json({ message: error.message || 'Internal server error' });
    }
  }
}
