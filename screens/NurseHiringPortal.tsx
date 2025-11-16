
import React, { useState } from 'react';
import { MOCK_CANDIDATES } from '../constants';
import type { Candidate } from '../types';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';

const NurseHiringPortal: React.FC = () => {
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0] || null);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Candidates ({candidates.length})</h3>
          <div className="space-y-3">
            {candidates.map(candidate => (
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
          <CandidateDetail candidate={selectedCandidate} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">Select a candidate to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseHiringPortal;
