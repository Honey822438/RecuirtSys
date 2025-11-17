
import React, { useState, useMemo, useEffect } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, MedicalStatus, DocumentStatus, CollectionMethod } from '../types';
import StatusBadge from '../components/StatusBadge';
import CandidateCard from '../components/CandidateCard';

interface EmbassyPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const EmbassyPortal: React.FC<EmbassyPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [visaFormFile, setVisaFormFile] = useState<File | null>(null);

  const embassyCandidates = useMemo(() => 
    candidates.filter(c => 
      c.workflowStatus === WorkflowStatus.AwaitingEmbassy &&
      c.medicalStatus === MedicalStatus.Fit
    ), 
  [candidates]);

  useEffect(() => {
    if (!selectedCandidate && embassyCandidates.length > 0) {
      setSelectedCandidate(embassyCandidates[0]);
    } else if (selectedCandidate && !embassyCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(embassyCandidates[0] || null);
    }
  }, [embassyCandidates, selectedCandidate]);

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setVisaFormFile(null);
  };
  
  const handleVisaIssued = () => {
    if (!selectedCandidate || !visaFormFile) {
        alert("Uploading the Visa Form is mandatory to proceed.");
        return;
    }
    setCandidates(candidates.map(c => {
        if (c.id === selectedCandidate.id) {
            const newDoc = {
                id: `doc_visa_${c.id}`,
                name: 'Visa Form',
                status: DocumentStatus.Received,
                collectionMethod: CollectionMethod.Direct,
            };
            return {
                ...c,
                workflowStatus: WorkflowStatus.AwaitingBureau,
                progress: Math.max(c.progress, 80),
                documents: [...c.documents, newDoc],
            };
        }
        return c;
    }));
  };

  const isMarried = selectedCandidate?.guardian.relation === 'Husband';
  const requiredDocs = ['CNIC', 'Passport', 'Diploma', 'Diploma (Back)', 'Wakala'];
  if (isMarried) {
    requiredDocs.push('Marriage Certificate');
  }

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
    <PortalLayout portalName="Embassy Case Management" userName={currentUser.name} onLogout={onLogout}>
       <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Embassy Queue ({embassyCandidates.length})</h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              {embassyCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidate?.id === candidate.id}
                  onSelect={() => handleSelectCandidate(candidate)}
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
                        <div className="mt-2 flex items-center gap-4">
                          <StatusBadge status={selectedCandidate.workflowStatus} />
                          <StatusBadge status={selectedCandidate.medicalStatus} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Required Documents for Visa</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {requiredDocs.map(docName => <DocumentChecklistItem key={docName} docName={docName} />)}
                    </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Actions</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Form (Mandatory)</label>
                            <input 
                                type="file" 
                                onChange={(e) => setVisaFormFile(e.target.files ? e.target.files[0] : null)}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                accept=".pdf,image/*"
                            />
                        </div>
                        <button
                            onClick={handleVisaIssued}
                            disabled={!visaFormFile}
                            className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Mark Visa as Issued
                        </button>
                    </div>
                </div>

            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {embassyCandidates.length > 0 ? "Select a candidate to process their visa." : "No candidates are currently awaiting embassy processing."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default EmbassyPortal;
