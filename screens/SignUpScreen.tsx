import React, { useState } from 'react';
import type { Role } from '../App';
import type { Employee } from '../types';
import { BriefcaseIcon } from '../components/icons';
import { ALL_ROLES } from '../constants';

interface SignUpScreenProps {
  onSignUp: (newEmployee: Omit<Employee, 'id'>) => void;
  onNavigateToLogin: () => void;
  employees: Employee[];
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin, employees }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('hiring');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !role) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (employees.some(emp => emp.email === email)) {
        setError('An account with this email already exists.');
        return;
    }

    onSignUp({ name, email, role, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <BriefcaseIcon className="h-10 w-10 text-accent-400" />
            <span className="text-white text-3xl mx-2 font-bold">RecruitSys</span>
          </div>
          <p className="text-gray-400">Create a new account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
           <div>
            <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
            <div className="mt-1">
              <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium">Email address</label>
            <div className="mt-1">
              <input id="email-signup" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., jane.doe@example.com" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm" />
            </div>
          </div>
           <div>
                <label htmlFor="role" className="block text-sm font-medium">Role / Department</label>
                <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md">
                    {ALL_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium">Password</label>
            <div className="mt-1">
              <input id="password-signup" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium">Confirm Password</label>
            <div className="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
                <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent-500 transition-colors">
              Create Account
            </button>
          </div>
        </form>

        <p className="text-sm text-center">
            Already have an account?{' '}
            <button onClick={onNavigateToLogin} className="font-medium text-accent-400 hover:text-accent-300 focus:outline-none">
                Sign in
            </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
