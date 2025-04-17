import { Router } from 'express';
import {
  createOrUpdateGrade,
  getStudentGrade,
  getClassGrades,
  getClassStatistics,
  deleteGrade,
} from '../controllers/grade.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { RequestHandler } from 'express-serve-static-core';

const router = Router();

// Protected routes - require authentication
router.use(authenticate as RequestHandler);

// Routes accessible by both teachers and admins
router.get(
  '/class/:classId/statistics',
  authorize(['teacher', 'admin']) as RequestHandler,
  getClassStatistics as RequestHandler
);

router.get(
  '/class/:classId',
  authorize(['teacher', 'admin']) as RequestHandler,
  getClassGrades as RequestHandler
);

router.get(
  '/student/:studentId/class/:classId',
  authorize(['teacher', 'admin']) as RequestHandler,
  getStudentGrade as RequestHandler
);

// Routes accessible only by teachers
router.post(
  '/',
  authorize(['teacher']) as RequestHandler,
  createOrUpdateGrade as RequestHandler
);

router.delete(
  '/student/:studentId/class/:classId',
  authorize(['teacher']) as RequestHandler,
  deleteGrade as RequestHandler
);

export default router; 