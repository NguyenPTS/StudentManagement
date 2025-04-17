import express, { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../middlewares/auth.middleware';
import teacherController from '../controllers/teacher.controller';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Quản lý giáo viên
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Lấy danh sách giáo viên
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Lọc theo môn học
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Lọc theo chuyên môn
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, môn học, chuyên môn
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng item trên mỗi trang
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/', authenticateJWT, teacherController.getAllTeachers);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Lấy thông tin giáo viên theo ID
 *     tags: [Teachers]
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
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.get('/:id', authenticateJWT, teacherController.getTeacherById);

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Tạo giáo viên mới
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', authenticateJWT, authorizeRole(['admin']), teacherController.createTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Cập nhật thông tin giáo viên
 *     tags: [Teachers]
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
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.put('/:id', authenticateJWT, authorizeRole(['admin']), teacherController.updateTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Xóa giáo viên
 *     tags: [Teachers]
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
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), teacherController.deleteTeacher);

/**
 * @swagger
 * /teachers/{id}/classes:
 *   get:
 *     summary: Lấy danh sách lớp học của giáo viên
 *     tags: [Teachers]
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
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.get('/:id/classes', authenticateJWT, teacherController.getTeacherClasses);

/**
 * @swagger
 * /teachers/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái giáo viên
 *     tags: [Teachers]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, blocked]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.put('/:id/status', authenticateJWT, authorizeRole(['admin']), teacherController.updateTeacherStatus);

/**
 * @swagger
 * /teachers/{id}/classes:
 *   post:
 *     summary: Thêm lớp học cho giáo viên
 *     tags: [Teachers]
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
 *               - classId
 *             properties:
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm lớp thành công
 *       404:
 *         description: Không tìm thấy giáo viên hoặc lớp học
 */
router.post('/:id/classes', authenticateJWT, authorizeRole(['admin']), teacherController.addTeacherClass);

/**
 * @swagger
 * /teachers/{id}/classes/{classId}:
 *   delete:
 *     summary: Xóa lớp học khỏi giáo viên
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa lớp thành công
 *       404:
 *         description: Không tìm thấy giáo viên hoặc lớp học
 */
router.delete('/:id/classes/:classId', authenticateJWT, authorizeRole(['admin']), teacherController.removeTeacherClass);

/**
 * @swagger
 * /teachers/{id}/rating:
 *   post:
 *     summary: Thêm đánh giá cho giáo viên
 *     tags: [Teachers]
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Thêm đánh giá thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.post('/:id/rating', authenticateJWT, teacherController.addTeacherRating);

/**
 * @swagger
 * /teachers/{id}/stats:
 *   get:
 *     summary: Lấy thống kê của giáo viên
 *     tags: [Teachers]
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
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.get('/:id/stats', authenticateJWT, teacherController.getTeacherStats);

export default router; 