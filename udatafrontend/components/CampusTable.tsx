import React from 'react';
import { Link } from 'react-router-dom';
import { Campus, Role } from '../types';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';
import { IconButton } from './IconButton';
import { PencilIcon, TrashIcon } from './Icons';

export const CampusTable = ({ campuses, onEdit, onDelete, userRole }: { campuses: Campus[], onEdit: (c: Campus) => void, onDelete: (c: Campus) => void, userRole: Role }) => {
  const isAdmin = userRole === Role.ADMIN;
  const columns = [
    { 
      header: 'Campus Name', 
      key: 'name', 
      render: (c: Campus) => (
        <Link 
          to={`/campuses/${c.id}/buildings`} 
          className="font-bold text-[#0A7FC7] hover:underline"
          aria-label={`Open buildings for campus ${c.name}`}
        >
          {c.name}
        </Link>
      ) 
    },
    { header: 'Address', key: 'address', render: (c: Campus) => <span className="text-gray-500 font-medium">{c.address}</span> },
    { header: 'Code', key: 'code', render: (c: Campus) => <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded-lg font-bold text-gray-600">{c.code}</span> },
    { header: 'Status', key: 'status', render: (c: Campus) => <StatusBadge status={c.status} /> },
    { 
      header: 'Actions', 
      key: 'actions', 
      render: (c: Campus) => isAdmin && (
        <div className="flex items-center gap-1">
          <IconButton icon={PencilIcon} onClick={() => onEdit(c)} label={`Edit campus ${c.name}`} />
          <IconButton icon={TrashIcon} onClick={() => onDelete(c)} label={`Delete campus ${c.name}`} variant="danger" />
        </div>
      )
    }
  ];
  return <DataTable data={campuses} columns={columns} />;
};
