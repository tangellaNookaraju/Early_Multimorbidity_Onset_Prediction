import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Shield, Activity, Users, ArrowRight, Zap, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
    >
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <HeartPulse size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Multimorbidity Prediction System</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">How it works</a>
                        <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Sign In</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-60"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100">
                        <Zap size={14} /> Next-Gen Healthcare Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
                        Predict Disease Before It Happens.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        MultiPredict AI uses longitudinal EHR data and advanced machine learning to predict the early onset of multimorbidity, helping clinicians provide proactive care.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group">
                            Start Predicting Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all">
                            Clinician Sign In
                        </Link>
                    </div>
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40">
                        <div className="flex items-center gap-2"><CheckCircle size={18} /> HIPAA Compliant</div>
                        <div className="flex items-center gap-2"><CheckCircle size={18} /> AI Powered</div>
                        <div className="flex items-center gap-2"><CheckCircle size={18} /> Real-time Analytics</div>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}
