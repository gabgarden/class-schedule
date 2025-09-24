import mongoose from 'mongoose';
import { ScheduleStatus } from '../../domain/enums/schedule-status-enum';
import { DayOfWeek } from '../../domain/enums/day-of-week-enum';
import { TimeSlotPeriod } from '../../domain/enums/time-slot-period-enum';

const scheduleSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: Object.values(DayOfWeek),
      required: true,
    },
    period: {
      type: String,
      enum: Object.values(TimeSlotPeriod),
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    maxStudents: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(ScheduleStatus),
      required: true,
      default: ScheduleStatus.PENDING,
    },
    isRecurring: {
      type: Boolean,
      required: true,
      default: false,
    },
    recurrenceEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'schedules',
  }
);

scheduleSchema.pre('save', function () {
  if (this.isModified('scheduledDate') || this.isNew) {
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    this.dayOfWeek = days[this.scheduledDate.getDay()];
  }
});

export default mongoose.model('Schedule', scheduleSchema);
