
import { Candidate, Employee, DemandLetter } from './types';
import type { Role } from './App';

export const MOCK_CANDIDATES: Candidate[] = [];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp_admin_001', name: 'System Administrator', role: 'admin', email: 'admin@recruitsys.com', password: 'admin' },
];

export const MOCK_DEMAND_LETTERS: DemandLetter[] = [];

export const ALL_ROLES: { id: Role; name: string }[] = [
  { id: 'admin', name: 'Admin' },
  { id: 'entry', name: 'Entry Management' },
  { id: 'hiring', name: 'Hiring Officer' },
  { id: 'dataflow', name: 'Dataflow Management' },
  { id: 'mumaris', name: 'Mumaris Plus' },
  { id: 'qvp', name: 'QVP' },
  { id: 'embassy', name: 'Embassy Cases' },
  { id: 'bureau', name: 'Bureau Processing' },
  { id: 'protector', name: 'Protector Processing' },
];
