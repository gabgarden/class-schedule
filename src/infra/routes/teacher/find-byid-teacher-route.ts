import { Router } from 'express';
import { FindByIdTeacherFactory } from '../../factories/teacher/find-byid-teacher-factory';

export function FindByIdTeacherRoute() {
  const factory = FindByIdTeacherFactory();
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in teacher route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
