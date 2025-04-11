import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeTeacher } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Student Management
 *   description: API endpoints for managing students
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lấy danh sách sinh viên
 *     tags: [Student Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Lọc theo lớp học
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticateJWT, authorizeTeacher, getStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Lấy thông tin sinh viên theo ID
 *     tags: [Student Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên
 *     responses:
 *       200:
 *         description: Thông tin sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sinh viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticateJWT, authorizeTeacher, getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Tạo sinh viên mới
 *     tags: [Student Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sinh viên
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của sinh viên
 *               classId:
 *                 type: string
 *                 description: ID của lớp học
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Trạng thái của sinh viên
 *     responses:
 *       201:
 *         description: Sinh viên được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticateJWT, authorizeTeacher, createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Cập nhật thông tin sinh viên
 *     tags: [Student Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sinh viên
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của sinh viên
 *               classId:
 *                 type: string
 *                 description: ID của lớp học
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Trạng thái của sinh viên
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sinh viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authenticateJWT, authorizeTeacher, updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Xóa sinh viên
 *     tags: [Student Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sinh viên đã được xóa
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sinh viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authenticateJWT, authorizeTeacher, deleteStudent);

export default router;
