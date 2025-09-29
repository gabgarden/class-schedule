import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

import { TimeSlotPeriod } from '../../enums/time-slot-period-enum';
import { SubjectsEnum } from '../../enums/subjetcs-enum';

export class CreateScheduleDTO {
  @IsMongoId()
  teacherId!: string;

  @IsMongoId()
  classroomId!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsEnum(TimeSlotPeriod)
  period!: TimeSlotPeriod;

  @IsEnum(SubjectsEnum)
  subject!: SubjectsEnum;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @IsBoolean()
  isRecurring!: boolean;

  @IsOptional()
  @IsDateString()
  recurrenceEndDate?: string;
}
