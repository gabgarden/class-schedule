import { IsEmail, IsEnum, IsString } from 'class-validator';
import { SubjectsEnum } from '../../enums/subjetcs-enum';

export class CreateTeacherDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(SubjectsEnum, { each: true })
  subjects!: SubjectsEnum[];
}
