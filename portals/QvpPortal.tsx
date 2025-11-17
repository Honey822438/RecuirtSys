import React, { useState, useMemo, useEffect } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, MedicalStatus, DocumentStatus, CollectionMethod } from '../types';
import StatusBadge from '../components/StatusBadge';
import CandidateCard from '../components/CandidateCard';

interface QvpPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const QvpPortal: React.FC<QvpPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const qvpCandidates = useMemo(() => 
    candidates.filter(c => 
      ([WorkflowStatus.AwaitingQVP, WorkflowStatus.QVPApplied].includes(c.workflowStatus)) && 
      c.medicalStatus === MedicalStatus.Fit
    ), 
  [candidates]);

  useEffect(() => {
    if (!selectedCandidate && qvpCandidates.length > 0) {
      setSelectedCandidate(qvpCandidates[0]);
    } else if (selectedCandidate && !qvpCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(qvpCandidates[0] || null);
    }
  }, [qvpCandidates, selectedCandidate]);

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setProfilePicFile(null);
  };
  
  const handleMarkAsApplied = () => {
    if (!selectedCandidate || !profilePicFile) {
        alert("A profile picture is mandatory and must be uploaded to proceed.");
        return;
    }
    setCandidates(candidates.map(c => {
        if (c.id === selectedCandidate.id) {
            const newDoc = {
                id: `doc_pp_${c.id}`,
                name: 'Profile Picture',
                status: DocumentStatus.Received,
                collectionMethod: CollectionMethod.Direct,
            };
            return {
                ...c,
                workflowStatus: WorkflowStatus.QVPApplied,
                progress: Math.max(c.progress, 55),
                documents: [...c.documents, newDoc],
            };
        }
        return c;
    }));
  };

  const handleReviewCompleted = () => {
    if (!selectedCandidate) return;
    setCandidates(candidates.map(c =>
      c.id === selectedCandidate.id
        ? { ...c, workflowStatus: WorkflowStatus.AwaitingEmbassy, progress: Math.max(c.progress, 65) }
        : c
    ));
  };

  const requiredDocs = ['Passport', 'Diploma', 'Diploma (Back)', 'PNC', 'Nursing Mark Sheets', 'Dataflow Report'];

  const DocumentChecklistItem: React.FC<{ docName: string }> = ({ docName }) => {
    const doc = selectedCandidate?.documents.find(d => d.name === docName && d.status !== DocumentStatus.Pending);
    const isPresent = !!doc;
    return (
        <li className={`flex items-center p-2 rounded-md ${isPresent ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isPresent ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            <span className="text-sm font-medium">{docName}</span>
        </li>
    );
  };

  return (
    <PortalLayout portalName="QVP (Qualification Verification)" userName={currentUser.name} onLogout={onLogout}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">QVP Queue ({qvpCandidates.length})</h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              {qvpCandidates.map(candidate => (
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
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Medically Fit
                          </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Required Documents for Verification</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {requiredDocs.map(docName => <DocumentChecklistItem key={docName} docName={docName} />)}
                    </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Actions</h3>
                    {selectedCandidate.workflowStatus === WorkflowStatus.AwaitingQVP && (
                         <div className="space-y-4">
                            <p className="text-sm text-gray-600">Please upload a profile picture to begin the QVP application.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Mandatory)</label>
                                <input 
                                    type="file" 
                                    onChange={(e) => setProfilePicFile(e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                    accept="image/*"
                                />
                            </div>
                            <button
                                onClick={handleMarkAsApplied}
                                disabled={!profilePicFile}
                                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Mark as Applied
                            </button>
                        </div>
                    )}
                    {selectedCandidate.workflowStatus === WorkflowStatus.QVPApplied && (
                        <button 
                            onClick={handleReviewCompleted}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            Complete Review & Move to Embassy
                        </button>
                    )}
                </div>

            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {qvpCandidates.length > 0 ? "Select a candidate to begin verification." : "No medically fit candidates are awaiting QVP."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default QvpPortal;