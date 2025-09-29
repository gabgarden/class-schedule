import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IValidationService } from '../../contracts/i-validation-service';
import { ValidationException } from '../../exceptions/validation-exception';

export class ValidationService implements IValidationService {
  async validate<T>(dtoClass: any, plainObject: any): Promise<T> {
    const dto = plainToInstance(dtoClass, plainObject);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new ValidationException(
        'Validation failed',
        errors.map((e) => e.constraints)
      );
    }

    return dto as T;
  }
}
