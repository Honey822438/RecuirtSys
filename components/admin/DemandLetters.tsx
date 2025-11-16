import React, { useState } from 'react';
import type { DemandLetter } from '../../types';
import DemandLetterModal from './DemandLetterModal';

interface DemandLettersProps {
    demandLetters: DemandLetter[];
    setDemandLetters: (letters: DemandLetter[]) => void;
}

const DemandLetters: React.FC<DemandLettersProps> = ({ demandLetters, setDemandLetters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<DemandLetter | null>(null);

    const handleAdd = () => {
        setSelectedLetter(null);
        setIsModalOpen(true);
    };

    const handleEdit = (letter: DemandLetter) => {
        setSelectedLetter(letter);
        setIsModalOpen(true);
    };

    const handleSave = (demandLetterData: { clinicName: string; positions: number }) => {
        if (selectedLetter) {
            // Edit existing
            setDemandLetters(demandLetters.map(d =>
                d.id === selectedLetter.id
                    ? { ...d, ...demandLetterData }
                    : d
            ));
        } else {
            // Add new
            const newLetter: DemandLetter = {
                id: `dem_${Date.now()}`,
                clinicName: demandLetterData.clinicName,
                positions: demandLetterData.positions,
                status: 'Active',
            };
            setDemandLetters([...demandLetters, newLetter]);
        }
        setIsModalOpen(false);
        setSelectedLetter(null);
    };

    const toggleStatus = (id: string) => {
        setDemandLetters(demandLetters.map(d => {
            if (d.id === id) {
                return { ...d, status: d.status === 'Active' ? 'Fulfilled' : 'Active' };
            }
            return d;
        }));
    };

    const handleRemove = (id: string) => {
        if (confirm("Are you sure you want to remove this demand letter?")) {
            setDemandLetters(demandLetters.filter(d => d.id !== id));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {isModalOpen && (
                <DemandLetterModal
                    demandLetter={selectedLetter}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Client Demand Letters ({demandLetters.length})</h3>
                <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                    Add Demand Letter
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Positions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {demandLetters.map(letter => (
                            <tr key={letter.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold">{letter.clinicName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{letter.positions}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${letter.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {letter.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => handleEdit(letter)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                    <button onClick={() => toggleStatus(letter.id)} className="text-primary-600 hover:text-primary-800">
                                        Mark as {letter.status === 'Active' ? 'Fulfilled' : 'Active'}
                                    </button>
                                     <button onClick={() => handleRemove(letter.id)} className="text-red-600 hover:text-red-800">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DemandLetters;