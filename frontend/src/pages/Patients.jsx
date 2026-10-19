import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, MoreVertical, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: 'Male',
        bmi: '',
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/patients', {
                ...newPatient,
                age: parseInt(newPatient.age),
                bmi: parseFloat(newPatient.bmi)
            });
            setIsAddModalOpen(false);
            setNewPatient({ name: '', age: '', gender: 'Male', bmi: '' });
            fetchPatients();
        } catch (error) {
            console.error("Error adding patient:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
                    <p className="text-gray-500">Manage and monitor patient health records.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                    <UserPlus size={18} />
                    <span>Add New Patient</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patients by name or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                    <motion.div
                        key={patient._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                        <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                            <MoreVertical size={16} />
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{patient.name}</h3>
                                <p className="text-xs text-gray-500">ID: {patient._id.substring(0, 8)}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{patient.age} years • {patient.gender}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-medium">BMI:</span>
                                <span>{patient.bmi} kg/m²</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                                View History
                            </button>
                            <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                Run Risk Test
                            </button>
                        </div>
                    </motion.div>
                ))}

                {patients.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-100">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-900">No patients yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">Add your first patient to start tracking multimorbidity risks.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Add New Patient
                        </button>
                    </div>
                )}
            </div>

            {/* Add Patient Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Patient</h2>
                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        required
                                        type="number"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">BMI (kg/m²)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.1"
                                    value={newPatient.bmi}
                                    onChange={(e) => setNewPatient({ ...newPatient, bmi: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 text-sm"
                                >
                                    Save Patient
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

