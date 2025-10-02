import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindByIdTeacherDTO {
  @IsMongoId()
  @IsNotEmpty({ message: 'Teacher id is required' })
  id!: string;
}
