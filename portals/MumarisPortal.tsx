import React from 'react';
import type { Candidate, WorkflowStatus as WFStatus, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface MumarisPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const MumarisPortal: React.FC<MumarisPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const mumarisCandidates = candidates.filter(c => 
    [WorkflowStatus.AwaitingMumaris, WorkflowStatus.MumarisApplied].includes(c.workflowStatus)
  );

  const handleStatusChange = (candidateId: string, newStatus: WFStatus | 'MumarisCompleted') => {
      setCandidates(candidates.map(c => {
          if (c.id === candidateId) {
              if (newStatus === 'MumarisCompleted') {
                  return { ...c, workflowStatus: WorkflowStatus.AwaitingQVP, progress: Math.max(c.progress, 50) };
              }
              return { ...c, workflowStatus: newStatus as WFStatus, progress: Math.max(c.progress, 45) };
          }
          return c;
      }));
  };

  return (
    <PortalLayout portalName="Mumaris Plus Integration" userName={currentUser.name} onLogout={onLogout}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for Mumaris Plus ({mumarisCandidates.length})</h3>
        {mumarisCandidates.length > 0 ? (
           <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mumarisCandidates.map(c => (
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
                        <StatusBadge status={c.workflowStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={c.workflowStatus}
                          onChange={(e) => handleStatusChange(c.id, e.target.value as WFStatus | 'MumarisCompleted')}
                          className="block w-48 px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          { c.workflowStatus === WorkflowStatus.AwaitingMumaris && <option value={WorkflowStatus.AwaitingMumaris}>Awaiting Mumaris</option>}
                          <option value={WorkflowStatus.MumarisApplied}>Mumaris Applied</option>
                          <option value={'MumarisCompleted'}>Mumaris Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : (
           <p className="text-center py-8 text-gray-500">No candidates are ready for Mumaris Plus submission.</p>
        )}
      </div>
    </PortalLayout>
  );
};

export default MumarisPortal;