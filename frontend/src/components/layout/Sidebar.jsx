import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, UserPlus, TrendingUp, HelpCircle, User, LogOut, HeartPulse } from 'lucide-react';
import clsx from 'clsx';

const SidebarLink = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                    ? "bg-indigo-600 text-white shadow-md font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )
        }
    >
        <Icon size={20} className={clsx("transition-transform group-hover:scale-110")} />
        <span className="text-sm">{label}</span>
    </NavLink>
);

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-gray-900 border-r border-gray-800 fixed left-0 top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-3 px-6 h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <HeartPulse size={24} className="animate-pulse-slow" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">EMOPS</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Medical AI Study</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 mt-2">Dashboard</div>
                <SidebarLink to="/" icon={Home} label="Overview" />
                <SidebarLink to="/upload" icon={Upload} label="Upload Data" />

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 mt-6">Analysis</div>
                <SidebarLink to="/risk-analysis" icon={UserPlus} label="Patient Risk" />
                <SidebarLink to="/models" icon={TrendingUp} label="Model Performance" />
                <SidebarLink to="/explainability" icon={HelpCircle} label="Explainability" />

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 mt-6">Settings</div>
                <SidebarLink to="/profile" icon={User} label="Profile" />
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
