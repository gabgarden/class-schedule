import { Router } from 'express';
import { CreateClassroomFactory } from '../../factories/classroom/create-classroom-factory';

export function CreateClassroomRoute() {
  const factory = CreateClassroomFactory();
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in classroom route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
