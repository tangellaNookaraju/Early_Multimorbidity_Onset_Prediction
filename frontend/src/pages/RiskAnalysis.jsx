import React, { useState, useEffect } from 'react';
import { Activity, Heart, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function RiskAnalysis() {
    const [formData, setFormData] = useState({
        age: 50,
        systolic_bp: 120,
        diastolic_bp: 80,
        bmi: 25.0,
        hba1c: 5.5,
        cholesterol: 200,
        creatinine: 1.0
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        setSelectedPatient(patientId);
        if (patientId) {
            const patient = patients.find(p => p._id === patientId);
            if (patient) {
                setFormData({
                    ...formData,
                    age: patient.age,
                    bmi: patient.bmi,
                    patient_id: patientId
                });
            }
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: val === "" ? "" : parseFloat(val)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        // Basic validation before sending
        const missingFields = Object.entries(formData).filter(([k, v]) => v === "" || Number.isNaN(v));
        if (missingFields.length > 0) {
            setError(`Please fill in all numeric fields correctly. Missing: ${missingFields.map(m => m[0]).join(', ')}`);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResult(response.data);
        } catch (err) {
            console.error("Prediction error:", err);
            let errMsg = null;
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                if (Array.isArray(detail)) {
                    errMsg = detail.map(d => `${d.loc ? d.loc[d.loc.length-1] : 'Field'}: ${d.msg}`);
                } else {
                    errMsg = detail;
                }
            } else {
                errMsg = "Failed to connect to the prediction server.";
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Risk Analysis</h1>
                <p className="text-gray-500">Calculate single-patient risk using the ML inference engine.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Activity className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Clinical Vitals</h3>
                        </div>
                        <select
                            value={selectedPatient}
                            onChange={handlePatientChange}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Select Patient (Optional)</option>
                            {patients.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={18} />
                                    <span>Prediction Error</span>
                                </div>
                                {Array.isArray(error) ? (
                                    <ul className="list-disc pl-6">
                                        {error.map((e, idx) => <li key={idx}>{e}</li>)}
                                    </ul>
                                ) : (
                                    <p className="pl-6">{error}</p>
                                )}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">BMI (kg/m²)</label>
                                <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl md:col-span-2 grid grid-cols-2 gap-4 border border-gray-100">
                                <p className="md:col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Blood Pressure</p>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Systolic</label>
                                    <input type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Diastolic</label>
                                    <input type="number" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">HbA1c (%)</label>
                                <input type="number" step="0.1" name="hba1c" value={formData.hba1c} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Creatinine (mg/dL)</label>
                                <input type="number" step="0.1" name="creatinine" value={formData.creatinine} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cholesterol (mg/dL)</label>
                                <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Running Model Inference...
                                    </span>
                                ) : 'Predict Risk Score'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Results Panel */}
                <div className="space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={clsx(
                                "p-8 rounded-2xl border-2 shadow-xl shadow-gray-200 text-center bg-white h-full flex flex-col items-center justify-center relative overflow-hidden",
                                {
                                    'border-red-100': result.risk_level === 'High',
                                    'border-yellow-100': result.risk_level === 'Medium',
                                    'border-green-100': result.risk_level === 'Low' || !result.risk_level
                                }
                            )}
                        >
                            <div className={clsx("absolute top-0 left-0 w-full h-2", {
                                'bg-red-500': result.risk_level === 'High',
                                'bg-yellow-500': result.risk_level === 'Medium',
                                'bg-green-500': result.risk_level === 'Low' || !result.risk_level
                            })}></div>

                            <div className={clsx(
                                "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 text-white text-3xl font-bold shadow-lg ring-4 ring-opacity-20",
                                {
                                    'bg-red-500 ring-red-500 shadow-red-500/40': result.risk_level === 'High',
                                    'bg-yellow-500 ring-yellow-500 shadow-yellow-500/40': result.risk_level === 'Medium',
                                    'bg-green-500 ring-green-500 shadow-green-500/40': result.risk_level === 'Low' || !result.risk_level
                                }
                            )}>
                                {(result.probability * 100).toFixed(0)}%
                            </div>

                            <h3 className={clsx("text-3xl font-bold mb-2", {
                                'text-red-600': result.risk_level === 'High',
                                'text-yellow-600': result.risk_level === 'Medium',
                                'text-green-600': result.risk_level === 'Low' || !result.risk_level
                            })}>
                                {result.risk_level} Risk
                            </h3>

                            {result.predicted_diseases && result.predicted_diseases.length > 0 && (
                                <div className="mb-6 w-full">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Likely Combinations</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {result.predicted_diseases.map(disease => (
                                            <span key={disease} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-bold border border-gray-100">
                                                {disease}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-gray-500 mb-8 max-w-[200px] text-sm leading-relaxed">Probability of multimorbidity onset within our specified window.</p>

                            <button className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                <Activity size={16} /> View Analysis
                            </button>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Activity size={32} className="text-gray-300" />
                            </div>
                            <h3 className="font-bold text-gray-900">No Assessment Run</h3>
                            <p className="text-sm text-gray-400 mt-2 max-w-[200px]">Complete the patient vitals form to generate a risk profile.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
