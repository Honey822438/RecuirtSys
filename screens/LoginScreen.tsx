import React from 'react';
import type { Role } from '../App';
import { BriefcaseIcon } from '../components/icons';
import { ALL_ROLES } from '../constants';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-10 w-10 text-primary-600"/>
                <span className="text-gray-800 text-3xl mx-2 font-bold">RecruitSys</span>
            </div>
            <p className="text-gray-500">Select a role to log in</p>
        </div>
        
        <div className="space-y-3">
          {ALL_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onLogin(role.id)}
              className="w-full px-4 py-3 font-semibold text-left text-primary-800 bg-primary-50 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Log in as <span className="font-bold">{role.name}</span>
            </button>
          ))}
        </div>
         <div className="text-center text-xs text-gray-400 pt-4">System Color: Gray</div>
      </div>
    </div>
  );
};

export default LoginScreen;
