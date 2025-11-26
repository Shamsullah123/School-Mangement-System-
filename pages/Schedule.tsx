
import React, { useState } from 'react';
import { Card, Button, Modal, Input, Select, Badge } from '../components/UI';
import { RoutineItem, ExamSession, User, UserRole } from '../types';
import { MOCK_ROUTINE, MOCK_EXAMS } from '../services/mockData';
import { Plus, Trash2, Calendar, Clock, MapPin, User as UserIcon, BookOpen } from 'lucide-react';

interface ScheduleProps {
  user: User;
}

export const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'routine' | 'exams'>('routine');
  const [selectedGrade, setSelectedGrade] = useState('10th');

  // State for Routine
  const [routines, setRoutines] = useState<RoutineItem[]>(MOCK_ROUTINE);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineForm, setRoutineForm] = useState<Partial<RoutineItem>>({
    day: 'Monday',
    startTime: '',
    endTime: '',
    subject: '',
    teacher: '',
    room: ''
  });

  // State for Exams
  const [exams, setExams] = useState<ExamSession[]>(MOCK_EXAMS);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState<Partial<ExamSession>>({
    title: '',
    grade: selectedGrade,
    subject: '',
    date: '',
    startTime: '',
    duration: '',
    room: ''
  });

  const isAdmin = user.role === UserRole.ADMIN;

  // --- Routine Logic ---
  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoutine: RoutineItem = {
      id: `R${Date.now()}`,
      grade: selectedGrade,
      day: routineForm.day as any,
      startTime: routineForm.startTime!,
      endTime: routineForm.endTime!,
      subject: routineForm.subject!,
      teacher: routineForm.teacher!,
      room: routineForm.room!
    };
    setRoutines([...routines, newRoutine]);
    setIsRoutineModalOpen(false);
    setRoutineForm({ day: 'Monday', startTime: '', endTime: '', subject: '', teacher: '', room: '' });
  };

  const handleDeleteRoutine = (id: string) => {
    if (window.confirm("Remove this class from the schedule?")) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  // --- Exam Logic ---
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: ExamSession = {
      id: `E${Date.now()}`,
      title: examForm.title!,
      grade: selectedGrade,
      subject: examForm.subject!,
      date: examForm.date!,
      startTime: examForm.startTime!,
      duration: examForm.duration!,
      room: examForm.room!
    };
    setExams([...exams, newExam]);
    setIsExamModalOpen(false);
    setExamForm({ title: '', grade: selectedGrade, subject: '', date: '', startTime: '', duration: '', room: '' });
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm("Remove this exam?")) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  // --- Render Helpers ---
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const filteredRoutine = routines.filter(r => r.grade === selectedGrade);
  const filteredExams = exams.filter(e => e.grade === selectedGrade);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Schedules & Timetables</h2>
          <p className="text-slate-500">Manage class routines and upcoming examinations.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
          <span className="text-sm font-medium text-slate-600 pl-2">Grade:</span>
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-100 border-none rounded-md px-3 py-1 text-sm font-semibold text-slate-800 focus:ring-0 cursor-pointer hover:bg-slate-200 transition"
          >
            <option value="10th">10th Grade</option>
            <option value="11th">11th Grade</option>
            <option value="12th">12th Grade</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('routine')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'routine' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Class Routine
        </button>
        <button 
          onClick={() => setActiveTab('exams')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'exams' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Exam Schedule
        </button>
      </div>

      {/* Class Routine Content */}
      {activeTab === 'routine' && (
        <div className="space-y-4">
          {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={() => setIsRoutineModalOpen(true)}>
                <Plus size={18} /> Add Class Slot
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map(day => {
              const daysClasses = filteredRoutine
                .filter(r => r.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="flex flex-col gap-3">
                  <div className="bg-slate-100 p-3 rounded-lg text-center font-bold text-slate-700">
                    {day}
                  </div>
                  <div className="space-y-3">
                    {daysClasses.length === 0 && (
                      <div className="text-center p-4 border-2 border-dashed border-slate-100 rounded-lg text-slate-400 text-sm">
                        No classes
                      </div>
                    )}
                    {daysClasses.map(item => (
                      <Card key={item.id} className="p-3 relative group hover:shadow-md transition-all border-l-4 border-l-indigo-500">
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteRoutine(item.id)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 mb-1">
                          <Clock size={12} /> {item.startTime} - {item.endTime}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.subject}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <UserIcon size={12} /> {item.teacher}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} /> Room {item.room}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exam Schedule Content */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
           {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={() => setIsExamModalOpen(true)}>
                <Plus size={18} /> Schedule Exam
              </Button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Date & Time</th>
                  <th className="p-4 font-semibold text-slate-600">Exam Title</th>
                  <th className="p-4 font-semibold text-slate-600">Subject</th>
                  <th className="p-4 font-semibold text-slate-600">Room</th>
                  <th className="p-4 font-semibold text-slate-600">Duration</th>
                  {isAdmin && <th className="p-4 font-semibold text-slate-600">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-slate-500">No upcoming exams scheduled for this grade.</td>
                   </tr>
                ) : filteredExams.map(exam => (
                  <tr key={exam.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{exam.date}</div>
                      <div className="text-xs text-slate-500">{exam.startTime}</div>
                    </td>
                    <td className="p-4 font-medium text-indigo-600">{exam.title}</td>
                    <td className="p-4 text-slate-600">{exam.subject}</td>
                    <td className="p-4 text-slate-600">{exam.room}</td>
                    <td className="p-4 text-slate-600">{exam.duration}</td>
                    {isAdmin && (
                      <td className="p-4">
                        <Button variant="danger" className="text-xs px-2 py-1 h-auto" onClick={() => handleDeleteExam(exam.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routine Modal */}
      <Modal isOpen={isRoutineModalOpen} onClose={() => setIsRoutineModalOpen(false)} title="Add Class Slot">
        <form onSubmit={handleSaveRoutine} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Select label="Day" value={routineForm.day} onChange={e => setRoutineForm({...routineForm, day: e.target.value as any})}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
             </Select>
             <Input label="Room No." value={routineForm.room} onChange={e => setRoutineForm({...routineForm, room: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Input label="Start Time" type="time" value={routineForm.startTime} onChange={e => setRoutineForm({...routineForm, startTime: e.target.value})} required />
             <Input label="End Time" type="time" value={routineForm.endTime} onChange={e => setRoutineForm({...routineForm, endTime: e.target.value})} required />
          </div>
          <Input label="Subject" value={routineForm.subject} onChange={e => setRoutineForm({...routineForm, subject: e.target.value})} required placeholder="e.g. Mathematics" />
          <Input label="Teacher Name" value={routineForm.teacher} onChange={e => setRoutineForm({...routineForm, teacher: e.target.value})} required placeholder="e.g. Mr. Anderson" />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsRoutineModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add to Schedule</Button>
          </div>
        </form>
      </Modal>

      {/* Exam Modal */}
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Schedule New Exam">
        <form onSubmit={handleSaveExam} className="space-y-4">
          <Input label="Exam Title" value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} required placeholder="e.g. Mid-Term 2024" />
          <Input label="Subject" value={examForm.subject} onChange={e => setExamForm({...examForm, subject: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={examForm.date} onChange={e => setExamForm({...examForm, date: e.target.value})} required />
            <Input label="Start Time" type="time" value={examForm.startTime} onChange={e => setExamForm({...examForm, startTime: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration" value={examForm.duration} onChange={e => setExamForm({...examForm, duration: e.target.value})} required placeholder="e.g. 2 Hours" />
            <Input label="Room/Hall" value={examForm.room} onChange={e => setExamForm({...examForm, room: e.target.value})} required />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsExamModalOpen(false)}>Cancel</Button>
            <Button type="submit">Schedule Exam</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
