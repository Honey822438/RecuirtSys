
import React, { useState } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import AddCustomerModal from '../components/AddStaffModal';
import ManageDocumentsModal from '../components/ManageDocumentsModal';
import { WorkflowStatus, DocumentStatus, MedicalStatus, CustomerType, CollectionMethod, DiplomaVerificationStatus } from '../types';

interface EntryPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
  employees: Employee[];
}

const EntryPortal: React.FC<EntryPortalProps> = ({ candidates, setCandidates, onLogout, currentUser, employees }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageDocsModalOpen, setIsManageDocsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const entryCandidates = candidates.filter(c => c.workflowStatus === WorkflowStatus.Entry);

  const handleAddCandidate = (newCandidateData: Omit<Candidate, 'id' | 'avatarUrl' | 'progress' | 'documents' | 'workflowStatus' | 'videos' | 'medicalStatus' | 'payment'> & { payment: { agreed: number } }) => {
    const newCandidate: Candidate = {
      ...newCandidateData,
      id: `cand_${Date.now()}`,
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(newCandidateData.name)}/200`,
      progress: 5,
      videos: [],
      medicalStatus: MedicalStatus.NoSlip,
      workflowStatus: WorkflowStatus.Entry,
      payment: {
        agreed: newCandidateData.payment.agreed,
        additional: 0,
        received: 0,
      },
      documents: [
        { id: 'doc1', name: 'Passport', status: DocumentStatus.Pending, collectionMethod: CollectionMethod.NotCollected },
        { id: 'doc2', name: 'Diploma', status: DocumentStatus.Pending, collectionMethod: CollectionMethod.NotCollected, verificationStatus: DiplomaVerificationStatus.None },
        { id: 'doc3', name: 'PNC', status: DocumentStatus.Pending, collectionMethod: CollectionMethod.NotCollected },
        { id: 'doc4', name: 'Experience Certificate', status: DocumentStatus.Pending, collectionMethod: CollectionMethod.NotCollected },
      ],
    };
    setCandidates([...candidates, newCandidate]);
    setIsAddModalOpen(false);
  };

  const handleManageDocuments = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsManageDocsModalOpen(true);
  };
  
  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
  };


  return (
    <PortalLayout portalName="Entry Management" userName={currentUser.name} onLogout={onLogout}>
      {isAddModalOpen && (
        <AddCustomerModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddCandidate={handleAddCandidate} 
          employees={employees}
        />
      )}
      {isManageDocsModalOpen && selectedCandidate && (
        <ManageDocumentsModal 
          candidate={selectedCandidate}
          onClose={() => setIsManageDocsModalOpen(false)} 
          onUpdateCandidate={handleUpdateCandidate}
        />
      )}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-700">New Candidates</h2>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center shadow-md hover:shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Customer Entry
            </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates in Entry Stage ({entryCandidates.length})</h3>
          {entryCandidates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiring Officer ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entryCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={c.avatarUrl} alt={c.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                            <div className="text-sm text-gray-500">{c.email}</div>
                          </div>
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {c.customerType}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.hiringOfficerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleManageDocuments(c)} className="text-primary-600 hover:text-primary-900">Manage Documents</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-center py-8 text-gray-500">No candidates are currently in the entry stage.</p>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default EntryPortal;