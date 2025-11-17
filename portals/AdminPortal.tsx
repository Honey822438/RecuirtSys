
import React, { useState, useMemo } from 'react';
import type { Candidate, Employee, DemandLetter } from '../types';
import { WorkflowStatus } from '../types';
import PortalLayout from '../components/PortalLayout';
import CandidateCard from '../components/CandidateCard';
import CandidateDetail from '../components/CandidateDetail';

// New Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import EmployeeManagement from '../components/admin/EmployeeManagement';
import DemandLetters from '../components/admin/DemandLetters';


interface AdminPortalProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  onLogout: () => void;
  currentUser: Employee;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  demandLetters: DemandLetter[];
  setDemandLetters: (letters: DemandLetter[]) => void;
}

type AdminTab = 'dashboard' | 'candidates' | 'employees' | 'demands';

const AdminPortal: React.FC<AdminPortalProps> = ({ candidates, setCandidates, onLogout, currentUser, employees, setEmployees, demandLetters, setDemandLetters }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(c => statusFilter === 'all' || c.workflowStatus === statusFilter)
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [candidates, searchTerm, statusFilter]);
  
  // Effect to update selection when filters change
  React.useEffect(() => {
    if (selectedCandidate && !filteredCandidates.some(c => c.id === selectedCandidate.id)) {
        setSelectedCandidate(filteredCandidates[0] || null);
    } else if (!selectedCandidate && filteredCandidates.length > 0) {
        setSelectedCandidate(filteredCandidates[0]);
    }
  }, [filteredCandidates, selectedCandidate]);


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
                    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">All Candidates ({filteredCandidates.length})</h3>
                        <div className="mb-4 space-y-2">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                             <select
                                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
                            >
                                <option value="all">All Statuses</option>
                                {Object.values(WorkflowStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3 overflow-y-auto flex-1">
                            {filteredCandidates.map(candidate => (
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
                        <p className="text-gray-500 text-lg">
                             {candidates.length > 0 ? 'Select a candidate to view details.' : 'No candidates found.'}
                        </p>
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
    <PortalLayout portalName="Admin Panel" userName={currentUser.name} onLogout={onLogout}>
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
