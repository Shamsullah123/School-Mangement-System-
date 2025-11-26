
import React, { useState } from 'react';
import { Card, Button, Modal, Input, Badge } from '../components/UI';
import { MOCK_ASSIGNMENTS } from '../services/mockData';
import { Assignment, User, UserRole } from '../types';
import { Plus, BookOpen, Clock, Download, Upload, CheckCircle, Pencil, Trash2 } from 'lucide-react';

interface AssignmentsProps {
  user: User;
}

export const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    subject: '',
    grade: '10th',
    description: '',
    dueDate: '',
  });

  const isTeacher = user.role === UserRole.TEACHER || user.role === UserRole.ADMIN;
  const isStudent = user.role === UserRole.STUDENT;

  const handleOpenModal = (assignment?: Assignment) => {
    if (assignment) {
      setEditingId(assignment.id);
      setFormData(assignment);
    } else {
      setEditingId(null);
      setFormData({ title: '', subject: '', grade: '10th', description: '', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      setAssignments(assignments.map(a => 
        a.id === editingId ? { ...a, ...formData } as Assignment : a
      ));
    } else {
      // Create new
      const newAssignment: Assignment = {
        id: `A${Date.now()}`,
        title: formData.title!,
        subject: formData.subject!,
        grade: formData.grade!,
        description: formData.description!,
        dueDate: formData.dueDate!,
        postedBy: user.name,
        status: 'Active'
      };
      setAssignments([...assignments, newAssignment]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', subject: '', grade: '10th', description: '', dueDate: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handleDownload = (assignment: Assignment) => {
    // Create a dynamic text file with assignment details
    const content = `
ASSIGNMENT DETAILS
------------------
Title: ${assignment.title}
Subject: ${assignment.subject}
Grade: ${assignment.grade}
Due Date: ${assignment.dueDate}
Instructor: ${assignment.postedBy}

DESCRIPTION
-----------
${assignment.description}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assignment.title.replace(/\s+/g, '_')}_Instructions.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (id: string) => {
    alert(`Assignment ${id} submitted successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Class Assignments</h2>
          <p className="text-slate-500">
            {isTeacher ? "Manage and post new homework." : "View and submit your homework."}
          </p>
        </div>
        {isTeacher && (
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} /> Post Assignment
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map(assignment => (
          <Card key={assignment.id} className="flex flex-col h-full hover:shadow-md transition-shadow relative group">
             {/* Edit/Delete Actions for Teacher */}
             {isTeacher && (
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 p-1 rounded-lg backdrop-blur-sm">
                  <button 
                    onClick={() => handleOpenModal(assignment)}
                    className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 shadow-sm transition-colors"
                    title="Edit Assignment"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(assignment.id)}
                    className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-red-600 shadow-sm transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 size={14} />
                  </button>
               </div>
             )}

            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase">
                {assignment.subject}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${assignment.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {assignment.status}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-2">{assignment.title}</h3>
            <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">{assignment.description}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>Due: {assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen size={14} />
                <span>Grade: {assignment.grade}</span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => handleDownload(assignment)}>
                  <Download size={14} /> Instructions
                </Button>
                {isStudent && (
                  <Button className="flex-1 text-xs" onClick={() => handleSubmit(assignment.id)}>
                    <Upload size={14} /> Submit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Assignment" : "Post New Assignment"}
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <Input 
            label="Assignment Title" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            required 
            placeholder="e.g. Chapter 4 Exercises"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Subject" 
              value={formData.subject} 
              onChange={e => setFormData({...formData, subject: e.target.value})}
              required 
              placeholder="e.g. Math"
            />
            <Input 
              label="Grade" 
              value={formData.grade} 
              onChange={e => setFormData({...formData, grade: e.target.value})}
              required 
              placeholder="e.g. 10th"
            />
          </div>
          <Input 
            label="Due Date" 
            type="date" 
            value={formData.dueDate} 
            onChange={e => setFormData({...formData, dueDate: e.target.value})}
            required 
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              placeholder="Enter detailed instructions for the students..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Update Assignment" : "Post Assignment"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
