
import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { CampusesPage } from './pages/CampusesPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { RoomsPage } from './pages/RoomsPage';
import { UserRegistryPage } from './pages/UserRegistryPage';

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#F8FAFC]">
    <Navbar />
    <main className="min-h-screen">
      {children}
    </main>
  </div>
);

const App = () => (
  <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><MainLayout><Navigate to="/campuses" /></MainLayout></ProtectedRoute>} />
        <Route path="/campuses" element={<ProtectedRoute><MainLayout><CampusesPage /></MainLayout></ProtectedRoute>} />
        <Route path="/campuses/:campusId/buildings" element={<ProtectedRoute><MainLayout><BuildingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/buildings/:buildingId/rooms" element={<ProtectedRoute><MainLayout><RoomsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><MainLayout><UserRegistryPage /></MainLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  </AuthProvider>
);

export default App;
