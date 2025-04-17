import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

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
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["admin", "teacher", "student"],
              description: "User's role",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              description: "User's status",
            },
          },
        },
        Class: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Class ID",
            },
            name: {
              type: "string",
              description: "Class name",
            },
            code: {
              type: "string",
              description: "Class code",
            },
            description: {
              type: "string",
              description: "Class description",
            },
            teacher: {
              type: "string",
              description: "Teacher ID",
            },
            students: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of student IDs",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              description: "Class status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CreateClassDTO: {
          type: "object",
          required: ["name", "code"],
          properties: {
            name: {
              type: "string",
              description: "Class name",
            },
            code: {
              type: "string",
              description: "Class code",
            },
            description: {
              type: "string",
              description: "Class description",
            },
            teacher: {
              type: "string",
              description: "Teacher ID",
            },
          },
        },
        UpdateClassDTO: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Class name",
            },
            code: {
              type: "string",
              description: "Class code",
            },
            description: {
              type: "string",
              description: "Class description",
            },
            teacher: {
              type: "string",
              description: "Teacher ID",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              description: "Class status",
            },
          },
        },
        ClassStats: {
          type: "object",
          properties: {
            totalStudents: {
              type: "number",
              description: "Total number of students",
            },
            averageScore: {
              type: "number",
              description: "Average score of all students",
            },
            attendanceRate: {
              type: "number",
              description: "Average attendance rate",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.ts")], // Sử dụng đường dẫn tuyệt đối
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);


