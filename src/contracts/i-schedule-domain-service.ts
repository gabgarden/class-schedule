import { CreateScheduleDTO } from './../domain/dtos/create-schedule-dto';

export interface IScheduleDomainService {
  checkConflicts(dto: CreateScheduleDTO): Promise<void>;
}
