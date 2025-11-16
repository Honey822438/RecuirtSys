import React, { useState, useMemo } from 'react';
import type { Candidate } from '../types';
import PortalLayout from '../components/PortalLayout';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';
import { MOCK_EMPLOYEES } from '../constants';

interface HiringPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  hiringOfficerId: string;
}

const HiringPortal: React.FC<HiringPortalProps> = ({ candidates, setCandidates, onLogout, hiringOfficerId }) => {
  const myCandidates = useMemo(() => 
    candidates.filter(c => c.hiringOfficerId === hiringOfficerId), 
    [candidates, hiringOfficerId]
  );
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(myCandidates[0] || null);
  
  const officerName = useMemo(() => 
    MOCK_EMPLOYEES.find(e => e.id === hiringOfficerId)?.name || 'Hiring Officer',
    [hiringOfficerId]
  );

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    if (selectedCandidate?.id === updatedCandidate.id) {
        setSelectedCandidate(updatedCandidate);
    }
  };

  return (
    <PortalLayout portalName="Nurse Hiring Portal" userName={officerName} onLogout={onLogout}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">My Candidates ({myCandidates.length})</h3>
            <div className="space-y-3">
              {myCandidates.map(candidate => (
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
              <p className="text-gray-500 text-lg">Select a candidate to view details.</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default HiringPortal;