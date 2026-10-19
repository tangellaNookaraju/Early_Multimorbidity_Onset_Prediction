import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Check, X, Edit2 } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEdit = () => {
        setFormData({
            full_name: user?.full_name || '',
            email: user?.email || '',
        });
        setIsEditing(true);
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:8000/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsEditing(false);
        } catch (err) {
            let detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                detail = detail.map(d => `${d.loc ? d.loc[d.loc.length-1] : 'Field'}: ${d.msg}`).join(', ');
            }
            setError(detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-gray-500">Manage your account information and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-lg flex-shrink-0">
                            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.full_name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        {!isEditing ? (
                            <button 
                                onClick={handleEdit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent flex items-center justify-center rounded-full animate-spin"></span> : <Check size={16} />}
                                    Save Options
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="text-xl font-bold text-gray-900 border-b-2 border-indigo-500 bg-gray-50 focus:outline-none focus:bg-white w-full max-w-sm px-2 py-1 rounded-t-md"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
                            )}
                            <p className="text-sm text-gray-500 mt-1">Medical Clinician / AI Researcher</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 h-20">
                                <Mail className="text-indigo-600 flex-shrink-0" size={20} />
                                <div className="w-full">
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Email Address</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="text-sm font-medium text-gray-900 border-b-2 border-indigo-500 bg-transparent focus:outline-none w-full"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 h-20">
                                <Shield className="text-indigo-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Role</p>
                                    <p className="text-sm font-medium text-gray-900 capitalize">{user?.role || 'Physician-Level Access'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
