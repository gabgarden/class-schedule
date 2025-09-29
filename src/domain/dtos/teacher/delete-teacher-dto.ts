import { IsMongoId } from 'class-validator';

export class DeleteTeacherDTO {
  @IsMongoId()
  teacherId!: string;
}
