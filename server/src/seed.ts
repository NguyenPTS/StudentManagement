import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Tạo admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
      status: "active",
    },
  });

  // Tạo giáo viên
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      password: await bcrypt.hash("teacher123", 10),
      role: "teacher",
      status: "active",
    },
  });

  // Tạo các lớp học
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { name: "Lớp 10A1" },
      update: {},
      create: {
        name: "Lớp 10A1",
        description: "Lớp chuyên Toán",
        teacherId: teacher.id,
      },
    }),
    prisma.class.upsert({
      where: { name: "Lớp 10A2" },
      update: {},
      create: {
        name: "Lớp 10A2",
        description: "Lớp chuyên Lý",
        teacherId: teacher.id,
      },
    }),
    prisma.class.upsert({
      where: { name: "Lớp 10A3" },
      update: {},
      create: {
        name: "Lớp 10A3",
        description: "Lớp chuyên Hóa",
        teacherId: teacher.id,
      },
    }),
    prisma.class.upsert({
      where: { name: "Lớp 10A4" },
      update: {},
      create: {
        name: "Lớp 10A4",
        description: "Lớp chuyên Văn",
        teacherId: teacher.id,
      },
    }),
    prisma.class.upsert({
      where: { name: "Lớp 10A5" },
      update: {},
      create: {
        name: "Lớp 10A5",
        description: "Lớp chuyên Anh",
        teacherId: teacher.id,
      },
    }),
  ]);

  // Tạo 50 sinh viên, chia đều cho 5 lớp
  const students = [
    // Lớp 10A1 (10 sinh viên)
    {
      mssv: "20240001",
      name: "Nguyễn Văn A",
      dob: new Date("2006-01-01"),
      email: "student1@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240002",
      name: "Trần Thị B",
      dob: new Date("2006-02-01"),
      email: "student2@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240003",
      name: "Lê Văn C",
      dob: new Date("2006-03-01"),
      email: "student3@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240004",
      name: "Phạm Thị D",
      dob: new Date("2006-04-01"),
      email: "student4@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240005",
      name: "Hoàng Văn E",
      dob: new Date("2006-05-01"),
      email: "student5@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240006",
      name: "Vũ Thị F",
      dob: new Date("2006-06-01"),
      email: "student6@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240007",
      name: "Đặng Văn G",
      dob: new Date("2006-07-01"),
      email: "student7@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240008",
      name: "Bùi Thị H",
      dob: new Date("2006-08-01"),
      email: "student8@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240009",
      name: "Đỗ Văn I",
      dob: new Date("2006-09-01"),
      email: "student9@example.com",
      classId: classes[0].id,
      status: "active",
    },
    {
      mssv: "20240010",
      name: "Ngô Thị K",
      dob: new Date("2006-10-01"),
      email: "student10@example.com",
      classId: classes[0].id,
      status: "active",
    },
    // Lớp 10A2 (10 sinh viên)
    {
      mssv: "20240011",
      name: "Nguyễn Văn L",
      dob: new Date("2006-11-01"),
      email: "student11@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240012",
      name: "Trần Thị M",
      dob: new Date("2006-12-01"),
      email: "student12@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240013",
      name: "Lê Văn N",
      dob: new Date("2006-01-15"),
      email: "student13@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240014",
      name: "Phạm Thị O",
      dob: new Date("2006-02-15"),
      email: "student14@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240015",
      name: "Hoàng Văn P",
      dob: new Date("2006-03-15"),
      email: "student15@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240016",
      name: "Vũ Thị Q",
      dob: new Date("2006-04-15"),
      email: "student16@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240017",
      name: "Đặng Văn R",
      dob: new Date("2006-05-15"),
      email: "student17@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240018",
      name: "Bùi Thị S",
      dob: new Date("2006-06-15"),
      email: "student18@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240019",
      name: "Đỗ Văn T",
      dob: new Date("2006-07-15"),
      email: "student19@example.com",
      classId: classes[1].id,
      status: "active",
    },
    {
      mssv: "20240020",
      name: "Ngô Thị U",
      dob: new Date("2006-08-15"),
      email: "student20@example.com",
      classId: classes[1].id,
      status: "active",
    },
    // Lớp 10A3 (10 sinh viên)
    {
      mssv: "20240021",
      name: "Nguyễn Văn V",
      dob: new Date("2006-09-15"),
      email: "student21@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240022",
      name: "Trần Thị X",
      dob: new Date("2006-10-15"),
      email: "student22@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240023",
      name: "Lê Văn Y",
      dob: new Date("2006-11-15"),
      email: "student23@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240024",
      name: "Phạm Thị Z",
      dob: new Date("2006-12-15"),
      email: "student24@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240025",
      name: "Hoàng Văn AA",
      dob: new Date("2006-01-20"),
      email: "student25@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240026",
      name: "Vũ Thị BB",
      dob: new Date("2006-02-20"),
      email: "student26@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240027",
      name: "Đặng Văn CC",
      dob: new Date("2006-03-20"),
      email: "student27@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240028",
      name: "Bùi Thị DD",
      dob: new Date("2006-04-20"),
      email: "student28@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240029",
      name: "Đỗ Văn EE",
      dob: new Date("2006-05-20"),
      email: "student29@example.com",
      classId: classes[2].id,
      status: "active",
    },
    {
      mssv: "20240030",
      name: "Ngô Thị FF",
      dob: new Date("2006-06-20"),
      email: "student30@example.com",
      classId: classes[2].id,
      status: "active",
    },
    // Lớp 10A4 (10 sinh viên)
    {
      mssv: "20240031",
      name: "Nguyễn Văn GG",
      dob: new Date("2006-07-20"),
      email: "student31@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240032",
      name: "Trần Thị HH",
      dob: new Date("2006-08-20"),
      email: "student32@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240033",
      name: "Lê Văn II",
      dob: new Date("2006-09-20"),
      email: "student33@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240034",
      name: "Phạm Thị JJ",
      dob: new Date("2006-10-20"),
      email: "student34@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240035",
      name: "Hoàng Văn KK",
      dob: new Date("2006-11-20"),
      email: "student35@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240036",
      name: "Vũ Thị LL",
      dob: new Date("2006-12-20"),
      email: "student36@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240037",
      name: "Đặng Văn MM",
      dob: new Date("2006-01-25"),
      email: "student37@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240038",
      name: "Bùi Thị NN",
      dob: new Date("2006-02-25"),
      email: "student38@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240039",
      name: "Đỗ Văn OO",
      dob: new Date("2006-03-25"),
      email: "student39@example.com",
      classId: classes[3].id,
      status: "active",
    },
    {
      mssv: "20240040",
      name: "Ngô Thị PP",
      dob: new Date("2006-04-25"),
      email: "student40@example.com",
      classId: classes[3].id,
      status: "active",
    },
    // Lớp 10A5 (10 sinh viên)
    {
      mssv: "20240041",
      name: "Nguyễn Văn QQ",
      dob: new Date("2006-05-25"),
      email: "student41@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240042",
      name: "Trần Thị RR",
      dob: new Date("2006-06-25"),
      email: "student42@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240043",
      name: "Lê Văn SS",
      dob: new Date("2006-07-25"),
      email: "student43@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240044",
      name: "Phạm Thị TT",
      dob: new Date("2006-08-25"),
      email: "student44@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240045",
      name: "Hoàng Văn UU",
      dob: new Date("2006-09-25"),
      email: "student45@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240046",
      name: "Vũ Thị VV",
      dob: new Date("2006-10-25"),
      email: "student46@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240047",
      name: "Đặng Văn WW",
      dob: new Date("2006-11-25"),
      email: "student47@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240048",
      name: "Bùi Thị XX",
      dob: new Date("2006-12-25"),
      email: "student48@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240049",
      name: "Đỗ Văn YY",
      dob: new Date("2006-01-30"),
      email: "student49@example.com",
      classId: classes[4].id,
      status: "active",
    },
    {
      mssv: "20240050",
      name: "Ngô Thị ZZ",
      dob: new Date("2006-02-28"),
      email: "student50@example.com",
      classId: classes[4].id,
      status: "active",
    },
  ];

  // Tạo sinh viên
  for (const student of students) {
    await prisma.student.upsert({
      where: { mssv: student.mssv },
      update: {},
      create: student,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
