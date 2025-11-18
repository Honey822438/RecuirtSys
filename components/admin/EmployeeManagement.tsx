
import React, { useState } from 'react';
import type { Employee } from '../../types';
import type { Role } from '../../App';
import { ALL_ROLES } from '../../constants';

interface EmployeeManagementProps {
    employees: Employee[];
    setEmployees: (employees: Employee[]) => void;
}

interface EmployeeModalProps {
    employee: Employee | null;
    onClose: () => void;
    onSave: (employee: Partial<Employee>) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: employee?.id || `emp_${Date.now()}`,
        name: employee?.name || '',
        email: employee?.email || '',
        role: employee?.role || 'hiring',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Partial<Employee>);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {employee ? 'New Password (leave blank to keep current)' : 'Initial Password'}
                        </label>
                        <input 
                            type="text" 
                            name="password" 
                            id="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required={!employee}
                            placeholder={employee ? "••••••••" : "Enter initial password"}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        {!employee && <p className="text-xs text-gray-500 mt-1">Please share this password with the employee. They cannot create an account themselves.</p>}
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                           {ALL_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
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


const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, setEmployees }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [filterRole, setFilterRole] = useState<Role | 'all'>('all');

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleSave = (employeeData: Partial<Employee>) => {
        if (selectedEmployee) {
            // Update existing
            setEmployees(employees.map(e => {
                if (e.id === employeeData.id) {
                    // If password was entered, update it. Otherwise keep existing.
                    const updatedPassword = employeeData.password && employeeData.password.trim() !== '' 
                        ? employeeData.password 
                        : e.password;
                    
                    return { 
                        ...e, 
                        name: employeeData.name!,
                        email: employeeData.email!,
                        role: employeeData.role as Role,
                        password: updatedPassword
                    };
                }
                return e;
            }));
        } else {
            // Add new
            const newEmployee: Employee = {
                id: employeeData.id!,
                name: employeeData.name!,
                email: employeeData.email!,
                role: employeeData.role as Role,
                password: employeeData.password! // Required in form
            };
            setEmployees([...employees, newEmployee]);
        }
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };
    
    const handleResetPassword = (employee: Employee) => {
        alert(`Password reset link sent to ${employee.email}`);
    };

    const filteredEmployees = employees.filter(emp => filterRole === 'all' || emp.role === filterRole);
    
    const TABS: { id: Role | 'all'; name: string }[] = [{ id: 'all', name: 'All Departments' }, ...ALL_ROLES];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {isModalOpen && <EmployeeModal employee={selectedEmployee} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">System Users ({filteredEmployees.length})</h3>
                <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                    Add Employee
                </button>
            </div>
             <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterRole(tab.id)}
                            className={`${
                            filterRole === tab.id
                                ? 'border-accent-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-semibold">{emp.name}</div>
                                    <div className="text-sm text-gray-500">{emp.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ALL_ROLES.find(r => r.id === emp.role)?.name || emp.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => handleEdit(emp)} className="text-primary-600 hover:text-primary-800">Edit</button>
                                    <button onClick={() => handleResetPassword(emp)} className="text-yellow-600 hover:text-yellow-800">Reset Password</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeManagement;
