import React, { useState } from 'react';
import type { Candidate, Guardian } from '../types';
import { CustomerType } from '../types';

interface AddCustomerModalProps {
  onClose: () => void;
  onAddCandidate: (candidateData: Omit<Candidate, 'id' | 'avatarUrl' | 'progress' | 'documents' | 'workflowStatus' | 'videos' | 'medicalStatus' | 'payment'> & { payment: { agreed: number } }) => void;
}

const MOCK_HIRING_OFFICERS = [
  { id: 'officer_01', name: 'Mr. Khan' },
  { id: 'officer_02', name: 'Ms. Fatima' },
];

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

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, onAddCandidate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agreedPayment: '',
    bankAccount: '',
    guardianRelation: 'Father' as Guardian['relation'],
    guardianCnic: '',
    guardianContact: '',
    hiringOfficerId: MOCK_HIRING_OFFICERS[0].id,
    customerType: CustomerType.Fresh,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        setError('All fields are required.');
        return;
      }
    }
    
    const agreedPaymentNumber = parseFloat(formData.agreedPayment);
    if (isNaN(agreedPaymentNumber)) {
        setError('Agreed payment must be a valid number.');
        return;
    }

    setError('');
    
    onAddCandidate({
      name: formData.name,
      email: formData.email,
      payment: { agreed: agreedPaymentNumber },
      bankAccount: formData.bankAccount,
      guardian: {
        relation: formData.guardianRelation,
        cnic: formData.guardianCnic,
        contactNumber: formData.guardianContact,
      },
      hiringOfficerId: formData.hiringOfficerId,
      customerType: formData.customerType,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-xl leading-6 font-bold text-gray-900 border-b pb-4">Add New Customer Entry</h3>
          <form onSubmit={handleSubmit} className="mt-4 text-left space-y-6 p-4">
             {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold text-gray-700 px-2">Personal Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <InputField label="Full Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                    <InputField label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
            </fieldset>
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold text-gray-700 px-2">Classification</legend>
                 <div className="mt-2">
                    <SelectField label="Customer Type" id="customerType" name="customerType" value={formData.customerType} onChange={handleChange}>
                        {Object.values(CustomerType).map(type => <option key={type} value={type}>{type}</option>)}
                    </SelectField>
                </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold text-gray-700 px-2">Guardian Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <SelectField label="Relation" id="guardianRelation" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange}>
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Husband</option>
                        <option>Brother</option>
                    </SelectField>
                    <InputField label="Guardian CNIC" id="guardianCnic" name="guardianCnic" type="text" value={formData.guardianCnic} onChange={handleChange} placeholder="e.g., 12345-6789012-3" required />
                    <InputField label="Guardian Contact" id="guardianContact" name="guardianContact" type="tel" value={formData.guardianContact} onChange={handleChange} placeholder="e.g., +92 300 1234567" required />
                </div>
            </fieldset>
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold text-gray-700 px-2">Financials & Assignment</legend>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField label="Agreed Payment ($)" id="agreedPayment" name="agreedPayment" type="number" value={formData.agreedPayment} onChange={handleChange} required />
                    <InputField label="Bank Account Number" id="bankAccount" name="bankAccount" type="text" value={formData.bankAccount} onChange={handleChange} required />
                    <SelectField label="Assign to Hiring Officer" id="hiringOfficerId" name="hiringOfficerId" value={formData.hiringOfficerId} onChange={handleChange}>
                        {MOCK_HIRING_OFFICERS.map(officer => (
                            <option key={officer.id} value={officer.id}>{officer.name}</option>
                        ))}
                    </SelectField>
                </div>
            </fieldset>

            <div className="items-center px-4 py-3 flex justify-end gap-3 bg-gray-50 -mx-5 -mb-5 rounded-b-md">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
