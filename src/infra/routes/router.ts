import { Router } from 'express';
import { CreateTeacherRouter } from './teacher/create-teacher-route';
import { DeleteTeacherRouter } from './teacher/delete-teacher-router';
import { ListTeachersRouter } from './teacher/list-teachers-router';
import { CreateClassroomRoute } from './classroom/create-classroom-route';
import { DeleteClassroomRoute } from './classroom/delete-clasroom-route';
import { ListClassroomsRoute } from './classroom/list-classrooms-route';
import { CreateScheduleRoute } from './schedule/create-schedule-route';
import { UpdateClassroomRoute } from './classroom/update-classroom-route';
import { FindByIdClassroomRoute } from './classroom/find-byid-classroom-route';
import { FindByIdTeacherRoute } from './teacher/find-byid-teacher-route';
import { ListSchedulesRouter } from './schedule/list-schedules-route';

export default function router() {
  const mainRouter = Router();

  // Teachers routes
  mainRouter.use('/teachers', ListTeachersRouter());
  mainRouter.use('/teachers', CreateTeacherRouter());
  mainRouter.use('/teachers', DeleteTeacherRouter());
  mainRouter.use('/teachers', FindByIdTeacherRoute()); // GET /teachers/:id
  //mainRouter.use('/teachers', UpdateTeacherRouter());

  // Classrooms routes
  mainRouter.use('/classrooms', ListClassroomsRoute()); // GET /classrooms
  mainRouter.use('/classrooms', CreateClassroomRoute()); // POST /classrooms
  mainRouter.use('/classrooms', UpdateClassroomRoute()); // PUT /classrooms/:id
  mainRouter.use('/classrooms', DeleteClassroomRoute()); // DELETE /classrooms
  mainRouter.use('/classrooms', FindByIdClassroomRoute()); // GET /classrooms/:id

  //Schedules routes
  mainRouter.use('/schedules', ListSchedulesRouter());
  mainRouter.use('/schedules', CreateScheduleRoute());
  return mainRouter;
}
