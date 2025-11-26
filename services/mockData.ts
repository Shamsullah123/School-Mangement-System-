
import { Student, Teacher, FeeRecord, UserRole, RoutineItem, ExamSession, Assignment } from '../types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'S001',
    firstName: 'Alice',
    lastName: 'Johnson',
    grade: '10th',
    enrollmentDate: '2023-09-01',
    parentName: 'Robert Johnson',
    parentPhone: '+1 555-0101',
    feesPaid: true,
    attendance: 95,
    performance: [
      { subject: 'Math', score: 88 },
      { subject: 'Science', score: 92 },
      { subject: 'History', score: 85 },
      { subject: 'English', score: 90 },
    ]
  },
  {
    id: 'S002',
    firstName: 'Michael',
    lastName: 'Smith',
    grade: '10th',
    enrollmentDate: '2023-09-01',
    parentName: 'Sarah Smith',
    parentPhone: '+1 555-0102',
    feesPaid: false,
    attendance: 82,
    performance: [
      { subject: 'Math', score: 72 },
      { subject: 'Science', score: 78 },
      { subject: 'History', score: 80 },
      { subject: 'English', score: 75 },
    ]
  },
  {
    id: 'S003',
    firstName: 'Emma',
    lastName: 'Davis',
    grade: '11th',
    enrollmentDate: '2022-09-01',
    parentName: 'James Davis',
    parentPhone: '+1 555-0103',
    feesPaid: true,
    attendance: 98,
    performance: [
      { subject: 'Math', score: 95 },
      { subject: 'Science', score: 98 },
      { subject: 'History', score: 92 },
      { subject: 'English', score: 96 },
    ]
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'T001', name: 'Mr. Anderson', subject: 'Mathematics', email: 'anderson@edusphere.com', phone: '555-1111' },
  { id: 'T002', name: 'Ms. Roberts', subject: 'Science', email: 'roberts@edusphere.com', phone: '555-2222' },
  { id: 'T003', name: 'Mrs. Clark', subject: 'English', email: 'clark@edusphere.com', phone: '555-3333' },
];

export const MOCK_FEES: FeeRecord[] = [
  { id: 'F001', studentId: 'S001', studentName: 'Alice Johnson', amount: 500, dueDate: '2024-05-01', status: 'Paid' },
  { id: 'F002', studentId: 'S002', studentName: 'Michael Smith', amount: 500, dueDate: '2024-05-01', status: 'Overdue' },
  { id: 'F003', studentId: 'S003', studentName: 'Emma Davis', amount: 550, dueDate: '2024-05-01', status: 'Paid' },
  { id: 'F004', studentId: 'S001', studentName: 'Alice Johnson', amount: 500, dueDate: '2024-06-01', status: 'Pending' },
];

export const MOCK_ROUTINE: RoutineItem[] = [
  { id: 'R001', grade: '10th', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', teacher: 'Mr. Anderson', room: '101' },
  { id: 'R002', grade: '10th', day: 'Monday', startTime: '10:15', endTime: '11:15', subject: 'Science', teacher: 'Ms. Roberts', room: 'Lab A' },
  { id: 'R003', grade: '10th', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'English', teacher: 'Mrs. Clark', room: '102' },
  { id: 'R004', grade: '11th', day: 'Monday', startTime: '09:00', endTime: '10:30', subject: 'Physics', teacher: 'Ms. Roberts', room: 'Lab B' },
  { id: 'R005', grade: '10th', day: 'Wednesday', startTime: '11:30', endTime: '12:30', subject: 'History', teacher: 'Mr. Wright', room: '103' },
];

export const MOCK_EXAMS: ExamSession[] = [
  { id: 'E001', title: 'Mid-Term Mathematics', grade: '10th', subject: 'Mathematics', date: '2024-06-10', startTime: '09:00', duration: '2 Hours', room: 'Hall A' },
  { id: 'E002', title: 'Mid-Term Science', grade: '10th', subject: 'Science', date: '2024-06-12', startTime: '09:00', duration: '1.5 Hours', room: 'Hall A' },
  { id: 'E003', title: 'Final Physics', grade: '11th', subject: 'Physics', date: '2024-06-15', startTime: '10:00', duration: '3 Hours', room: 'Lab B' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'A001', title: 'Quadratic Equations Practice', subject: 'Mathematics', grade: '10th', description: 'Complete exercises 4.1 to 4.3 from the textbook.', dueDate: '2024-05-25', postedBy: 'Mr. Anderson', status: 'Active' },
  { id: 'A002', title: 'Lab Report: Photosynthesis', subject: 'Science', grade: '10th', description: 'Submit the lab report based on yesterdays experiment.', dueDate: '2024-05-28', postedBy: 'Ms. Roberts', status: 'Active' },
  { id: 'A003', title: 'Essay: Shakespeare Sonnets', subject: 'English', grade: '11th', description: 'Write a 500-word analysis of Sonnet 18.', dueDate: '2024-06-01', postedBy: 'Mrs. Clark', status: 'Active' },
];