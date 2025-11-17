import React, { useState } from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, CustomerType, DocumentStatus, CollectionMethod } from '../types';
import StatusBadge from '../components/StatusBadge';

interface DataflowPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const DataflowPortal: React.FC<DataflowPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const [reportFiles, setReportFiles] = useState<Record<string, File | null>>({});

  const dataflowCandidates = candidates.filter(c => 
    [WorkflowStatus.AwaitingDataflow, WorkflowStatus.DataflowApplied].includes(c.workflowStatus)
  );

  const handleFileSelect = (candidateId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReportFiles(prev => ({ ...prev, [candidateId]: e.target.files![0] }));
    }
  };
  
  const handleStatusChange = (candidateId: string, newStatus: WorkflowStatus) => {
      setCandidates(candidates.map(c => {
          if (c.id === candidateId) {
              return { ...c, workflowStatus: newStatus, progress: Math.max(c.progress, 25) };
          }
          return c;
      }));
  };

  const handleCompleteDataflow = (candidateId: string) => {
    const file = reportFiles[candidateId];
    if (!file) {
      alert('Please upload the Dataflow report before marking as complete.');
      return;
    }

    setCandidates(candidates.map(c => {
      if (c.id === candidateId) {
        const existingReport = c.documents.find(d => d.name === 'Dataflow Report');
        let updatedDocuments = c.documents;

        if (existingReport) {
          updatedDocuments = c.documents.map(d => d.name === 'Dataflow Report' ? { ...d, status: DocumentStatus.OnHand } : d);
        } else {
          updatedDocuments.push({
            id: `doc_df_${c.id}`,
            name: 'Dataflow Report',
            status: DocumentStatus.OnHand,
            collectionMethod: CollectionMethod.Direct,
          });
        }
        
        return { 
          ...c, 
          workflowStatus: WorkflowStatus.AwaitingMumaris, 
          progress: Math.max(c.progress, 35),
          documents: updatedDocuments,
        };
      }
      return c;
    }));
  };

  const DocumentLink: React.FC<{ name: string }> = ({ name }) => (
    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-full transition-colors">
      View {name}
    </a>
  );

  return (
    <PortalLayout portalName="Dataflow Management" userName={currentUser.name} onLogout={onLogout}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for Dataflow ({dataflowCandidates.length})</h3>
          {dataflowCandidates.length > 0 ? (
            <div className="space-y-4">
              {dataflowCandidates.map(c => (
                <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    {/* Candidate Info */}
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <img src={c.avatarUrl} alt={c.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-200" />
                      <div>
                        <p className="font-bold text-lg text-primary-800">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.email}</p>
                        <div className="mt-2">
                           <StatusBadge status={c.workflowStatus} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Documents Display */}
                    {c.customerType === CustomerType.Fresh && c.payment.received > 0 && (
                       <div className="flex-shrink-0 mb-4 md:mb-0">
                         <p className="text-sm font-semibold text-gray-700 mb-2">Required Documents:</p>
                         <div className="flex flex-wrap gap-2">
                           <DocumentLink name="Passport"/>
                           <DocumentLink name="Diploma & Mark sheets"/>
                           <DocumentLink name="PNC"/>
                         </div>
                       </div>
                    )}
                    
                    {/* Actions */}
                    <div className="w-full md:w-auto md:max-w-xs flex-shrink-0 space-y-3">
                      {c.workflowStatus === WorkflowStatus.AwaitingDataflow && (
                        <button 
                          onClick={() => handleStatusChange(c.id, WorkflowStatus.DataflowApplied)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                        >
                          Mark as Applied
                        </button>
                      )}
                      {c.workflowStatus === WorkflowStatus.DataflowApplied && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dataflow Report</label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileSelect(c.id, e)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                            accept=".pdf,image/*"
                          />
                           <button 
                              onClick={() => handleCompleteDataflow(c.id)}
                              disabled={!reportFiles[c.id]}
                              className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              Complete Process
                            </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center py-8 text-gray-500">No candidates are currently awaiting Dataflow processing.</p>
          )}
        </div>
    </PortalLayout>
  );
};

export default DataflowPortal;