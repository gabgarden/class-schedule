import { DayOfWeek } from '../enums/day-of-week-enum';
import { TimeSlotPeriod } from '../enums/time-slot-period-enum';

export interface CreateScheduleDTO {
  teacherId: string;

  classroomId: string;

  scheduledDate: Date;

  dayOfWeek: DayOfWeek;

  period: TimeSlotPeriod;

  subject: string;

  description?: string;

  maxStudents?: number;

  isRecurring: boolean;

  recurrenceEndDate?: Date;
}
