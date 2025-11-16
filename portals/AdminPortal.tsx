
import React, { useState, useMemo } from 'react';
import type { Candidate, Employee, DemandLetter } from '../types';
import PortalLayout from '../components/PortalLayout';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';
import type { Role } from '../App';
import { MOCK_DEMAND_LETTERS } from '../constants';

// New Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import EmployeeManagement from '../components/admin/EmployeeManagement';
import DemandLetters from '../components/admin/DemandLetters';


interface AdminPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Role;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

type AdminTab = 'dashboard' | 'candidates' | 'employees' | 'demands';

const AdminPortal: React.FC<AdminPortalProps> = ({ candidates, setCandidates, onLogout, currentUser, employees, setEmployees }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0] || null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  const [demandLetters, setDemandLetters] = useState<DemandLetter[]>(MOCK_DEMAND_LETTERS);


  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    if (selectedCandidate?.id === updatedCandidate.id) {
        setSelectedCandidate(updatedCandidate);
    }
  };
  
  const TABS: { id: AdminTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'candidates', label: 'All Candidates' },
    { id: 'employees', label: 'Employee Management' },
    { id: 'demands', label: 'Demand Letters' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard candidates={candidates} employees={employees} />;
      case 'employees':
        return <EmployeeManagement employees={employees} setEmployees={setEmployees} />;
      case 'demands':
        return <DemandLetters demandLetters={demandLetters} setDemandLetters={setDemandLetters} />;
      case 'candidates':
        return (
            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-4 h-full overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">All Candidates ({candidates.length})</h3>
                    <div className="space-y-3">
                        {candidates.map(candidate => (
                        <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            isSelected={selectedCandidate?.id === candidate.id}
                            onSelect={() => setSelectedCandidate(candidate)}
                        />
                        ))}
                    </div>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    {selectedCandidate ? (
                    <CandidateDetail 
                        candidate={selectedCandidate} 
                        onUpdateCandidate={handleUpdateCandidate} 
                        allEmployees={employees}
                    />
                    ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 h-full flex items-center justify-center">
                        <p className="text-gray-500 text-lg">Select a candidate to view details.</p>
                    </div>
                    )}
                </div>
            </div>
        );
      default:
        return null;
    }
  };


  return (
    <PortalLayout portalName="Admin Panel" userName="Administrator" onLogout={onLogout}>
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                activeTab === tab.id
                                    ? 'border-accent-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div>{renderContent()}</div>
        </div>
    </PortalLayout>
  );
};

export default AdminPortal;
