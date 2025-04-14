import { Router } from "express";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";
import { Role } from "../models/user.model";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: ID của người dùng
 *         name:
 *           type: string
 *           description: Họ tên của người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         role:
 *           type: string
 *           enum: [admin, teacher]
 *           description: Vai trò của người dùng (admin - quản trị viên, teacher - giáo viên)
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *           description: Trạng thái tài khoản (active - hoạt động, inactive - không hoạt động, blocked - bị khóa)
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật tài khoản
 *     CreateUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Họ tên của người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Mật khẩu của người dùng (tối thiểu 6 ký tự)
 *         role:
 *           type: string
 *           enum: [admin, teacher]
 *           description: Vai trò của người dùng (admin - quản trị viên, teacher - giáo viên)
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *           description: Trạng thái tài khoản (active - hoạt động, inactive - không hoạt động, blocked - bị khóa)
 *           default: active
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Họ tên của người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Mật khẩu mới của người dùng (tối thiểu 6 ký tự)
 *         role:
 *           type: string
 *           enum: [admin, teacher]
 *           description: Vai trò của người dùng (admin - quản trị viên, teacher - giáo viên)
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *           description: Trạng thái tài khoản (active - hoạt động, inactive - không hoạt động, blocked - bị khóa)
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Thông báo lỗi
 */

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, teacher]
 *         description: Lọc theo vai trò
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, blocked]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
router.get("/", authenticateJWT, authorizeRole(["admin"]), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticateJWT, authorizeRole(["admin"]), getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [User Management]
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
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Họ tên của người dùng
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của người dùng
 *               role:
 *                 type: string
 *                 enum: [admin, teacher]
 *                 description: Vai trò của người dùng
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "string"
 *               name: "Nguyễn Văn A"
 *               email: "user@example.com"
 *               role: "admin"
 *               status: "active"
 *               createdAt: "2025-04-12T07:31:10.767Z"
 *               updatedAt: "2025-04-12T07:31:10.767Z"
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
router.post("/", authenticateJWT, authorizeRole(["admin"]), createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới của người dùng
 *               role:
 *                 type: string
 *                 enum: [admin, teacher]
 *                 description: Vai trò của người dùng
 *               status:
 *                 type: string
 *                 enum: [active, blocked]
 *                 description: Trạng thái tài khoản
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
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
 *                   example: Người dùng đã được xóa
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
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteUser);

export default router;
