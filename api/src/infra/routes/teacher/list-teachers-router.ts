import { Router } from 'express';
import { ListTeachersFactory } from '../../factories/teacher/list-teachers-factory';

export function ListTeachersRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const controller = ListTeachersFactory();
      await controller.handle(req, res);
    } catch (error) {
      console.error('Error in teacher route:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  return router;
}
