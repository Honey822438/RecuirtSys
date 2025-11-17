
import React, { useState, useEffect, useMemo } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, DocumentStatus, CollectionMethod } from '../types';
import StatusBadge from '../components/StatusBadge';
import CandidateCard from '../components/CandidateCard';

interface MumarisPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
  employees: Employee[];
}

const MumarisPortal: React.FC<MumarisPortalProps> = ({ candidates, setCandidates, onLogout, currentUser, employees }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [applicationFile, setApplicationFile] = useState<File | null>(null);

  const mumarisCandidates = useMemo(() => 
    candidates.filter(c => 
      [WorkflowStatus.AwaitingMumaris, WorkflowStatus.MumarisApplied].includes(c.workflowStatus)
    ), 
    [candidates]
  );
  
  useEffect(() => {
    if (!selectedCandidate && mumarisCandidates.length > 0) {
      setSelectedCandidate(mumarisCandidates[0]);
    }
    if (selectedCandidate && !mumarisCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(mumarisCandidates[0] || null);
    }
  }, [mumarisCandidates, selectedCandidate]);


  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setProfilePicFile(null);
    setApplicationFile(null);
  };
  
  const handleMarkAsApplied = () => {
    if (!selectedCandidate || !profilePicFile || !applicationFile) {
        alert("Please upload both a profile picture and the Mumaris application form.");
        return;
    }
    
    setCandidates(candidates.map(c => {
        if (c.id === selectedCandidate.id) {
            const newDoc = {
                id: `doc_mumaris_${c.id}`,
                name: 'Mumaris Application',
                status: DocumentStatus.Sent,
                collectionMethod: CollectionMethod.Direct,
            };
            return { 
                ...c, 
                workflowStatus: WorkflowStatus.MumarisApplied, 
                progress: Math.max(c.progress, 45),
                documents: [...c.documents, newDoc]
            };
        }
        return c;
    }));
  };
  
  const handleMarkAsCompleted = () => {
    if (!selectedCandidate) return;
    setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id
        ? { ...c, workflowStatus: WorkflowStatus.AwaitingQVP, progress: Math.max(c.progress, 50) }
        : c
    ));
  };

  const handleDownloadPdf = () => {
    alert("Simulating PDF download with: Diploma, Matric, Transcript, PNC, Dataflow report, Experience certificate, Passport photo.");
  };

  const hiringOfficer = useMemo(() => 
    selectedCandidate ? employees.find(e => e.id === selectedCandidate.hiringOfficerId) : null,
    [selectedCandidate, employees]
  );

  return (
    <PortalLayout portalName="Mumaris Plus Integration" userName={currentUser.name} onLogout={onLogout}>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Left column: Candidate List */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Mumaris Queue ({mumarisCandidates.length})</h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              {mumarisCandidates.map(candidate => (
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

        {/* Right column: Details Panel */}
        <div className="flex-1 min-w-0">
          {selectedCandidate ? (
            <div className="space-y-6 pb-6 h-full overflow-y-auto pr-2">
                {/* Header */}
                <div className="bg-white p-6 rounded-xl shadow-sm flex items-start space-x-6">
                    <img
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-200"
                        src={selectedCandidate.avatarUrl}
                        alt={selectedCandidate.name}
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-primary-900">{selectedCandidate.name}</h2>
                        <p className="text-primary-600">{selectedCandidate.email}</p>
                        <div className="mt-2">
                          <StatusBadge status={selectedCandidate.workflowStatus} />
                        </div>
                    </div>
                </div>

                {/* Recruiter Info */}
                {hiringOfficer && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Assigned Recruiter</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="text-sm font-medium text-gray-800">{hiringOfficer.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-800">{hiringOfficer.email}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Actions Panel */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Actions</h3>
                    {selectedCandidate.workflowStatus === WorkflowStatus.AwaitingMumaris && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Please upload the required files to proceed.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Mandatory)</label>
                                <input 
                                    type="file" 
                                    onChange={(e) => setProfilePicFile(e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mumaris Application (Mandatory)</label>
                                <input 
                                    type="file" 
                                    onChange={(e) => setApplicationFile(e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept=".pdf,image/*"
                                />
                            </div>
                            <button
                                onClick={handleMarkAsApplied}
                                disabled={!profilePicFile || !applicationFile}
                                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Mark as Applied
                            </button>
                        </div>
                    )}
                     {selectedCandidate.workflowStatus === WorkflowStatus.MumarisApplied && (
                         <button 
                            onClick={handleMarkAsCompleted}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            Complete Review & Move to QVP
                        </button>
                    )}
                </div>

                {/* Document List */}
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Uploaded Documents</h3>
                        <button onClick={handleDownloadPdf} className="bg-accent-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-accent-600">
                           Download Documents PDF
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {selectedCandidate.documents.map(doc => (
                            <li key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                <StatusBadge status={doc.status} />
                            </li>
                        ))}
                    </ul>
                 </div>

            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {mumarisCandidates.length > 0 ? "Select a candidate to view details." : "No candidates are ready for Mumaris Plus submission."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default MumarisPortal;