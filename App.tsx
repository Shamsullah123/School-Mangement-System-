
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, About, Contact } from './pages/Public';
import { Login } from './pages/Auth';
import { StudentsList, AdmissionForm, ProgressReport } from './pages/Students';
import { Teachers } from './pages/Staff';
import { Fees, SMS } from './pages/FinanceAndComms';
import { Schedule } from './pages/Schedule';
import { Assignments } from './pages/Assignments';
import { User, UserRole, Student } from './types';
import { MOCK_STUDENTS } from './services/mockData';
import { Card } from './components/UI';
import { Users, Banknote, UserPlus, CheckCircle, Clock } from 'lucide-react';

// Dashboard Home Component
const DashboardHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const isAdmin = user.role === UserRole.ADMIN;
  const isTeacher = user.role === UserRole.TEACHER;
  const isParent = user.role === UserRole.PARENT;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">
        {isParent ? "My Child's Overview" : "Dashboard Overview"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admin/Teacher Widgets */}
        {(isAdmin || isTeacher) && (
          <Card 
            className="flex items-center gap-4 bg-blue-50 border-blue-100 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => navigate('/students')}
          >
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{isTeacher ? "My Class Students" : "Total Students"}</p>
              <p className="text-2xl font-bold text-slate-800">{isTeacher ? "32" : "1,245"}</p>
            </div>
          </Card>
        )}
        
        {/* Admin Widgets */}
        {isAdmin && (
          <>
            <Card 
              className="flex items-center gap-4 bg-green-50 border-green-100 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
              onClick={() => navigate('/fees')}
            >
              <div className="bg-green-500 text-white p-3 rounded-full">
                <Banknote size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Revenue (Monthly)</p>
                <p className="text-2xl font-bold text-slate-800">$45,200</p>
              </div>
            </Card>
            <Card 
              className="flex items-center gap-4 bg-purple-50 border-purple-100 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
              onClick={() => navigate('/students')}
            >
              <div className="bg-purple-500 text-white p-3 rounded-full">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">New Admissions</p>
                <p className="text-2xl font-bold text-slate-800">28</p>
              </div>
            </Card>
          </>
        )}

        {/* Parent Widgets */}
        {isParent && (
          <>
            <Card className="flex items-center gap-4 bg-indigo-50 border-indigo-100">
               <div className="bg-indigo-500 text-white p-3 rounded-full">
                  <CheckCircle size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-800">95%</p>
               </div>
            </Card>
            <Card 
              className="flex items-center gap-4 bg-orange-50 border-orange-100 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/fees')}
            >
               <div className="bg-orange-500 text-white p-3 rounded-full">
                  <Banknote size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Next Fee Due</p>
                  <p className="text-2xl font-bold text-slate-800">$500</p>
               </div>
            </Card>
             <Card 
              className="flex items-center gap-4 bg-teal-50 border-teal-100 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/schedule')}
            >
               <div className="bg-teal-500 text-white p-3 rounded-full">
                  <Clock size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Upcoming Exams</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
               </div>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Quick Actions - Filtered by Role */}
         <Card title="Quick Actions">
           <div className="grid grid-cols-2 gap-4">
              {isAdmin && (
                <>
                  <button 
                    onClick={() => navigate('/admission')}
                    className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                  >
                     <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Add Student</span>
                     <span className="text-xs text-slate-500">Register new enrollment</span>
                  </button>
                  <button 
                    onClick={() => navigate('/fees')}
                    className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                  >
                     <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Collect Fees</span>
                     <span className="text-xs text-slate-500">Record payment</span>
                  </button>
                </>
              )}
              
              {(isAdmin || isTeacher) && (
                <>
                <button 
                  onClick={() => navigate('/sms')}
                  className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                >
                  <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Send SMS</span>
                  <span className="text-xs text-slate-500">Notify parents</span>
                </button>
                <button 
                  onClick={() => navigate('/assignments')}
                  className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                >
                  <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Assignments</span>
                  <span className="text-xs text-slate-500">Post homework</span>
                </button>
                </>
              )}

              {isParent && (
                 <>
                  <button 
                    onClick={() => navigate('/students')}
                    className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                  >
                    <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Academic Report</span>
                    <span className="text-xs text-slate-500">View grades</span>
                  </button>
                   <button 
                    onClick={() => navigate('/fees')}
                    className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
                  >
                    <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">Pay Fees</span>
                    <span className="text-xs text-slate-500">Online payment</span>
                  </button>
                 </>
              )}

              <button 
                onClick={() => navigate('/schedule')}
                className="p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors group"
              >
                 <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">
                    {isParent ? "Class Schedule" : "Check Schedule"}
                 </span>
                 <span className="text-xs text-slate-500">View timetable</span>
              </button>
           </div>
         </Card>
         <Card title="Upcoming Events">
            <ul className="space-y-4">
               <li className="flex gap-4">
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded text-center">
                     <div className="text-xs">MAY</div>
                     <div className="text-lg">20</div>
                  </div>
                  <div>
                     <h4 className="font-medium">Parent Teacher Meeting</h4>
                     <p className="text-sm text-slate-500">9:00 AM - 12:00 PM • Main Hall</p>
                  </div>
               </li>
               <li className="flex gap-4">
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded text-center">
                     <div className="text-xs">JUN</div>
                     <div className="text-lg">05</div>
                  </div>
                  <div>
                     <h4 className="font-medium">Final Exams Begin</h4>
                     <p className="text-sm text-slate-500">All Grades</p>
                  </div>
               </li>
            </ul>
         </Card>
      </div>
    </div>
  );
};

const StudentsContainer = ({ user }: { user: User }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // If Parent, automatically show their child's report
  if (user.role === UserRole.PARENT) {
    // Mock linking: Find student where parentName matches user name
    const child = MOCK_STUDENTS.find(s => s.parentName === user.name) || MOCK_STUDENTS[0];
    return <ProgressReport student={child} onBack={() => {}} isParentView={true} />;
  }

  if (selectedStudent) {
    return <ProgressReport student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }
  return <StudentsList onSelect={setSelectedStudent} user={user} />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <DashboardHome user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/students" 
            element={user ? <StudentsContainer user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admission" 
            element={user ? <AdmissionForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/schedule" 
            element={user ? <Schedule user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/teachers" 
            element={user ? <Teachers /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/fees" 
            element={user ? <Fees user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/sms" 
            element={user ? <SMS /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/assignments" 
            element={user ? <Assignments user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;