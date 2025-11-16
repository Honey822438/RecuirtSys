
import React, { useState } from 'react';
// FIX: The type 'Screen' was not exported from '../App'. It has been replaced with the exported type 'Role'.
import type { Role } from '../App';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeScreen: Role;
  setActiveScreen: (screen: Role) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeScreen, setActiveScreen }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const screenTitles: Record<Role, string> = {
    admin: 'Admin Panel',
    hiring: 'Nurse Hiring Portal',
    entry: 'Entry Management',
    dataflow: 'Dataflow Management',
    mumaris: 'Mumaris Plus Integration',
    qvp: 'QVP (Qualification Verification Process)',
    embassy: 'Embassy Case Management',
    bureau: 'Bureau Processing',
    protector: 'Protector Processing',
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{screenTitles[activeScreen]}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Admin</span>
            <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/seed/admin/200" alt="Admin Avatar" />
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
