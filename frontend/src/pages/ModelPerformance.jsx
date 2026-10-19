import React from 'react';
import { Activity, BarChart2, GitCommit, Layers } from 'lucide-react';

export default function ModelPerformance() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Model Performance Metrics</h1>
                <p className="text-gray-500">Evaluate the accuracy and reliability of the predictive models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-indigo-500" />
                        <h3 className="font-bold text-gray-900">Accuracy</h3>
                    </div>
                    <p className="text-3xl font-bold">94.8%</p>
                    <p className="text-sm text-green-600">+1.2% from last validation</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart2 className="text-blue-500" />
                        <h3 className="font-bold text-gray-900">AUC-ROC</h3>
                    </div>
                    <p className="text-3xl font-bold">0.96</p>
                    <p className="text-sm text-gray-500">Excellent discrimination</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Layers className="text-purple-500" />
                        <h3 className="font-bold text-gray-900">F1 Score</h3>
                    </div>
                    <p className="text-3xl font-bold">0.92</p>
                    <p className="text-sm text-gray-500">Balanced precision/recall</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center min-h-[400px] flex flex-col items-center justify-center">
                <h3 className="text-xl font-medium text-gray-500 mb-4">Detailed ROC Curves & Confusion Matrices Loading...</h3>
                <p className="text-gray-400">This section will contain detailed interactive charts.</p>
            </div>
        </div>
    );
}
