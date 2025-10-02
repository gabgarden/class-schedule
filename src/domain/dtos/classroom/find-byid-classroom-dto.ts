import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindByIdClassroomDTO {
  @IsMongoId()
  @IsNotEmpty({ message: 'Classroom id is required' })
  id!: string;
}
