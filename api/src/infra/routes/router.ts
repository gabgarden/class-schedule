import { Router } from 'express';
import { CreateTeacherRouter } from './teacher/create-teacher-route';
import { DeleteTeacherRouter } from './teacher/delete-teacher-router';
import { ListTeachersRouter } from './teacher/list-teachers-router';

export default function router() {
  const mainRouter = Router();

  // Teachers routes
  mainRouter.use('/teachers', CreateTeacherRouter());
  mainRouter.use('/teachers', DeleteTeacherRouter());
  mainRouter.use('/teachers', ListTeachersRouter());

  //mainRouter.use('/teachers', UpdateTeacherRouter());

  // Other entity routes gonna be addedd here as well

  return mainRouter;
}
