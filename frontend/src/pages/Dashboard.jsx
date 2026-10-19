import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, CheckCircle, Activity, ArrowUpRight, ArrowDownRight, Power } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, change, changeType, icon: Icon, colorClass }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={clsx("p-2 rounded-lg", colorClass)}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                changeType === 'increase' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            )}>
                {changeType === 'increase' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
        </div>
    </motion.div>
);

export default function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [analyses, setAnalyses] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        high: 0,
        medium: 0,
        low: 0
    });

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/analyses');
                const data = response.data;
                setAnalyses(data);

                const high = data.filter(a => a.risk_level === 'High').length;
                const medium = data.filter(a => a.risk_level === 'Medium').length;
                const low = data.filter(a => a.risk_level === 'Low').length;

                setStats({
                    total: data.length,
                    high,
                    medium,
                    low
                });
            } catch (error) {
                console.error("Error fetching analyses:", error);
            }
        };
        fetchAnalyses();
    }, []);

    const chartData = [
        { name: 'Mon', risk: 20 },
        { name: 'Tue', risk: 22 },
        { name: 'Wed', risk: 25 },
        { name: 'Thu', risk: 24 },
        { name: 'Fri', risk: 28 },
        { name: 'Sat', risk: 35 },
        { name: 'Sun', risk: stats.total > 0 ? (stats.high / stats.total) * 100 : 32 },
    ];

    const riskDistribution = [
        { name: 'High Risk', value: stats.high, color: '#EF4444' },
        { name: 'Medium Risk', value: stats.medium, color: '#F59E0B' },
        { name: 'Low Risk', value: stats.low, color: '#10B981' },
    ].filter(r => r.value > 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Real-time patient risk metrics from MongoDB.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-100 shadow-sm transition-all font-medium"
                >
                    <Power size={18} />
                    <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Assessments"
                    value={stats.total}
                    change="+12%"
                    changeType="increase"
                    icon={Users}
                    colorClass="bg-indigo-500"
                />
                <StatCard
                    title="High Risk Cases"
                    value={stats.high}
                    change="-4.5%"
                    changeType="decrease"
                    icon={AlertTriangle}
                    colorClass="bg-red-500"
                />
                <StatCard
                    title="Low Risk (Stable)"
                    value={stats.low}
                    change="+2.4%"
                    changeType="increase"
                    icon={CheckCircle}
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="Model Health"
                    value="94.2%"
                    change="+0.8%"
                    changeType="increase"
                    icon={Activity}
                    colorClass="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Trend Analysis</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="risk" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution.length > 0 ? riskDistribution : [{ name: 'No data', value: 1, color: '#E5E7EB' }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(riskDistribution.length > 0 ? riskDistribution : [{ color: '#E5E7EB' }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Assessments (Live)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4">Assessment ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Risk Score</th>
                                <th className="px-6 py-4">Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {analyses.slice().reverse().map((analysis) => (
                                <tr key={analysis._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{analysis._id.substring(0, 8)}</td>
                                    <td className="px-6 py-4">{new Date(analysis.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{(analysis.risk_score * 100).toFixed(1)}%</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium",
                                            analysis.risk_level === 'High' ? "bg-red-100 text-red-700" :
                                                analysis.risk_level === 'Medium' ? "bg-amber-100 text-amber-700" :
                                                    "bg-green-100 text-green-700")
                                        }>
                                            {analysis.risk_level}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {analyses.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No assessments found in database. Run a prediction to see data here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
