import { Router } from 'express';
import { CreateScheduleFactory } from '../../factories/schedule/create-schedule-factory';

export function CreateScheduleRoute() {
  const factory = CreateScheduleFactory();
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in schedule route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
