import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    Upload,
    Users,
    Stethoscope,
    Microscope,
    BarChart3,
    LogOut,
    Menu,
    X,
    User,
    Droplet
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 text-xs font-black uppercase tracking-[0.15em]",
                isActive
                    ? "bg-rose-500/10 text-rose-600 shadow-[inset_0_0_0_1px_rgba(225,29,72,0.2)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-rose-600"
            )
        }
    >
        <Icon size={16} strokeWidth={2.5} />
        <span>{label}</span>
    </NavLink>
);

export default function TopNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    const userInitials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : '??';

    return (
        <nav className="glass sticky top-0 z-50 border-b border-rose-100 shadow-sm bg-white/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex justify-between items-center h-24">
                    {/* Logo Section */}
                    <NavLink to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-600 transition-colors duration-300">
                            <Droplet className="text-rose-600 group-hover:text-white transition-colors duration-300" size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-red-800 tracking-tighter uppercase leading-none">
                                MultiPredict
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
                                Anemia & Leukemia AI
                            </span>
                        </div>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        <NavItem to="/dashboard" icon={Home} label="Overview" />
                        <NavItem to="/patients" icon={Users} label="Patients" />
                        <NavItem to="/upload" icon={Upload} label="Upload" />
                        <NavItem to="/risk-analysis" icon={Stethoscope} label="Predict Risk" />
                        <NavItem to="/history" icon={Microscope} label="Reports" />
                        {user?.role === 'admin' && <NavItem to="/analytics" icon={BarChart3} label="Analytics" />}
                    </div>

                    {/* Right Section (Profile & Logout) */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4">
                            <NavLink to="/profile" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-sm shadow-sm border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 group-hover:scale-105">
                                    {userInitials}
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-700 group-hover:text-rose-600 transition-colors">
                                    {user?.full_name || 'Profile'}
                                </span>
                            </NavLink>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-slate-50 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-rose-500/25"
                            >
                                <LogOut size={14} strokeWidth={3} />
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <div className="lg:hidden flex items-center gap-3">
                            <div className="md:hidden">
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-slate-500 bg-slate-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    title="Logout"
                                >
                                    <LogOut size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all bg-white border border-slate-100 shadow-sm"
                            >
                                {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-rose-100 absolute w-full shadow-2xl origin-top animate-in slide-in-from-top-2 duration-300">
                    <div className="px-6 py-6 space-y-2">
                        <NavItem to="/dashboard" icon={Home} label="Overview" onClick={() => setIsMenuOpen(false)} />
                        <NavItem to="/patients" icon={Users} label="Patients" onClick={() => setIsMenuOpen(false)} />
                        <NavItem to="/upload" icon={Upload} label="Upload" onClick={() => setIsMenuOpen(false)} />
                        <NavItem to="/risk-analysis" icon={Stethoscope} label="Predict Risk" onClick={() => setIsMenuOpen(false)} />
                        <NavItem to="/history" icon={Microscope} label="Reports" onClick={() => setIsMenuOpen(false)} />
                        {user?.role === 'admin' && <NavItem to="/analytics" icon={BarChart3} label="Analytics" onClick={() => setIsMenuOpen(false)} />}
                        
                        <div className="h-px bg-slate-100 my-4"></div>
                        
                        <NavItem to="/profile" icon={User} label="Profile" onClick={() => setIsMenuOpen(false)} />
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-[0.15em] text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                        >
                            <LogOut size={16} strokeWidth={2.5} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
