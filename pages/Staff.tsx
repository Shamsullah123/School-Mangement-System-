import React, { useState } from 'react';
import { Card, Button, Modal, Input } from '../components/UI';
import { MOCK_TEACHERS } from '../services/mockData';
import { Teacher } from '../types';
import { Mail, Phone, BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    subject: '',
    email: '',
    phone: ''
  });

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData(teacher);
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', subject: '', email: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...t, ...formData } as Teacher : t));
    } else {
      const newTeacher: Teacher = {
        id: `T${Date.now()}`,
        name: formData.name!,
        subject: formData.subject!,
        email: formData.email!,
        phone: formData.phone!
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this teacher?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Faculty Members</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Teacher
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <Card key={teacher.id} className="hover:shadow-md transition-shadow relative group">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(teacher)}
                  className="p-1 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 shadow-sm"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(teacher.id)}
                  className="p-1 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-red-600 shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
             </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                <p className="text-sm text-slate-500">{teacher.subject} Department</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                <span>{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                <a href={`mailto:${teacher.email}`} className="hover:underline">{teacher.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Full Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
            placeholder="e.g. Mr. John Doe"
          />
          <Input 
            label="Subject" 
            value={formData.subject} 
            onChange={e => setFormData({...formData, subject: e.target.value})}
            required
            placeholder="e.g. Physics"
          />
          <Input 
            label="Email Address" 
            type="email"
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            placeholder="john@school.com"
          />
          <Input 
            label="Phone Number" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            required
            placeholder="555-0123"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingTeacher ? "Update Details" : "Add Teacher"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};