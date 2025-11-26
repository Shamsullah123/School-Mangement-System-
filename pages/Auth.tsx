import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { School } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let mockUser: User;
      
      switch (role) {
        case UserRole.ADMIN:
          mockUser = { id: 'A001', name: 'Principal Skinner', role: UserRole.ADMIN };
          break;
        case UserRole.TEACHER:
          mockUser = { id: 'T001', name: 'Mrs. Krabappel', role: UserRole.TEACHER };
          break;
        case UserRole.PARENT:
          // Matches parent of Student S001 (Alice Johnson) in mockData
          mockUser = { id: 'P001', name: 'Robert Johnson', role: UserRole.PARENT };
          break;
        default:
          mockUser = { id: 'S001', name: 'Bart Simpson', role: UserRole.STUDENT };
      }

      onLogin(mockUser);
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
           <School className="text-white h-12 w-12 mx-auto mb-4" />
           <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
           <p className="text-indigo-200 mt-2">Sign in to your account</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-2 py-2 text-xs sm:text-sm rounded-lg font-medium border transition-colors ${
                      role === r 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="demo@edusphere.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                defaultValue="password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            For demo purposes, any password works.
          </div>
        </div>
      </div>
    </div>
  );
};