import Student from '../models/student.model';

export const seedStudents = async () => {
  const students = [
    {
      mssv: '20210001',
      name: 'Nguyễn Văn X',
      dob: new Date('2003-01-15'),
      email: 'student1@example.com',
      class: 'K66-A',
      phone: '0987654321',
      address: 'Hanoi, Vietnam',
      status: 'active',
    },
    {
      mssv: '20210002',
      name: 'Trần Thị Y',
      dob: new Date('2003-03-20'),
      email: 'student2@example.com',
      class: 'K66-A',
      phone: '0987654322',
      address: 'Ho Chi Minh City, Vietnam',
      status: 'active',
    },
    {
      mssv: '20210003',
      name: 'Lê Văn Z',
      dob: new Date('2003-05-10'),
      email: 'student3@example.com',
      class: 'K66-B',
      phone: '0987654323',
      address: 'Da Nang, Vietnam',
      status: 'active',
    },
    {
      mssv: '20210004',
      name: 'Phạm Thị W',
      dob: new Date('2003-07-25'),
      email: 'student4@example.com',
      class: 'K66-B',
      phone: '0987654324',
      address: 'Can Tho, Vietnam',
      status: 'active',
    },
  ];

  const createdStudents = await Student.create(students);
  return createdStudents;
}; 