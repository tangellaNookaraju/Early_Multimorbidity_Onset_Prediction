import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';

export default function MainLayout() {
    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-rose-50/90 via-white/90 to-red-50/90 flex flex-col font-sans text-gray-900 bg-fixed bg-cover bg-center"
            style={{ 
                backgroundImage: `url('/bg-healthcare.png')`,
                backgroundBlendMode: 'overlay'
            }}
        >
            <TopNavbar />

            {/* Main Content Area */}
            <main className="flex-1 pt-16 flex flex-col min-h-screen transition-all duration-300">
                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
