
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  enrollmentDate: string;
  parentName: string;
  parentPhone: string;
  feesPaid: boolean;
  attendance: number; // percentage
  performance: { subject: string; score: number }[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface SMSMessage {
  id: string;
  recipient: string;
  content: string;
  date: string;
  status: 'Sent' | 'Failed';
}

export interface RoutineItem {
  id: string;
  grade: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface ExamSession {
  id: string;
  title: string;
  grade: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string; // e.g., "2 hours"
  room: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  dueDate: string;
  postedBy: string; // Teacher Name
  status: 'Active' | 'Closed';
}