import { CreateScheduleDTO } from './../domain/dtos/schedule/create-schedule-dto';

export interface IScheduleDomainService {
  checkConflicts(dto: CreateScheduleDTO): Promise<void>;
}
