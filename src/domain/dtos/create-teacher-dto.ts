import { IsEmail, IsNumber } from 'class-validator';

export class CreateTeacherDTO {
  @IsNumber()
  name!: string;

  @IsEmail()
  email!: string;
}
