
import React, { useState, useMemo, useEffect } from 'react';
import type { Candidate, Employee } from '../types';
import { WorkflowStatus } from '../types';
import PortalLayout from '../components/PortalLayout';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';

interface HiringPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const HiringPortal: React.FC<HiringPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  const myCandidates = useMemo(() => 
    candidates.filter(c => c.hiringOfficerId === currentUser.id), 
    [candidates, currentUser.id]
  );
  
  const filteredMyCandidates = useMemo(() => {
    return myCandidates
      .filter(c => statusFilter === 'all' || c.workflowStatus === statusFilter)
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [myCandidates, searchTerm, statusFilter]);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    // When the filtered list changes, ensure the selection is still valid.
    if (selectedCandidate && !filteredMyCandidates.some(c => c.id === selectedCandidate.id)) {
        // If current selection is no longer valid, pick the first available, or null.
        setSelectedCandidate(filteredMyCandidates[0] || null);
    } else if (!selectedCandidate && filteredMyCandidates.length > 0) {
        // If no candidate is selected and the list is not empty, select the first one.
        setSelectedCandidate(filteredMyCandidates[0]);
    }
  }, [filteredMyCandidates, selectedCandidate]);

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    if (selectedCandidate?.id === updatedCandidate.id) {
        setSelectedCandidate(updatedCandidate);
    }
  };

  return (
    <PortalLayout portalName="Nurse Hiring Portal" userName={currentUser.name} onLogout={onLogout}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">My Candidates ({filteredMyCandidates.length})</h3>
            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
                >
                    <option value="all">All Statuses</option>
                    {Object.values(WorkflowStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1">
              {filteredMyCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidate?.id === candidate.id}
                  onSelect={() => setSelectedCandidate(candidate)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {selectedCandidate ? (
            <CandidateDetail candidate={selectedCandidate} onUpdateCandidate={handleUpdateCandidate} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {myCandidates.length > 0 ? "Select a candidate to view details." : "You have no candidates assigned."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default HiringPortal;
