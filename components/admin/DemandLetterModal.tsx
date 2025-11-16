import React, { useState } from 'react';
import type { DemandLetter } from '../../types';

interface DemandLetterModalProps {
    demandLetter: DemandLetter | null;
    onClose: () => void;
    onSave: (demandLetterData: { clinicName: string; positions: number; }) => void;
}

const DemandLetterModal: React.FC<DemandLetterModalProps> = ({ demandLetter, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        clinicName: demandLetter?.clinicName || '',
        positions: demandLetter?.positions.toString() || '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const positionsNumber = parseInt(formData.positions, 10);
        if (!formData.clinicName.trim()) {
            setError("Clinic name is required.");
            return;
        }
        if (isNaN(positionsNumber) || positionsNumber <= 0) {
            setError("Please enter a valid, positive number for positions.");
            return;
        }
        setError('');
        onSave({
            clinicName: formData.clinicName,
            positions: positionsNumber,
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-4">{demandLetter ? 'Edit Demand Letter' : 'Add New Demand Letter'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                        <input type="text" name="clinicName" id="clinicName" value={formData.clinicName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label htmlFor="positions" className="block text-sm font-medium text-gray-700">Number of Positions</label>
                        <input type="number" name="positions" id="positions" value={formData.positions} onChange={handleChange} required min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DemandLetterModal;
