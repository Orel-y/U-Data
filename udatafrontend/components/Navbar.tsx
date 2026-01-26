
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLinkActive = (path: string) => {
    if (path === '/campuses') {
      return location.pathname.startsWith('/campuses') || 
             location.pathname.startsWith('/buildings') || 
             location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Campuses', path: '/campuses', show: true },
    { label: 'User Registry', path: '/users', show: user?.role === Role.ADMIN },
  ];

  return (
    <header className="fixed top-0 w-full h-20 bg-[#0A7FC7] border-b border-[#0A7FC7] z-50 shadow-xl">
      <nav className="h-full flex items-center justify-between px-4 sm:px-8 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-4 sm:gap-10">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          <Link 
            to="/campuses" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="UData Home"
          >
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#0A7FC7] font-black text-xl shadow-lg">UD</div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:inline">UData</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => link.show && (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isLinkActive(link.path)
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 p-1.5 sm:p-2 rounded-2xl transition-all border border-white/10"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">{user?.full_name}</div>
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                {user?.role === Role.DATA_MANAGER ? 'Manager' : user?.role}
              </div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white text-[#0A7FC7] flex items-center justify-center font-black text-lg shadow-inner">
              {user?.full_name?.charAt(0)}
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[2rem] shadow-2xl py-3 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="px-6 py-2 border-b border-gray-50 mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={logout} 
                className="w-full text-left px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A7FC7] border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map(link => link.show && (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                  isLinkActive(link.path)
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
