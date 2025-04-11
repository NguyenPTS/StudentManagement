import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management API",
      version: "1.0.0",
      description: "API documentation for the Student Management system",
    },
    servers: [
      {
        url: "http://localhost:5000", // Thay đổi URL nếu cần
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Đường dẫn tới các file định nghĩa route
};

export default swaggerOptions;
