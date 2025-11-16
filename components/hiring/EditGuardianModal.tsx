import React, { useState } from 'react';
import type { Candidate, Guardian } from '../../types';

interface EditGuardianModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSave: (guardian: Guardian, bankAccount: string) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            {children}
        </select>
    </div>
);

const EditGuardianModal: React.FC<EditGuardianModalProps> = ({ candidate, onClose, onSave }) => {
  const [guardian, setGuardian] = useState<Guardian>(candidate.guardian);
  const [bankAccount, setBankAccount] = useState<string>(candidate.bankAccount);

  const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuardian(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(guardian, bankAccount);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Edit Guardian & Bank Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <SelectField label="Relation" id="relation" name="relation" value={guardian.relation} onChange={handleGuardianChange}>
                <option>Father</option>
                <option>Mother</option>
                <option>Husband</option>
                <option>Brother</option>
            </SelectField>
            <InputField label="Guardian CNIC" id="cnic" name="cnic" type="text" value={guardian.cnic} onChange={handleGuardianChange} required />
            <InputField label="Guardian Contact" id="contactNumber" name="contactNumber" type="tel" value={guardian.contactNumber} onChange={handleGuardianChange} required />
            <InputField label="Bank Account Number" id="bankAccount" name="bankAccount" type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required />

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel
                </button>
                <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditGuardianModal;