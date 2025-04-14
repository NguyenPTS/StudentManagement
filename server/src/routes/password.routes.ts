import { Router } from 'express';
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from '../controllers/password.controller';

const router = Router();

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     summary: Gửi email đặt lại mật khẩu
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email đã được gửi
 *       404:
 *         description: Không tìm thấy tài khoản
 */
router.post('/forgot', forgotPassword);

/**
 * @swagger
 * /password/verify/{token}:
 *   get:
 *     summary: Kiểm tra token đặt lại mật khẩu
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token hợp lệ
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.get('/verify/:token', verifyResetToken);

/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.post('/reset', resetPassword);

export default router;