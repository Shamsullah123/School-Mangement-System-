
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, Banknote, MessageSquare, LogOut, Menu, X, School, Calendar, BookOpen } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (!user || user.role === UserRole.GUEST) {
    // Render simple layout for public pages
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-2">
                 <School className="text-indigo-600 h-8 w-8" />
                 <span className="text-xl font-bold text-slate-900">EduSphere</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/" className={({isActive}) => isActive ? "text-indigo-600 font-medium" : "text-slate-500 hover:text-indigo-600"}>Home</NavLink>
                <NavLink to="/about" className={({isActive}) => isActive ? "text-indigo-600 font-medium" : "text-slate-500 hover:text-indigo-600"}>About</NavLink>
                <NavLink to="/contact" className={({isActive}) => isActive ? "text-indigo-600 font-medium" : "text-slate-500 hover:text-indigo-600"}>Contact</NavLink>
                <NavLink to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Login</NavLink>
              </div>
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg border-t">
              <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50">Home</NavLink>
              <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50">About</NavLink>
              <NavLink to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50">Contact</NavLink>
              <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-600 mt-4">Login</NavLink>
            </div>
          )}
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-400 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 EduSphere Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Sidebar Menu Configuration
  const menuItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { to: "/students", icon: Users, label: "Student Report", roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { to: "/admission", icon: UserPlus, label: "Admission", roles: [UserRole.ADMIN] },
    { to: "/assignments", icon: BookOpen, label: "Assignments", roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
    { to: "/schedule", icon: Calendar, label: "Schedule & Exams", roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { to: "/teachers", icon: Users, label: "Teachers", roles: [UserRole.ADMIN] },
    { to: "/fees", icon: Banknote, label: "Fees & Payment", roles: [UserRole.ADMIN, UserRole.PARENT] },
    { to: "/sms", icon: MessageSquare, label: "Communication", roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  // Dashboard Layout for Logged in Users
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6 flex items-center gap-2 border-b border-slate-100">
           <School className="text-indigo-600 h-8 w-8" />
           <span className="text-xl font-bold text-slate-800">EduSphere</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {filteredMenuItems.map((item) => (
            <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="bg-white h-16 shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:hidden sticky top-0 z-30">
          <span className="font-bold text-lg text-slate-800">EduSphere</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-slate-600" /> : <Menu className="text-slate-600" />}
          </button>
        </header>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-800 bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-2xl p-4" onClick={e => e.stopPropagation()}>
               <div className="py-4 space-y-1">
                  {filteredMenuItems.map((item) => (
                    <SidebarItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
                  ))}
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
               </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};