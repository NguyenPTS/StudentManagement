import express, { RequestHandler } from "express";
import classController from "../controllers/class.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management API
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
router.get("/", classController.getAll as RequestHandler);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 */
router.get("/:id", classController.getById as RequestHandler);

/**
 * @swagger
 * /classes/{id}/students:
 *   get:
 *     summary: Get students in a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students in the class
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get("/:id/students", classController.getStudents as RequestHandler);

/**
 * @swagger
 * /classes/{id}/stats:
 *   get:
 *     summary: Get class statistics
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassStats'
 */
router.get("/:id/stats", classController.getStats as RequestHandler);

// Protected routes
router.use(authenticateJWT as RequestHandler);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClassDTO'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 */
router.post("/", 
  authorizeRole(["admin", "teacher"]) as RequestHandler,
  classController.create as RequestHandler
);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClassDTO'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 */
router.put("/:id", 
  authorizeRole(["admin", "teacher"]) as RequestHandler,
  classController.update as RequestHandler
);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted successfully
 */
router.delete("/:id", 
  authorizeRole(["admin"]) as RequestHandler,
  classController.remove as RequestHandler
);

/**
 * @swagger
 * /classes/{id}/students:
 *   post:
 *     summary: Add a student to class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student added successfully
 */
router.post("/:id/students", 
  authorizeRole(["admin", "teacher"]) as RequestHandler,
  classController.addStudent as RequestHandler
);

/**
 * @swagger
 * /classes/{id}/students:
 *   delete:
 *     summary: Remove a student from class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student removed successfully
 */
router.delete("/:id/students", 
  authorizeRole(["admin", "teacher"]) as RequestHandler,
  classController.removeStudent as RequestHandler
);

export default router; 