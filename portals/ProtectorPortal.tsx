
import React, { useState, useMemo, useEffect } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, DocumentStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import CandidateCard from '../components/CandidateCard';

interface ProtectorPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const ProtectorPortal: React.FC<ProtectorPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const protectorCandidates = useMemo(() => 
    candidates.filter(c => c.workflowStatus === WorkflowStatus.AwaitingProtector), 
  [candidates]);

  useEffect(() => {
    if (!selectedCandidate && protectorCandidates.length > 0) {
      setSelectedCandidate(protectorCandidates[0]);
    } else if (selectedCandidate && !protectorCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(protectorCandidates[0] || null);
    }
  }, [protectorCandidates, selectedCandidate]);

  const handleProtectorDone = () => {
    if (!selectedCandidate) return;
    setCandidates(candidates.map(c => 
      c.id === selectedCandidate.id
        ? { ...c, workflowStatus: WorkflowStatus.ProtectorDone, progress: 100 }
        : c
    ));
  };
  
  const requiredDocs = ['NOC', 'Briefing Paper', 'Affidavit', 'Dataflow Report', 'Diploma', 'Diploma (Back)', 'PNC'];
  
  const allDocsPresent = useMemo(() => {
      if (!selectedCandidate) return false;
      return requiredDocs.every(docName => 
          selectedCandidate.documents.some(d => d.name === docName && d.status !== DocumentStatus.Pending)
      );
  }, [selectedCandidate]);

  const DocumentChecklistItem: React.FC<{ docName: string }> = ({ docName }) => {
    const doc = selectedCandidate?.documents.find(d => d.name === docName && d.status !== DocumentStatus.Pending);
    const isPresent = !!doc;
    return (
        <li className={`flex items-center p-2 rounded-md ${isPresent ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isPresent ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            )}
            <span className="text-sm font-medium">{docName}</span>
        </li>
    );
  };


  return (
    <PortalLayout portalName="Protector Processing" userName={currentUser.name} onLogout={onLogout}>
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Protector Queue ({protectorCandidates.length})</h3>
                    <div className="space-y-3 overflow-y-auto flex-1">
                    {protectorCandidates.map(candidate => (
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
                                <p className="text-primary-600">{selectedCandidate.email}</p>
                                <div className="mt-2">
                                <StatusBadge status={selectedCandidate.workflowStatus} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Final Document Checklist for Protector</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {requiredDocs.map(docName => <DocumentChecklistItem key={docName} docName={docName} />)}
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Action</h3>
                            <button
                                onClick={handleProtectorDone}
                                disabled={!allDocsPresent}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Mark as Protector Done
                            </button>
                            {!allDocsPresent && <p className="text-xs text-center text-red-600 mt-2">All documents in the checklist must be present to complete this step.</p>}
                        </div>

                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
                    <p className="text-gray-500 text-lg">
                        {protectorCandidates.length > 0 ? "Select a candidate for final processing." : "No candidates have received their NOC yet."}
                    </p>
                    </div>
                )}
            </div>
        </div>
    </PortalLayout>
  );
};

export default ProtectorPortal;
