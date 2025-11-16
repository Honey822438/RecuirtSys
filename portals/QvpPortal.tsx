import React from 'react';
import type { Candidate } from '../types';
import PortalLayout from '../components/PortalLayout';
import { WorkflowStatus, MedicalStatus } from '../types';

interface QvpPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
}

const QvpPortal: React.FC<QvpPortalProps> = ({ candidates, setCandidates, onLogout }) => {
  const qvpCandidates = candidates.filter(c => 
    c.workflowStatus === WorkflowStatus.AwaitingQVP && c.medicalStatus === MedicalStatus.Fit
  );

  const handleVerification = (candidateId: string) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId 
        ? { ...c, workflowStatus: WorkflowStatus.AwaitingEmbassy, progress: Math.max(c.progress, 65) } 
        : c
    ));
  };

  return (
    <PortalLayout portalName="QVP (Qualification Verification)" userName="QVP Team" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Candidates for QVP ({qvpCandidates.length})</h3>
        {qvpCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qvpCandidates.map(c => (
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
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {c.medicalStatus}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <button onClick={() => handleVerification(c.id)} className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors">Mark as Verified</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
           <p className="text-center py-8 text-gray-500">No medically fit candidates are currently awaiting QVP.</p>
        )}
      </div>
    </PortalLayout>
  );
};

export default QvpPortal;