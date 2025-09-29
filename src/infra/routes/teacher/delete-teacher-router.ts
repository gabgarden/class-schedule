import { Router } from 'express';
import { DeleteTeacherFactory } from '../../factories/teacher/delete-teacher-factory';

export function DeleteTeacherRouter() {
  const factory = DeleteTeacherFactory();
  const router = Router();

  router.delete('/', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in teacher route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
