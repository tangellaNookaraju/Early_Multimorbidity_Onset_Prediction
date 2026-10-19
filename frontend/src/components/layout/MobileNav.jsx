import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, UserPlus, TrendingUp, User } from 'lucide-react';
import clsx from 'clsx';

const MobileLink = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                "flex flex-col items-center justify-center w-full h-full py-1 transition-colors relative",
                isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
            )
        }
    >
        {({ isActive }) => (
            <>
                {isActive && (
                    <span className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full shadow-sm" />
                )}
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={clsx("mb-1 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-medium">{label}</span>
            </>
        )}
    </NavLink>
);

export default function MobileNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-between px-2 z-50 lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
            <MobileLink to="/" icon={Home} label="Home" />
            <MobileLink to="/upload" icon={Upload} label="Upload" />
            <MobileLink to="/risk-analysis" icon={UserPlus} label="Risk" />
            <MobileLink to="/models" icon={TrendingUp} label="Models" />
            <MobileLink to="/profile" icon={User} label="Profile" />
        </nav>
    );
}
