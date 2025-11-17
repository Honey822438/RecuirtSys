import React from 'react';
import type { DocumentStatus, MedicalStatus, WorkflowStatus } from '../types';

interface StatusBadgeProps {
  status: DocumentStatus | MedicalStatus | WorkflowStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    // Medical Status
    'Fit': 'bg-green-100 text-green-800',
    'Unfit': 'bg-red-100 text-red-800',
    'Slip Sent': 'bg-yellow-100 text-yellow-800',
    'No Slip': 'bg-gray-100 text-gray-800',
    // Document Status
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Received': 'bg-blue-100 text-blue-800',
    'Sent': 'bg-indigo-100 text-indigo-800',
    'Attested': 'bg-purple-100 text-purple-800',
    'On Hand': 'bg-teal-100 text-teal-800',
    // Workflow Status
    'Entry': 'bg-slate-100 text-slate-800',
    'Awaiting Dataflow': 'bg-sky-100 text-sky-800',
    'Dataflow Applied': 'bg-sky-200 text-sky-900',
    'Dataflow Completed': 'bg-green-100 text-green-800',
    'Awaiting Mumaris': 'bg-indigo-100 text-indigo-800',
    'Mumaris Applied': 'bg-indigo-200 text-indigo-900',
    'Awaiting QVP': 'bg-amber-100 text-amber-800',
    'QVP Applied': 'bg-amber-200 text-amber-900',
    'Awaiting Embassy': 'bg-purple-100 text-purple-800',
    'Visa Issued': 'bg-pink-100 text-pink-800',
    'Awaiting Bureau': 'bg-orange-100 text-orange-800',
    'NOC Received': 'bg-teal-100 text-teal-800',
    'Awaiting Protector': 'bg-cyan-100 text-cyan-800',
    'Protector Done': 'bg-green-200 text-green-900 font-bold',
  };

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;