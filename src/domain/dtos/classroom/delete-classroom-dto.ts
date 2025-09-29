import { IsMongoId } from 'class-validator';

export class DeleteClassroomDTO {
  @IsMongoId()
  classroomId!: string;
}
