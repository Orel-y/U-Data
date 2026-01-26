import React from 'react';
import { Room, Role } from '../types';
import { DataTable } from './DataTable';
import { IconButton } from './IconButton';
import { PencilIcon, TrashIcon } from './Icons';

export const RoomTable = ({ rooms, onEdit, onDelete, userRole }: { rooms: Room[], onEdit: (r: Room) => void, onDelete: (r: Room) => void, userRole: Role }) => {
  const isAdmin = userRole === Role.ADMIN;
  const canEdit = isAdmin || userRole === Role.DATA_MANAGER;
  const columns = [
    { header: 'Room Name', key: 'name', render: (r: Room) => <span className="font-bold text-gray-900">{r.prefix}{r.room_no}</span> },
    { header: 'Capacity', key: 'capacity', render: (r: Room) => <span className="font-medium text-gray-500">{r.capacity} Seats</span> },
    { header: 'Type', key: 'type', render: (r: Room) => <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{r.type}</span> },
    { 
      header: 'Actions', 
      key: 'actions', 
      render: (r: Room) => (isAdmin || canEdit) && (
        <div className="flex items-center gap-1">
          {canEdit && <IconButton icon={PencilIcon} onClick={() => onEdit(r)} label={`Edit room ${r.prefix}${r.room_no}`} />}
          {isAdmin && <IconButton icon={TrashIcon} onClick={() => onDelete(r)} label={`Delete room ${r.prefix}${r.room_no}`} variant="danger" />}
        </div>
      )
    }
  ];
  return <DataTable data={rooms} columns={columns} />;
};
