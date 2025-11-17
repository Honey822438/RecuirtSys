import React from 'react';
import type { Candidate, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus } from '../types';

interface ProtectorPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const ProtectorPortal: React.FC<ProtectorPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const protectorCandidates = candidates.filter(c => 
    c.workflowStatus === WorkflowStatus.AwaitingProtector
  );

  const handleProtectorDone = (candidateId: string) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId
        ? { ...c, workflowStatus: WorkflowStatus.ProtectorDone, progress: 100 }
        : c
    ));
  };

  return (
    <PortalLayout portalName="Protector Processing" userName={currentUser.name} onLogout={onLogout}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for Protector Emigration ({protectorCandidates.length})</h3>
        {protectorCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protectorCandidates.map(c => (
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
                       <button onClick={() => handleProtectorDone(c.id)} className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors">Mark as Protector Done</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
           <p className="text-center py-8 text-gray-500">No candidates are currently awaiting protector processing.</p>
        )}
      </div>
    </PortalLayout>
  );
};

export default ProtectorPortal;