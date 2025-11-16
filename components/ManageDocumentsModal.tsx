
import React, { useState, useMemo } from 'react';
// FIX: 'DocumentStatus' is an enum, which is a runtime value. It needs to be imported without the 'type' keyword. Other imports from '../types' are merged for cleanliness.
import { WorkflowStatus, DocumentStatus, type Candidate, type Document, CollectionMethod, DiplomaVerificationStatus } from '../types';

interface ManageDocumentsModalProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdateCandidate: (updatedCandidate: Candidate) => void;
}

const documentStatusOptions = Object.values(DocumentStatus);
const collectionMethodOptions = Object.values(CollectionMethod);
const diplomaVerificationOptions = Object.values(DiplomaVerificationStatus);


const ManageDocumentsModal: React.FC<ManageDocumentsModalProps> = ({ candidate, onClose, onUpdateCandidate }) => {
  const [documents, setDocuments] = useState<Document[]>(JSON.parse(JSON.stringify(candidate.documents)));

  const handleDocumentChange = (docId: string, field: keyof Document, value: any) => {
    setDocuments(prevDocs => prevDocs.map(doc => {
        if (doc.id === docId) {
            const updatedDoc = { ...doc, [field]: value };
            // Auto-update main status based on verification status for Diploma
            if (doc.name === 'Diploma' && field === 'verificationStatus') {
                if (value === DiplomaVerificationStatus.ReceivedFromEmbassy) {
                    updatedDoc.status = DocumentStatus.Attested;
                } else if (value !== DiplomaVerificationStatus.None) {
                    updatedDoc.status = DocumentStatus.Sent;
                }
            }
            return updatedDoc;
        }
        return doc;
    }));
  };

  const handleSaveChanges = () => {
    onUpdateCandidate({ ...candidate, documents });
    onClose();
  };
  
  const handleReturnAll = () => {
      setDocuments(prevDocs => prevDocs.map(doc => {
          if (doc.status === DocumentStatus.Received || doc.status === DocumentStatus.Attested) {
              return { ...doc, status: DocumentStatus.OnHand };
          }
          return doc;
      }));
  };

  const canPromote = useMemo(() => {
    const passport = documents.find(d => d.name === 'Passport');
    const diploma = documents.find(d => d.name === 'Diploma');
    return passport?.status === DocumentStatus.Received && diploma?.status === DocumentStatus.Received;
  }, [documents]);

  const handlePromote = () => {
    onUpdateCandidate({ 
        ...candidate, 
        documents, 
        workflowStatus: WorkflowStatus.AwaitingDataflow,
        progress: Math.max(candidate.progress, 15), // Bump progress
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center border-b pb-4">
             <h3 className="text-xl leading-6 font-bold text-gray-900 text-center">Manage Documents for {candidate.name}</h3>
             <button onClick={handleReturnAll} className="bg-yellow-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-yellow-600">
                Return All Documents
             </button>
          </div>

          <div className="mt-4 p-4 space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-50 p-3 rounded-md">
                <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Collection</label>
                    <select 
                      value={doc.collectionMethod}
                      onChange={(e) => handleDocumentChange(doc.id, 'collectionMethod', e.target.value as CollectionMethod)}
                      className="block w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {collectionMethodOptions.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-500">{doc.name === 'Diploma' ? 'Verification Step' : 'Overall Status'}</label>
                    {doc.name === 'Diploma' ? (
                         <select 
                            value={doc.verificationStatus || DiplomaVerificationStatus.None}
                            onChange={(e) => handleDocumentChange(doc.id, 'verificationStatus', e.target.value as DiplomaVerificationStatus)}
                            className="block w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                            {diplomaVerificationOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    ) : (
                        <select 
                          value={doc.status}
                          onChange={(e) => handleDocumentChange(doc.id, 'status', e.target.value as DocumentStatus)}
                          className="block w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          {documentStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="items-center px-4 py-3 flex justify-end gap-3 bg-gray-50 -mx-5 -mb-5 mt-6 rounded-b-md">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none">
              Cancel
            </button>
            <button type="button" onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handlePromote}
              disabled={!canPromote}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Promote to Dataflow
            </button>
          </div>
          {!canPromote && <p className="text-xs text-center text-gray-500 mt-2">Passport and Diploma must be 'Received' to promote.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageDocumentsModal;