import { ScheduleStatus } from '../enums/schedule-status-enum';
import { Classroom } from './Classroom';
import { Teacher } from './Teacher';
import { DayOfWeek } from '../enums/day-of-week-enum';
import { TimeSlotPeriod } from '../enums/time-slot-period-enum';

export class Schedule {
  teacher: Teacher;
  classroom: Classroom;

  scheduledDate: Date;
  dayOfWeek: DayOfWeek;
  period: TimeSlotPeriod;

  subject: string;
  description?: string;
  maxStudents?: number;

  status: ScheduleStatus;

  isRecurring: boolean;
  recurrenceEndDate?: Date;

  constructor(
    teacher: Teacher,
    classroom: Classroom,
    scheduledDate: Date,
    dayOfWeek: DayOfWeek,
    period: TimeSlotPeriod,
    subject: string,
    status: ScheduleStatus,
    isRecurring: boolean,
    description?: string,
    maxStudents?: number,
    recurrenceEndDate?: Date
  ) {
    this.teacher = teacher;
    this.classroom = classroom;
    this.scheduledDate = scheduledDate;
    this.dayOfWeek = dayOfWeek;
    this.period = period;
    this.subject = subject;
    this.description = description;
    this.maxStudents = maxStudents;
    this.status = status;
    this.isRecurring = isRecurring;
    this.recurrenceEndDate = recurrenceEndDate;
  }
}
