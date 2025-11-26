
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { Student, User, UserRole } from '../types';
import { MOCK_STUDENTS } from '../services/mockData';
import { generateProgressReport } from '../services/geminiService';
import { Search, Plus, FileText, Sparkles, X, CheckSquare, Pencil } from 'lucide-react';

export const StudentsList: React.FC<{ onSelect: (s: Student) => void, user: User }> = ({ onSelect, user }) => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  
  // Grading State
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<Student | null>(null);
  const [gradesForm, setGradesForm] = useState<{subject: string, score: number}[]>([]);

  const isTeacher = user.role === UserRole.TEACHER || user.role === UserRole.ADMIN;
  
  const filtered = students.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) || 
    s.lastName.toLowerCase().includes(search.toLowerCase())
  );

  // --- Attendance Logic ---
  const handleOpenAttendance = () => {
    const initialData: Record<string, boolean> = {};
    students.forEach(s => initialData[s.id] = true); // Default all to present
    setAttendanceData(initialData);
    setIsAttendanceModalOpen(true);
  };

  const toggleAttendance = (id: string) => {
    setAttendanceData(prev => ({...prev, [id]: !prev[id]}));
  };

  const submitAttendance = () => {
    const absentees = students.filter(s => !attendanceData[s.id]);
    
    // Simulate SMS alert
    if (absentees.length > 0) {
      alert(`Attendance recorded. SMS alerts sent to parents of: ${absentees.map(s => s.firstName).join(', ')}`);
    } else {
      alert("Attendance recorded. All present.");
    }
    setIsAttendanceModalOpen(false);
  };

  // --- Grading Logic ---
  const handleOpenGrading = (student: Student) => {
    setSelectedStudentForGrading(student);
    setGradesForm([...student.performance]); // Deep copy
    setIsGradingModalOpen(true);
  };

  const handleGradeChange = (index: number, val: string) => {
    const newGrades = [...gradesForm];
    newGrades[index].score = Number(val);
    setGradesForm(newGrades);
  };

  const saveGrades = () => {
    if (selectedStudentForGrading) {
      setStudents(students.map(s => 
        s.id === selectedStudentForGrading.id 
          ? { ...s, performance: gradesForm } 
          : s
      ));
      alert(`Report card updated for ${selectedStudentForGrading.firstName}`);
      setIsGradingModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Students Directory</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isTeacher && (
            <Button onClick={handleOpenAttendance} className="bg-indigo-600 hover:bg-indigo-700">
              <CheckSquare size={18} /> Daily Attendance
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Name</th>
              <th className="p-4 font-semibold text-slate-600">Grade</th>
              <th className="p-4 font-semibold text-slate-600">Parent</th>
              <th className="p-4 font-semibold text-slate-600">Attendance</th>
              <th className="p-4 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(student => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{student.firstName} {student.lastName}</td>
                <td className="p-4 text-slate-600">{student.grade}</td>
                <td className="p-4 text-slate-600">{student.parentName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${student.attendance > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {student.attendance}%
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <Button variant="outline" className="text-xs px-3 py-1" onClick={() => onSelect(student)}>
                    View Report
                  </Button>
                  {isTeacher && (
                    <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleOpenGrading(student)}>
                      <Pencil size={14} /> Update Marks
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Modal */}
      <Modal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} title="Daily Class Attendance">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-slate-500">Uncheck students who are absent. SMS alerts will be sent automatically.</p>
          <div className="divide-y divide-slate-100 border rounded-lg">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-slate-500">ID: {s.id}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className={`text-sm font-bold ${attendanceData[s.id] ? 'text-green-600' : 'text-red-500'}`}>
                    {attendanceData[s.id] ? 'Present' : 'Absent'}
                  </span>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    checked={attendanceData[s.id] || false}
                    onChange={() => toggleAttendance(s.id)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
             <Button variant="secondary" onClick={() => setIsAttendanceModalOpen(false)}>Cancel</Button>
             <Button onClick={submitAttendance}>Submit & Notify Parents</Button>
          </div>
        </div>
      </Modal>

      {/* Grading Modal */}
      <Modal isOpen={isGradingModalOpen} onClose={() => setIsGradingModalOpen(false)} title={`Update Marks: ${selectedStudentForGrading?.firstName} ${selectedStudentForGrading?.lastName}`}>
        <div className="space-y-4">
           <p className="text-sm text-slate-500">Update subject scores below. The progress report will regenerate automatically.</p>
           <div className="grid grid-cols-2 gap-4">
              {gradesForm.map((item, idx) => (
                <Input 
                  key={idx}
                  label={item.subject}
                  type="number"
                  max={100}
                  value={item.score}
                  onChange={(e) => handleGradeChange(idx, e.target.value)}
                />
              ))}
           </div>
           <div className="flex justify-end gap-3 pt-4">
             <Button variant="secondary" onClick={() => setIsGradingModalOpen(false)}>Cancel</Button>
             <Button onClick={saveGrades}>Update Report Card</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const AdmissionForm: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">New Student Admission</h2>
      </div>
      <Card>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" placeholder="e.g. John" />
          <Input label="Last Name" placeholder="e.g. Doe" />
          <Input label="Date of Birth" type="date" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <Input label="Grade Applying For" placeholder="e.g. 10th" />
          <Input label="Previous School" placeholder="e.g. West High" />
          
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Parent Information</h3>
          </div>
          
          <Input label="Parent Name" placeholder="Full Name" />
          <Input label="Phone Number" placeholder="+1..." />
          <Input label="Email Address" type="email" />
          <Input label="Address" className="md:col-span-2" />

          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
            <Button variant="secondary" type="button">Cancel</Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const ProgressReport: React.FC<{ student: Student, onBack: () => void, isParentView?: boolean }> = ({ student, onBack, isParentView = false }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    const result = await generateProgressReport(student);
    setReport(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {!isParentView && (
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 mb-4">
          &larr; Back to List
        </button>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{student.firstName} {student.lastName}</h2>
          <p className="text-slate-500">Grade: {student.grade} | ID: {student.id}</p>
        </div>
        <Badge status={student.feesPaid ? 'Paid' : 'Overdue'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Academic Performance">
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={student.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card title="AI Insights" className="border-indigo-100 bg-indigo-50/50">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-indigo-900 mb-2">Automated Analysis</h4>
              {!report ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-600 mb-4">Generate a comprehensive summary based on recent grades and attendance.</p>
                  <Button onClick={handleGenerateReport} disabled={loading}>
                    {loading ? "Generating..." : "Generate AI Report"}
                  </Button>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{report}</p>
                  <Button variant="outline" onClick={() => setReport(null)} className="text-xs">Regenerate</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};