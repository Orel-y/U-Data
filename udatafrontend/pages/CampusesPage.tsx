
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../mockApi';
import { Campus, Role, CampusStatus } from '../types';
import { CampusTable } from '../components/CampusTable';
import { ConfirmationModal, Modal } from '../components/ConfirmationModal';

export const CampusesPage = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Campus | null>(null);
  const [editTarget, setEditTarget] = useState<Campus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    status: CampusStatus.ACTIVE
  });

  const fetchCampuses = () => {
    setLoading(true);
    mockApi.campuses.list().then(d => { setCampuses(d); setLoading(false); });
  };

  useEffect(() => { 
    fetchCampuses();
  }, []);

  useEffect(() => {
    if (editTarget) {
      setFormData({
        code: editTarget.code,
        name: editTarget.name,
        address: editTarget.address,
        status: editTarget.status
      });
    } else {
      setFormData({ code: '', name: '', address: '', status: CampusStatus.ACTIVE });
    }
  }, [editTarget]);

  const handleCreateCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mockApi.campuses.create(formData);
      setIsAddModalOpen(false);
      fetchCampuses();
    } catch (err) {
      alert("Error creating campus");
    }
  };

  const handleEditCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      await mockApi.campuses.update(editTarget.id, formData);
      setEditTarget(null);
      fetchCampuses();
    } catch (err) {
      alert("Error updating campus");
    }
  };

  const handleDeleteCampus = async () => {
    if (!deleteTarget) return;
    try {
      await mockApi.campuses.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchCampuses();
    } catch (err) {
      alert("Error deleting campus");
    }
  };

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-10 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-row justify-between items-center gap-4 mb-8 md:mb-14">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1 md:mb-3 truncate">Campuses</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] sm:text-[10px] md:text-[11px]">Primary asset registry.</p>
        </div>
        {user?.role === Role.ADMIN && (
          <button 
            onClick={() => { setEditTarget(null); setIsAddModalOpen(true); }}
            className="bg-[#0A7FC7] hover:bg-[#096aa9] text-white px-3 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 rounded-xl md:rounded-[22px] font-black text-[10px] sm:text-xs md:text-sm shadow-xl shadow-[#0A7FC7]/20 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Campus</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      <CampusTable 
        campuses={campuses} 
        userRole={user?.role || Role.VIEWER} 
        onEdit={c => setEditTarget(c)} 
        onDelete={c => setDeleteTarget(c)} 
      />

      <ConfirmationModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDeleteCampus}
        title="Confirm Deletion" 
        message={`Are you sure you want to delete ${deleteTarget?.name}? This will archive the campus record and associated data.`}
      />

      <Modal 
        isOpen={isAddModalOpen || !!editTarget} 
        onClose={() => { setIsAddModalOpen(false); setEditTarget(null); }} 
        title={editTarget ? "Edit Campus" : "Add New Campus"}
      >
        <form onSubmit={editTarget ? handleEditCampus : handleCreateCampus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Code</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              placeholder="e.g. MAIN"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              placeholder="e.g. Main Campus"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              placeholder="e.g. 123 University Ave"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as CampusStatus})}
            >
              <option value={CampusStatus.ACTIVE}>Active</option>
              <option value={CampusStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-[#0A7FC7] text-white font-black py-4 rounded-2xl hover:bg-[#096aa9] transition-all">
              {editTarget ? "Update Campus" : "Save Campus"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
