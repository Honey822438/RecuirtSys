
import React from 'react';
// FIX: The type 'Screen' was not exported from '../App'. It has been replaced with the exported type 'Role'.
import type { Role } from '../App';
import { BriefcaseIcon, CogIcon, DocumentDuplicateIcon, UserGroupIcon, GlobeAltIcon, ShieldCheckIcon, BuildingLibraryIcon, BuildingOfficeIcon, PaperAirplaneIcon } from './icons';

interface SidebarProps {
  activeScreen: Role;
  setActiveScreen: (screen: Role) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItemProps {
  screen: Role;
  label: string;
  icon: React.ReactNode;
  activeScreen: Role;
  onClick: (screen: Role) => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, label, icon, activeScreen, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick(screen);
    }}
    className={`flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-200 transform rounded-md ${
      activeScreen === screen
        ? 'bg-primary-700 text-white'
        : 'text-gray-200 hover:bg-primary-600 hover:text-white'
    }`}
  >
    {icon}
    <span className="mx-4">{label}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen, sidebarOpen, setSidebarOpen }) => {
  const handleNavClick = (screen: Role) => {
    setActiveScreen(screen);
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-primary-800 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <BriefcaseIcon className="h-8 w-8 text-accent"/>
            <span className="text-white text-2xl mx-2 font-semibold">RecruitSys</span>
          </div>
        </div>
        <nav className="mt-10 px-2 flex-1">
          <NavItem screen="admin" label="Admin Panel" icon={<CogIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="entry" label="Entry Management" icon={<DocumentDuplicateIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="hiring" label="Hiring Portal" icon={<UserGroupIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="dataflow" label="Dataflow Mgt." icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="mumaris" label="Mumaris Plus" icon={<GlobeAltIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="qvp" label="QVP" icon={<ShieldCheckIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="embassy" label="Embassy Cases" icon={<BuildingLibraryIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="bureau" label="Bureau Processing" icon={<BuildingOfficeIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
          <NavItem screen="protector" label="Protector Proc." icon={<PaperAirplaneIcon className="h-5 w-5" />} activeScreen={activeScreen} onClick={handleNavClick} />
        </nav>
         <div className="px-2 pb-4">
             <div className="text-center text-xs text-gray-400">System Color: Gray</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
