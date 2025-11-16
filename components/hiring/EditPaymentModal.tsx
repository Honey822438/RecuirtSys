import React, { useState } from 'react';
import type { Candidate, Payment } from '../../types';

interface EditPaymentModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSave: (payment: Payment) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
    </div>
);

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ candidate, onClose, onSave }) => {
  const [payment, setPayment] = useState<Payment>(candidate.payment);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(payment.agreed)) || isNaN(Number(payment.additional)) || isNaN(Number(payment.received))) {
      setError('All payment fields must be valid numbers.');
      return;
    }
    setError('');
    onSave({
        agreed: Number(payment.agreed),
        additional: Number(payment.additional),
        received: Number(payment.received),
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Edit Payment for {candidate.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <InputField 
            label="Agreed Amount ($)"
            id="agreed"
            name="agreed"
            type="number"
            value={payment.agreed}
            onChange={handleChange}
            required
          />
          <InputField 
            label="Additional Charges ($)"
            id="additional"
            name="additional"
            type="number"
            value={payment.additional}
            onChange={handleChange}
            required
          />
          <InputField 
            label="Total Amount Received ($)"
            id="received"
            name="received"
            type="number"
            value={payment.received}
            onChange={handleChange}
            required
          />
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

export default EditPaymentModal;