
import React, { useState } from 'react';
import { BriefcaseIcon } from '../components/icons';
import type { Employee } from '../types';

interface LoginScreenProps {
  onLogin: (employee: Employee) => void;
  employees: Employee[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, employees }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const employee = employees.find(emp => emp.email === email);

    if (employee && employee.password === password) {
      onLogin(employee);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-10 w-10 text-accent-400"/>
                <span className="text-white text-3xl mx-2 font-bold">RecruitSys</span>
            </div>
            <p className="text-gray-400">Sign in to your corporate account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your company email"
                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
                <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent-500 transition-colors"
            >
              Sign in
            </button>
          </div>
           <div className="text-center text-xs text-gray-500">
            <p>Restricted Access. Authorized Personnel Only.</p>
            <p className="mt-1">Contact the administrator to create a new staff account.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
