
import React, { useState, useEffect } from 'react';
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
import SignUpScreen from './screens/SignUpScreen';
import * as db from './database';
import type { Candidate, Employee, DemandLetter } from './types';

export type Role = 'admin' | 'hiring' | 'entry' | 'dataflow' | 'mumaris' | 'qvp' | 'embassy' | 'bureau' | 'protector';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loggedInRole, setLoggedInRole] = useState<Role | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(() => db.getCandidates());
  const [employees, setEmployees] = useState<Employee[]>(() => db.getEmployees());
  const [demandLetters, setDemandLetters] = useState<DemandLetter[]>(() => db.getDemandLetters());

  useEffect(() => {
    db.setCandidates(candidates);
  }, [candidates]);

  useEffect(() => {
    db.setEmployees(employees);
  }, [employees]);
  
  useEffect(() => {
    db.setDemandLetters(demandLetters);
  }, [demandLetters]);

  const handleLogout = () => {
    setLoggedInRole(null);
    setView('login');
  };
  
  const handleSignUp = (newEmployeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
        ...newEmployeeData,
        id: `emp_${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmployee]);
    setLoggedInRole(newEmployee.role); // Auto-login after signup
  };

  const renderAuth = () => {
    if (view === 'login') {
      return <LoginScreen onLogin={setLoggedInRole} employees={employees} onNavigateToSignUp={() => setView('signup')} />;
    }
    return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={() => setView('login')} employees={employees} />;
  };

  const renderPortal = () => {
    if (!loggedInRole) {
      return renderAuth();
    }

    const portalProps = {
      candidates,
      setCandidates,
      onLogout: handleLogout,
      currentUser: loggedInRole,
    };

    switch (loggedInRole) {
      case 'admin':
        return <AdminPortal 
                    {...portalProps} 
                    employees={employees} 
                    setEmployees={setEmployees}
                    demandLetters={demandLetters}
                    setDemandLetters={setDemandLetters}
                />;
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
        return renderAuth();
    }
  };

  return <div className="antialiased text-gray-800">{renderPortal()}</div>;
};

export default App;