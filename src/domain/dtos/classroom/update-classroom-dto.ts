import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class UpdateClassroomDTO {
  @IsNumber()
  @IsOptional()
  classroomNumber!: number;

  @IsNumber()
  @IsOptional()
  capacity!: number;

  @IsMongoId()
  classroomId!: string;
}
