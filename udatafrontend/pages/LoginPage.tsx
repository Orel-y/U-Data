
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [roleSelection, setRoleSelection] = useState<Role>(Role.ADMIN);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfigs = [
    { role: Role.ADMIN, label: 'Admin' },
    { role: Role.DATA_MANAGER, label: 'Manager' },
    { role: Role.VIEWER, label: 'Viewer' },
  ];

  const getUsernameForRole = (r: Role) => r.toLowerCase().replace('_', '');

  // Update username default when role changes, but keep it editable
  const handleRoleChange = (role: Role) => {
    setRoleSelection(role);
    setUsername(getUsernameForRole(role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials for selected role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 p-8 sm:p-14">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex w-14 h-14 sm:w-20 sm:h-20 bg-[#0A7FC7] text-white rounded-2xl sm:rounded-3xl mb-4 sm:mb-8 items-center justify-center text-2xl sm:text-4xl font-black shadow-2xl shadow-[#0A7FC7]/30">UD</div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-1 sm:mb-2">Sign in to UData</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">University Data Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest block px-2">Access Role</label>
              <div className="flex bg-gray-50 p-1 sm:p-1.5 rounded-[18px] sm:rounded-[24px] border border-gray-100">
                {roleConfigs.map((cfg) => (
                  <button
                    key={cfg.role}
                    type="button"
                    onClick={() => handleRoleChange(cfg.role)}
                    className={`flex-1 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-black rounded-[14px] sm:rounded-[18px] transition-all transform active:scale-95 ${
                      roleSelection === cfg.role 
                        ? 'bg-[#0A7FC7] text-white shadow-lg sm:shadow-xl shadow-[#0A7FC7]/20 scale-105 z-10' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest block px-2">Username</label>
                <input 
                  type="text" 
                  name="username"
                  autoComplete="username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3.5 sm:px-6 sm:py-4.5 bg-gray-50 border border-gray-200 rounded-[18px] sm:rounded-[22px] focus:ring-4 focus:ring-[#0A7FC7]/10 focus:border-[#0A7FC7] outline-none transition-all font-bold text-gray-900 text-sm sm:text-base"
                  placeholder="Username"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest block px-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    autoComplete="current-password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4.5 bg-gray-50 border border-gray-200 rounded-[18px] sm:rounded-[22px] focus:ring-4 focus:ring-[#0A7FC7]/10 focus:border-[#0A7FC7] outline-none transition-all font-bold pr-14 sm:pr-16 text-gray-900 text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A7FC7] transition-colors p-2 rounded-xl text-[10px] sm:text-xs font-bold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="p-3 sm:p-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black text-center border border-red-100">{error}</div>}

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-[#0A7FC7] hover:bg-[#096aa9] text-white font-black py-4 sm:py-5 rounded-[20px] sm:rounded-[24px] transition-all shadow-xl sm:shadow-2xl shadow-[#0A7FC7]/30 active:scale-95 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Authenticating...' : 'Sign In to UData'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
