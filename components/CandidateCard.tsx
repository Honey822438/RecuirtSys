import React from 'react';
import type { Candidate } from '../types';
import StatusBadge from './StatusBadge';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-primary-100 ring-2 ring-primary-500 shadow-lg'
          : 'bg-gray-50 hover:bg-primary-50 hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-4">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={candidate.avatarUrl}
          alt={candidate.name}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary-800 truncate">{candidate.name}</p>
          <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
          <div className="mt-2">
             <StatusBadge status={candidate.workflowStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
