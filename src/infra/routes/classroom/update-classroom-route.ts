import { Router } from 'express';
import { UpdateClassroomFactory } from '../../factories/classroom/update-classroom-factory';

export function UpdateClassroomRoute() {
  const factory = UpdateClassroomFactory();
  const router = Router();

  router.patch('/', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in classroom route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
