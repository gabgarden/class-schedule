import { Router } from 'express';
import { CreateTeacherRouter } from './teacher/create-teacher-route';
import { DeleteTeacherRouter } from './teacher/delete-teacher-router';
import { ListTeachersRouter } from './teacher/list-teachers-router';
import { CreateClassroomRoute } from './classroom/create-classroom-route';
import { DeleteClassroomRoute } from './classroom/delete-clasroom-route';
import { ListClassroomsRoute } from './classroom/list-classrooms-route';

export default function router() {
  const mainRouter = Router();

  // Teachers routes
  mainRouter.use('/teachers', CreateTeacherRouter());
  mainRouter.use('/teachers', DeleteTeacherRouter());
  mainRouter.use('/teachers', ListTeachersRouter());
  //mainRouter.use('/teachers', UpdateTeacherRouter());

  // Classrooms routes
  mainRouter.use('/classrooms', CreateClassroomRoute());
  mainRouter.use('/classrooms', DeleteClassroomRoute());
  mainRouter.use('/classrooms', ListClassroomsRoute());
  //mainRouter.use('/classrooms', UpdateClassroomRoute());

  return mainRouter;
}
