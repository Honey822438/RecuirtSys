
import React from 'react';

interface IconProps {
  className?: string;
}

export const UserGroupIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0112 15.75c-1.036 0-1.973-.426-2.672-1.12a3.75 3.75 0 01-2.672-1.122m4.114-5.86c.281-.281.502-.625.625-1.004M10.5 11.25L12 12.75m-1.5-1.5L9 9.75M10.5 11.25L9 12.75M3.75 12c0-5.336 4.664-9.75 10.5-9.75s10.5 4.414 10.5 9.75c0 4.625-3.32 8.518-7.747 9.544a4.502 4.502 0 01-5.506 0A9.953 9.953 0 013.75 12z" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.998a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v.075a.75.75 0 001.5 0v-.075a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v.075a.75.75 0 001.5 0v-.075a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zM12.75 15.75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V6a.75.75 0 01.75-.75z" />
  </svg>
);

export const DocumentDuplicateIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.375 2.25c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-3.375c0-.621.504-1.125 1.125-1.125h1.5z" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 9.75v1.5m0 3v1.5m0-4.5l-1.5-1.5M12 12l1.5-1.5m0 3l-1.5 1.5M12 12l1.5 1.5m-3-1.5l-1.5 1.5m3-1.5l1.5-1.5M6 9.75l1.5 1.5M6 12l1.5-1.5M7.5 6l1.5 1.5m-3 0L7.5 9m6-3l-1.5 1.5M15 6l-1.5 1.5m-3 0l-1.5-1.5m3 0l1.5-1.5m0 9l1.5 1.5m-3 0l1.5-1.5m-6 3l1.5-1.5m0 3L9 15m0 3l-1.5-1.5M15 18l-1.5-1.5m3 0l-1.5 1.5" />
  </svg>
);

export const GlobeAltIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9h-9v9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 00-9 9h9V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9h9v9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 019 9h-9V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9v-9h9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 019-9v9H3z" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </svg>
);

export const BuildingLibraryIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

export const BuildingOfficeIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 21H8.25A2.25 2.25 0 016 18.75V4.5A2.25 2.25 0 018.25 2.25h7.5A2.25 2.25 0 0118 4.5v14.25A2.25 2.25 0 0115.75 21z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v.008h.008V4.5H12zM12 9h.008v.008H12V9zM12 13.5h.008v.008H12v-.008z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);
