import { Router } from 'express';
import { DeleteTeacherFactory } from '../../factories/teacher/delete-teacher-factory';
import { DeleteClassroomFactory } from '../../factories/classroom/delete-clasroom-factory';

export function DeleteClassroomRoute() {
  const factory = DeleteClassroomFactory();
  const router = Router();

  router.delete('/:id', async (req, res) => {
    try {
      await factory.handle(req, res);
    } catch (error) {
      console.error('Error in classroom route:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
