import { Router } from 'express';
import { ListSchedulesFactory } from '../../factories/schedule/list-schedules-factory';

export function ListSchedulesRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const controller = ListSchedulesFactory();
      await controller.handle(req, res);
    } catch (error) {
      console.error('Error in schedule route:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  return router;
}
