import { Router } from 'express';
import { CreateTeacherFactory } from '../../factories/teacher/create-teacher-factory';

export function CreateTeacherRouter() {
  const factory = CreateTeacherFactory();
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in teacher route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
