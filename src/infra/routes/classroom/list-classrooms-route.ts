import { Router } from 'express';
import { ListClassroomsFactory } from '../../factories/classroom/list-classrooms-factory';

export function ListClassroomsRoute() {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const controller = ListClassroomsFactory();
      await controller.handle(req, res);
    } catch (error) {
      console.error('Error in classroom route:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  return router;
}
