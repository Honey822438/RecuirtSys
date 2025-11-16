import React from 'react';

interface PortalLayoutProps {
  portalName: string;
  userName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ portalName, userName, onLogout, children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{portalName}</h1>
            <p className="text-sm text-gray-500">Recruitment Management System</p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-gray-700 font-semibold">{userName}</span>
            <button onClick={onLogout} className="text-sm text-primary-600 hover:underline ml-2">
                (Logout)
            </button>
          </div>
          <img className="h-10 w-10 rounded-full object-cover" src={`https://picsum.photos/seed/${userName}/200`} alt="User Avatar" />
        </div>
      </header>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
