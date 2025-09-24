import { TimeSlotPeriod } from '../enums/time-slot-period-enum';

export const TIME_SLOT_CONFIG = {
  [TimeSlotPeriod.PERIOD_NIGHT_1]: {
    startTime: '18:20',
    endTime: '19:10',
    durationInMinutes: 50,
  },
  [TimeSlotPeriod.PERIOD_NIGHT_2]: {
    startTime: '19:10',
    endTime: '20:00',
    durationInMinutes: 50,
  },
  [TimeSlotPeriod.PERIOD_NIGHT_3]: {
    startTime: '20:10',
    endTime: '21:00',
    durationInMinutes: 50,
  },
  [TimeSlotPeriod.PERIOD_NIGHT_4]: {
    startTime: '21:00',
    endTime: '21:50',
    durationInMinutes: 50,
  },
  [TimeSlotPeriod.PERIOD_NIGHT_5]: {
    startTime: '21:50',
    endTime: '22:40',
    durationInMinutes: 50,
  },
};
