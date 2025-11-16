import React from 'react';
import type { Candidate } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus } from '../types';

interface EmbassyPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
}

const EmbassyPortal: React.FC<EmbassyPortalProps> = ({ candidates, setCandidates, onLogout }) => {
  const embassyCandidates = candidates.filter(c => 
    c.workflowStatus === WorkflowStatus.AwaitingEmbassy
  );

  const handleVisaIssued = (candidateId: string) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId
        ? { ...c, workflowStatus: WorkflowStatus.AwaitingBureau, progress: Math.max(c.progress, 80) }
        : c
    ));
  };

  return (
    <PortalLayout portalName="Embassy Case Management" userName="Embassy Team" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for Embassy Submission ({embassyCandidates.length})</h3>
        {embassyCandidates.length > 0 ? (
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {embassyCandidates.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={c.avatarUrl} alt={c.name} className="h-10 w-10 rounded-full" />
                        <div className="ml-4">
                          <p className="font-semibold text-gray-800">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <button onClick={() => handleVisaIssued(c.id)} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">Mark Visa as Issued</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
           <p className="text-center py-8 text-gray-500">No candidates are currently awaiting embassy processing.</p>
        )}
      </div>
    </PortalLayout>
  );
};

export default EmbassyPortal;