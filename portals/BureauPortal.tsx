
import React, { useState, useMemo, useEffect } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, DocumentStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import CandidateCard from '../components/CandidateCard';

interface BureauPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const BureauPortal: React.FC<BureauPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const bureauCandidates = useMemo(() => 
    candidates.filter(c => c.workflowStatus === WorkflowStatus.AwaitingBureau), 
  [candidates]);

  useEffect(() => {
    if (!selectedCandidate && bureauCandidates.length > 0) {
      setSelectedCandidate(bureauCandidates[0]);
    } else if (selectedCandidate && !bureauCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(bureauCandidates[0] || null);
    }
  }, [bureauCandidates, selectedCandidate]);
  
  const handleNocStatusChange = (docStatus: DocumentStatus.Sent | DocumentStatus.Received) => {
    if (!selectedCandidate) return;

    let workflowUpdate = {};
    if (docStatus === DocumentStatus.Received) {
        workflowUpdate = { 
            workflowStatus: WorkflowStatus.AwaitingProtector, 
            progress: Math.max(selectedCandidate.progress, 90)
        };
    }
    
    setCandidates(candidates.map(c => {
        if (c.id === selectedCandidate.id) {
            const updatedDocs = c.documents.map(d => d.name === 'NOC' ? { ...d, status: docStatus } : d);
            return { ...c, ...workflowUpdate, documents: updatedDocs };
        }
        return c;
    }));
  };
  
  const InfoField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );

  return (
    <PortalLayout portalName="Bureau Processing" userName={currentUser.name} onLogout={onLogout}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Bureau Queue ({bureauCandidates.length})</h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              {bureauCandidates.map(candidate => (
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
             <div className="space-y-6 pb-6 h-full overflow-y-auto pr-2">
                <div className="bg-white p-6 rounded-xl shadow-sm flex items-start space-x-6">
                    <img className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-200" src={selectedCandidate.avatarUrl} alt={selectedCandidate.name} />
                    <div>
                        <h2 className="text-2xl font-bold text-primary-900">{selectedCandidate.name}</h2>
                        <div className="mt-2">
                          <StatusBadge status={selectedCandidate.workflowStatus} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Contact & Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField label="Candidate Email" value={selectedCandidate.email} />
                        <InfoField label="Bank Account" value={selectedCandidate.bankAccount} />
                        <InfoField label="Guardian CNIC" value={selectedCandidate.guardian.cnic} />
                        <InfoField label="Guardian Contact" value={selectedCandidate.guardian.contactNumber} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">NOC Processing</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-700">NOC Status:</span>
                            <StatusBadge status={selectedCandidate.documents.find(d => d.name === 'NOC')?.status || DocumentStatus.Pending} />
                        </div>
                         <div className="flex gap-2">
                             <button onClick={() => handleNocStatusChange(DocumentStatus.Sent)} className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-blue-600">Mark as Sent</button>
                             <button onClick={() => handleNocStatusChange(DocumentStatus.Received)} className="bg-green-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-green-600">Mark as Received</button>
                         </div>
                    </div>
                </div>

             </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {bureauCandidates.length > 0 ? "Select a candidate to process for NOC." : "No candidates have a visa issued yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default BureauPortal;
