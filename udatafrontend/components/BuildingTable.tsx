import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Role } from '../types';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';
import { IconButton } from './IconButton';
import { PencilIcon, TrashIcon } from './Icons';

export const BuildingTable = ({ buildings, onEdit, onDelete, userRole }: { buildings: Building[], onEdit: (b: Building) => void, onDelete: (b: Building) => void, userRole: Role }) => {
  const isAdmin = userRole === Role.ADMIN;
  const canEdit = isAdmin || userRole === Role.DATA_MANAGER;
  const columns = [
    { 
      header: 'Building Name', 
      key: 'name', 
      render: (b: Building) => {
        const name = `${b.prefix}${b.building_no}`;
        return (
          <Link 
            to={`/buildings/${b.id}/rooms`} 
            className="font-bold text-[#0A7FC7] hover:underline"
            aria-label={`Open rooms for building ${name}`}
          >
            {name}
          </Link>
        );
      } 
    },
    { header: 'Type', key: 'type', render: (b: Building) => <span className="text-xs font-bold text-gray-500 uppercase">{b.type}</span> },
    { header: 'Floors', key: 'floors', render: (b: Building) => <span className="font-medium text-gray-600">{b.floors} Floors</span> },
    { header: 'Status', key: 'status', render: (b: Building) => <StatusBadge status={b.status} /> },
    { 
      header: 'Actions', 
      key: 'actions', 
      render: (b: Building) => (isAdmin || canEdit) && (
        <div className="flex items-center gap-1">
          {canEdit && <IconButton icon={PencilIcon} onClick={() => onEdit(b)} label={`Edit building ${b.prefix}${b.building_no}`} />}
          {isAdmin && <IconButton icon={TrashIcon} onClick={() => onDelete(b)} label={`Delete building ${b.prefix}${b.building_no}`} variant="danger" />}
        </div>
      )
    }
  ];
  return <DataTable data={buildings} columns={columns} />;
};
