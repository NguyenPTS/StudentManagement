import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";

// Load biến môi trường
dotenv.config();

// Đường dẫn tới file JSON
const serviceAccountPath = path.resolve(__dirname, "./serviceAccountKey.json");

// Load file JSON
const serviceAccount = require(serviceAccountPath);

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
