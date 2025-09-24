import { IsNumber } from 'class-validator';

export class CreateClassroomDTO {
  @IsNumber()
  classroomNumber!: number;

  @IsNumber()
  capacity!: number;
}
