export type StudentStatus = "active" | "inactive" | "graduated";

export interface StudentType {
  mssv: string;
  name: string;
  dob: Date;
  email: string;
  class: string;
  status: StudentStatus;
}
