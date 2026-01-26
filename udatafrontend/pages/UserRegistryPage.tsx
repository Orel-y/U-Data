
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../mockApi';
import { User, Role, UserStatus } from '../types';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal, ConfirmationModal } from '../components/ConfirmationModal';
import { Navigate } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { PencilIcon, TrashIcon } from '../components/Icons';

export const UserRegistryPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: Role.VIEWER,
    status: UserStatus.ACTIVE
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.users.list();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === Role.ADMIN) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (editTarget) {
      setFormData({
        full_name: editTarget.full_name,
        username: editTarget.username,
        email: editTarget.email,
        password: '', // Password not normally pre-filled for security
        role: editTarget.role,
        status: editTarget.status
      });
    } else {
      setFormData({
        full_name: '',
        username: '',
        email: '',
        password: '',
        role: Role.VIEWER,
        status: UserStatus.ACTIVE
      });
    }
  }, [editTarget]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await mockApi.users.create(formData);
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Error creating user: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      // Don't send empty password
      const updateData = { ...formData };
      if (!updateData.password) delete (updateData as any).password;
      
      await mockApi.users.update(editTarget.id, updateData);
      setEditTarget(null);
      fetchUsers();
    } catch (err) {
      alert("Error updating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await mockApi.users.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  if (currentUser?.role !== Role.ADMIN) {
    return <Navigate to="/campuses" />;
  }

  const columns = [
    { 
      header: 'User', 
      key: 'full_name', 
      render: (u: User) => (
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 text-[8px] sm:text-xs shrink-0">
            {u.full_name.charAt(0)}
          </div>
          <span className="font-bold text-gray-900 leading-tight">{u.full_name}</span>
        </div>
      )
    },
    { header: 'ID', key: 'username', render: (u: User) => <span className="font-mono text-[8px] sm:text-xs text-gray-500">@{u.username}</span> },
    { header: 'Mail', key: 'email', render: (u: User) => <span className="text-gray-500 break-all">{u.email}</span> },
    { 
      header: 'Role', 
      key: 'role', 
      render: (u: User) => (
        <span className={`px-1.5 py-0.5 rounded-md text-[7px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap border ${
          u.role === Role.ADMIN ? 'bg-purple-50 text-purple-600 border-purple-100' :
          u.role === Role.DATA_MANAGER ? 'bg-blue-50 text-blue-600 border-blue-100' :
          'bg-gray-50 text-gray-500 border-gray-100'
        }`}>
          {u.role === Role.DATA_MANAGER ? 'Manager' : u.role}
        </span>
      )
    },
    { header: 'Status', key: 'status', render: (u: User) => <StatusBadge status={u.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      render: (u: User) => (
        <div className="flex items-center gap-1">
          <IconButton icon={PencilIcon} onClick={() => setEditTarget(u)} label={`Edit user ${u.username}`} />
          <IconButton icon={TrashIcon} onClick={() => setDeleteTarget(u)} label={`Delete user ${u.username}`} variant="danger" />
        </div>
      )
    }
  ];

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-10 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-row justify-between items-center gap-4 mb-8 md:mb-14">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1 truncate">User Registry</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] sm:text-[10px] md:text-[11px]">System access controls.</p>
        </div>
        <button 
          onClick={() => { setEditTarget(null); setIsAddModalOpen(true); }}
          className="bg-[#0A7FC7] hover:bg-[#096aa9] text-white px-3 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 rounded-xl md:rounded-[22px] font-black text-[10px] sm:text-xs md:text-sm shadow-xl shadow-[#0A7FC7]/20 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <DataTable data={users} columns={columns} isLoading={loading} />

      <ConfirmationModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDeleteUser}
        title="Confirm User Deletion" 
        message={`Are you sure you want to delete user ${deleteTarget?.full_name}? Access will be immediately revoked.`}
      />

      <Modal 
        isOpen={isAddModalOpen || !!editTarget} 
        /* Fix: Avoid using || with void expressions in arrow functions */
        onClose={() => {
          if (!isSubmitting) {
            setIsAddModalOpen(false);
            setEditTarget(null);
          }
        }} 
        title={editTarget ? "Edit User Account" : "Create New User Account"}
      >
        <form onSubmit={editTarget ? handleEditUser : handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none transition-all"
              placeholder="e.g. John Doe"
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
              <input 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none transition-all"
                placeholder="jdoe"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password {editTarget && "(Optional)"}</label>
              <input 
                required={!editTarget}
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none transition-all font-mono"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              required
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none transition-all"
              placeholder="john@udata.edu"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as Role})}
              >
                <option value={Role.VIEWER}>Viewer</option>
                <option value={Role.DATA_MANAGER}>Data Manager</option>
                <option value={Role.ADMIN}>Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as UserStatus})}
              >
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.DISABLED}>Disabled</option>
                <option value={UserStatus.SUSPENDED}>Suspended</option>
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#0A7FC7] text-white font-black py-4 rounded-2xl hover:bg-[#096aa9] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : (editTarget ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
