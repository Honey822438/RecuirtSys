
import React, { useState } from 'react';
import AdminPortal from './portals/AdminPortal';
import EntryPortal from './portals/EntryPortal';
import HiringPortal from './portals/HiringPortal';
import DataflowPortal from './portals/DataflowPortal';
import MumarisPortal from './portals/MumarisPortal';
import QvpPortal from './portals/QvpPortal';
import EmbassyPortal from './portals/EmbassyPortal';
import BureauPortal from './portals/BureauPortal';
import ProtectorPortal from './portals/ProtectorPortal';
import LoginScreen from './screens/LoginScreen';
import { MOCK_CANDIDATES } from './constants';
import type { Candidate } from './types';

export type Role = 'admin' | 'hiring' | 'entry' | 'dataflow' | 'mumaris' | 'qvp' | 'embassy' | 'bureau' | 'protector';

const App: React.FC = () => {
  const [loggedInRole, setLoggedInRole] = useState<Role | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);

  const handleLogout = () => {
    setLoggedInRole(null);
  };

  const renderPortal = () => {
    if (!loggedInRole) {
      return <LoginScreen onLogin={setLoggedInRole} />;
    }

    const portalProps = {
      candidates,
      setCandidates,
      onLogout: handleLogout,
      currentUser: loggedInRole,
    };

    switch (loggedInRole) {
      case 'admin':
        return <AdminPortal {...portalProps} />;
      case 'hiring':
        return <HiringPortal {...portalProps} hiringOfficerId="officer_01" />;
      case 'entry':
        return <EntryPortal {...portalProps} />;
      case 'dataflow':
        return <DataflowPortal {...portalProps} />;
      case 'mumaris':
        return <MumarisPortal {...portalProps} />;
      case 'qvp':
        return <QvpPortal {...portalProps} />;
      case 'embassy':
        return <EmbassyPortal {...portalProps} />;
      case 'bureau':
        return <BureauPortal {...portalProps} />;
      case 'protector':
        return <ProtectorPortal {...portalProps} />;
      default:
        return <LoginScreen onLogin={setLoggedInRole} />;
    }
  };

  // FIX: Corrected function call from renderScreen to the defined renderPortal.
  return <div className="antialiased text-gray-800">{renderPortal()}</div>;
};

export default App;