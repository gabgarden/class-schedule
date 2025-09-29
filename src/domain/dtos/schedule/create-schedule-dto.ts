import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

import { TimeSlotPeriod } from '../enums/time-slot-period-enum';

export class CreateScheduleDTO {
  @IsMongoId()
  teacherId!: string;

  @IsMongoId()
  classroomId!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsEnum(TimeSlotPeriod)
  period!: TimeSlotPeriod;

  @IsString()
  @IsNotEmpty()
  subject!: string;

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
