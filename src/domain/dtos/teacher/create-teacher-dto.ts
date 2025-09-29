import { IsEmail, IsString } from 'class-validator';

export class CreateTeacherDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;
}
