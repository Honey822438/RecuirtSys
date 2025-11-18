
import { MOCK_CANDIDATES, MOCK_EMPLOYEES, MOCK_DEMAND_LETTERS } from './constants';
import type { Candidate, Employee, DemandLetter } from './types';

// Updated keys to PROD_V1 to clear old mock data and simulate a fresh production database
const CANDIDATES_KEY = 'RECRUITSYS_CANDIDATES_PROD_V1';
const EMPLOYEES_KEY = 'RECRUITSYS_EMPLOYEES_PROD_V1';
const DEMAND_LETTERS_KEY = 'RECRUITSYS_DEMAND_LETTERS_PROD_V1';

function getData<T>(key: string, fallbackData: T[]): T[] {
  try {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
  }
  
  // If no data, or if there's an error, use fallback and store it.
  localStorage.setItem(key, JSON.stringify(fallbackData));
  return fallbackData;
}

function setData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
}

// Candidate Functions
export const getCandidates = (): Candidate[] => getData<Candidate>(CANDIDATES_KEY, MOCK_CANDIDATES);
export const setCandidates = (candidates: Candidate[]): void => setData<Candidate>(CANDIDATES_KEY, candidates);

// Employee Functions
export const getEmployees = (): Employee[] => getData<Employee>(EMPLOYEES_KEY, MOCK_EMPLOYEES);
export const setEmployees = (employees: Employee[]): void => setData<Employee>(EMPLOYEES_KEY, employees);

// Demand Letter Functions
export const getDemandLetters = (): DemandLetter[] => getData<DemandLetter>(DEMAND_LETTERS_KEY, MOCK_DEMAND_LETTERS);
export const setDemandLetters = (demandLetters: DemandLetter[]): void => setData<DemandLetter>(DEMAND_LETTERS_KEY, demandLetters);
