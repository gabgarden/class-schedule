import { TimeSlotPeriod } from '../enums/time-slot-period-enum';

export interface CreateScheduleDTO {
  teacherId: string;
  classroomId: string;
  scheduledDate: Date;
  period: TimeSlotPeriod;
  subject: string;
  description?: string;
  maxStudents?: number;
  isRecurring: boolean;
  recurrenceEndDate?: Date;
}
