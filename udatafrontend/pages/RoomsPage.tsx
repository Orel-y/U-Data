
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/api';
//import { mockApi } from '../mockApi';
import { Room, Building, Role, RoomType, RoomStatus } from '../types';
import { RoomTable } from '../components/RoomTable';
import { ConfirmationModal, Modal } from '../components/ConfirmationModal';

export const RoomsPage = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [building, setBuilding] = useState<Building | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [editTarget, setEditTarget] = useState<Room | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    room_no: '',
    capacity: 30,
    floor: 1,
    type: RoomType.OFFICE,
    status: RoomStatus.AVAILABLE
  });

  const fetchRooms = () => {
    if (buildingId) {
      apiService.rooms.listByBuilding(buildingId).then(d => setRooms(d));
      apiService.buildings.listByCampus(buildingId).then(list => {
        const found = list.find(b => b.id === buildingId);
        if (found) setBuilding(found);
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [buildingId]);

  useEffect(() => {
    if (editTarget) {
      setFormData({
        room_no: editTarget.room_no,
        capacity: editTarget.capacity,
        floor: editTarget.floor,
        type: editTarget.type,
        status: editTarget.status
      });
    } else {
      setFormData({ room_no: '', capacity: 30, floor: 1, type: RoomType.OFFICE, status: RoomStatus.AVAILABLE });
    }
  }, [editTarget]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildingId) return;
    try {
      await apiService.rooms.create({
        ...formData,
        prefix: 'R',
        building_id: buildingId
      });
      setIsAddModalOpen(false);
      fetchRooms();
    } catch (err) {
      alert("Error creating room");
    }
  };

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      await apiService.rooms.update(editTarget.id, formData);
      setEditTarget(null);
      fetchRooms();
    } catch (err) {
      alert("Error updating room");
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteTarget) return;
    try {
      await apiService.rooms.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchRooms();
    } catch (err) {
      alert("Error deleting room");
    }
  };

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-10 pb-12 max-w-7xl mx-auto">
      <nav className="mb-4 md:mb-10 flex items-center gap-2 text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
        <Link to="/campuses" className="text-gray-400 hover:text-[#0A7FC7]">Campuses</Link>
        <svg className="w-2.5 h-2.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-[#0A7FC7] truncate max-w-[100px] sm:max-w-none">Building {building?.prefix}{building?.building_no}</span>
      </nav>
      
      <div className="flex flex-row justify-between items-center gap-4 mb-8 md:mb-14">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1 truncate">Rooms</h1>
          <h2 className="text-[#0A7FC7] font-black text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.2em] truncate">Building {building?.prefix}{building?.building_no}</h2>
        </div>
        {(user?.role === Role.ADMIN || user?.role === Role.DATA_MANAGER) && (
          <button 
            onClick={() => { setEditTarget(null); setIsAddModalOpen(true); }}
            className="bg-[#0A7FC7] hover:bg-[#096aa9] text-white px-3 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 rounded-xl md:rounded-[22px] font-black text-[10px] sm:text-xs md:text-sm shadow-xl shadow-[#0A7FC7]/20 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Room</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      <RoomTable 
        rooms={rooms} 
        userRole={user?.role || Role.VIEWER} 
        onEdit={r => setEditTarget(r)} 
        onDelete={r => setDeleteTarget(r)} 
      />

      <ConfirmationModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDeleteRoom}
        title="Remove Room Record" 
        message={`Are you sure you want to delete room ${deleteTarget?.prefix}${deleteTarget?.room_no}?`}
      />

      <Modal isOpen={isAddModalOpen || !!editTarget} onClose={() => { setIsAddModalOpen(false); setEditTarget(null); }} title={editTarget ? "Edit Room" : "Add New Room"}>
        <form onSubmit={editTarget ? handleEditRoom : handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Prefix</label>
              <input disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 font-bold" value="R" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Number</label>
              <input 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
                placeholder="e.g. 101"
                value={formData.room_no}
                onChange={e => setFormData({...formData, room_no: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity</label>
              <input 
                required
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Floor</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
                value={formData.floor}
                onChange={e => setFormData({...formData, floor: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as RoomType})}
            >
              {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7FC7] outline-none"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as RoomStatus})}
            >
              {Object.values(RoomStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-[#0A7FC7] text-white font-black py-4 rounded-2xl hover:bg-[#096aa9] transition-all">
              {editTarget ? "Update Room" : "Save Room"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
