import React, { useMemo } from 'react';
import type { Candidate, Employee } from '../../types';
import { WorkflowStatus } from '../../types';
import StatusBadge from '../StatusBadge';

interface AdminDashboardProps {
    candidates: Candidate[];
    employees: Employee[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
        <div className="bg-primary-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ candidates, employees }) => {
    const stats = useMemo(() => {
        const completed = candidates.filter(c => c.workflowStatus === WorkflowStatus.ProtectorDone).length;
        return {
            total: candidates.length,
            active: candidates.length - completed,
            completed,
            employees: employees.length,
        }
    }, [candidates, employees]);

    const workflowCounts = useMemo(() => {
        const counts = new Map<WorkflowStatus, number>();
        for (const candidate of candidates) {
            counts.set(candidate.workflowStatus, (counts.get(candidate.workflowStatus) || 0) + 1);
        }
        return Array.from(counts.entries()).sort((a,b) => b[1] - a[1]);
    }, [candidates]);
    
    const priorityCases = useMemo(() => 
        candidates.filter(c => c.workflowStatus === WorkflowStatus.AwaitingProtector || c.workflowStatus === WorkflowStatus.VisaIssued),
    [candidates]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Candidates" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Active Cases" value={stats.active} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="Placements Done" value={stats.completed} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Employees" value={stats.employees} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                     <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Workflow Status Breakdown</h3>
                     <div className="space-y-3">
                         {workflowCounts.map(([status, count]) => (
                             <div key={status} className="flex items-center justify-between">
                                 <StatusBadge status={status} />
                                 <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                                    <div className="h-2 bg-accent-500 rounded-full" style={{ width: `${(count/stats.total) * 100}%`}}></div>
                                 </div>
                                 <span className="text-sm font-semibold text-gray-700">{count}</span>
                             </div>
                         ))}
                     </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                     <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Priority Alerts</h3>
                     <p className="text-sm text-gray-500 mb-3">Visa issued but protector pending.</p>
                     {priorityCases.length > 0 ? (
                        <div className="space-y-3">
                            {priorityCases.map(c => (
                                <div key={c.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm text-yellow-800">{c.name}</p>
                                        <p className="text-xs text-yellow-600">{c.hiringOfficerId}</p>
                                    </div>
                                    <StatusBadge status={c.workflowStatus} />
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-center py-8 text-gray-500">No priority cases found.</p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;