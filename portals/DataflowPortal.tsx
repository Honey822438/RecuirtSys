import React from 'react';
import type { Candidate, WorkflowStatus as WFStatus, Employee } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface DataflowPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
}

const DataflowPortal: React.FC<DataflowPortalProps> = ({ candidates, setCandidates, onLogout, currentUser }) => {
  const dataflowCandidates = candidates.filter(c => 
    [WorkflowStatus.AwaitingDataflow, WorkflowStatus.DataflowApplied].includes(c.workflowStatus)
  );
  
  const handleStatusChange = (candidateId: string, newStatus: WFStatus) => {
      setCandidates(candidates.map(c => {
          if (c.id === candidateId) {
              // Automatically move to the next stage after completion
              if (newStatus === WorkflowStatus.DataflowCompleted) {
                  return { ...c, workflowStatus: WorkflowStatus.AwaitingMumaris, progress: Math.max(c.progress, 35) };
              }
              return { ...c, workflowStatus: newStatus, progress: Math.max(c.progress, 25) };
          }
          return c;
      }));
  };

  return (
    <PortalLayout portalName="Dataflow Management" userName={currentUser.name} onLogout={onLogout}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for Dataflow ({dataflowCandidates.length})</h3>
          {dataflowCandidates.length > 0 ? (
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
                  {dataflowCandidates.map(c => (
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
                          onChange={(e) => handleStatusChange(c.id, e.target.value as WFStatus)}
                          disabled={c.workflowStatus === WorkflowStatus.DataflowCompleted}
                          className="block w-48 px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"
                        >
                          { c.workflowStatus === WorkflowStatus.AwaitingDataflow && <option value={WorkflowStatus.AwaitingDataflow}>Awaiting Dataflow</option>}
                          <option value={WorkflowStatus.DataflowApplied}>Dataflow Applied</option>
                          <option value={WorkflowStatus.DataflowCompleted}>Dataflow Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-center py-8 text-gray-500">No candidates are currently awaiting Dataflow processing.</p>
          )}
        </div>
    </PortalLayout>
  );
};

export default DataflowPortal;