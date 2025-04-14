import nodemailer from "nodemailer";
import crypto from "crypto";

// Tạo transporter cho nodemailer
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Tạo token ngẫu nhiên
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Tạo URL đặt lại mật khẩu
export const createResetPasswordUrl = (token: string) => {
  return `${process.env.FRONTEND_URL}/reset-password/${token}`;
};

// Gửi email đặt lại mật khẩu
export const sendResetPasswordEmail = async (
  email: string,
  resetUrl: string
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    html: `
      <h1>Yêu cầu đặt lại mật khẩu</h1>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tiếp tục:</p>
      <a href="${resetUrl}">Đặt lại mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
