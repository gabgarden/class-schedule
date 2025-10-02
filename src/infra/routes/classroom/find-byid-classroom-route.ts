import { Router } from 'express';
import { FindByIdClassroomFactory } from '../../factories/classroom/find-byid-classroom-factory';

export function FindByIdClassroomRoute() {
  const factory = FindByIdClassroomFactory();
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in classroom route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
